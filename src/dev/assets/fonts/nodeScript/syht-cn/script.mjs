/* eslint-env node */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { runInitScript } from 'cn-font-split/dist/init.mjs';
import { matchPlatform, getBinName } from 'cn-font-split/dist/load.mjs';
import { isMusl } from 'cn-font-split/dist/node/isMusl.mjs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= 配置区域 =================

// 1. 输入字体路径 (请修改这里为你实际的文件路径)
const INPUT_FILE = path.resolve(__dirname, './SourceHanSansCN-VF.ttf');

// 2. 输出目录
const OUTPUT_DIR = path.resolve(__dirname, './dist');

// 3. 字体基础信息配置
const FONT_CONFIG = {
    family: 'syht-cn-v',          // CSS 中使用的字体名称
    localFamily: ['syht-cn-v'], // 优先匹配用户本地安装的字体
    fontWeight: '100 900'         // 【关键】可变字体必须设置范围，普通字体填 '400'
};

// ===========================================

function getFontSplitCorePath() {
    const pkgPath = require.resolve('cn-font-split/package.json');
    const distDir = path.join(path.dirname(pkgPath), 'dist');
    const binName = getBinName(matchPlatform(process.platform, process.arch, isMusl));
    return path.join(distDir, binName);
}

async function ensureFontSplitCore() {
    const corePath = getFontSplitCorePath();

    if (fs.existsSync(corePath)) {
        return corePath;
    }

    console.log('⚠️ 检测到 cn-font-split 核心缺失，正在执行 init 安装...');
    const originalArgv = process.argv;

    try {
        process.argv = ['node', 'cn-font-split', 'i', 'default'];
        await runInitScript();
    } finally {
        process.argv = originalArgv;
    }

    if (!fs.existsSync(corePath)) {
        throw new Error('cn-font-split 核心安装失败，请检查网络后手动运行 `npx cn-font-split i default`');
    }

    console.log(`✅ cn-font-split 核心就绪: ${corePath}`);
    return corePath;
}

async function build() {
    console.log(`🚀 开始处理字体: ${INPUT_FILE}`);
    console.time('构建耗时');

    // 检查文件是否存在
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ 错误: 找不到文件 ${INPUT_FILE}，请确认路径正确。`);
        return;
    }

    // 确保 cn-font-split 所需的原生核心存在
    await ensureFontSplitCore();

    const { fontSplit } = await import('cn-font-split');

    // 读取文件 buffer
    const inputBuffer = fs.readFileSync(INPUT_FILE);

    try {
        await fontSplit({
            // 核心输入输出
            input: inputBuffer,
            outDir: OUTPUT_DIR,

            // CSS 生成配置 (针对 MiSans VF 优化)
            css: {
                fontFamily: FONT_CONFIG.family,
                fontWeight: FONT_CONFIG.fontWeight,
                fontStyle: 'normal',
                fontDisplay: 'swap',      // 推荐 swap，避免文字隐形
                localFamily: FONT_CONFIG.localFamily,
                compress: true,           // 压缩 CSS
                commentUnicodes: false    // 关闭 unicode 注释减小体积
            },

            // 命名规则：自定义文件名，去掉默认的 hash
            // 使用 [index] 会生成 0.woff2, 1.woff2...
            // 这里加上前缀 misans-vf-
            renameOutputFont: 'syht-cn-v-[index].[ext]',

            // 预览与测试
            previewImage: {
                name: 'preview',
                text: '思源黑体CN动态字体\nSource Han Sans CN Variable Font\n中文网字计划',
            },
            testHtml: true,  // 生成一个 index.html 用于测试效果
            reporter: true,  // 生成构建报告 reporter.bin/json

            // 高级优化 (保持默认即可)
            autoSubset: true,
            fontFeature: true, // 保留 OpenType 特性 (对 VF 很重要)
            compress: true,    // 开启 woff2 压缩
        });

        console.timeEnd('构建耗时');
        console.log(`✅ 构建成功！产物已输出到 ${OUTPUT_DIR}`);
        console.log(`👉 请打开 ${path.join(OUTPUT_DIR, 'index.html')} 查看效果`);

    } catch (e) {
        console.error('❌ 构建过程中发生错误:', e);
    }
}

build();