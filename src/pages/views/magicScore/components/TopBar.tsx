/* eslint-disable */
import {css} from "@emotion/react";
import {Modal, Space} from "antd";
import {useState} from "react";
import googleColors from "@assets/styles/googleColors.ts";
import useBaseScoreConfig from "@views/magicScore/data/useBaseScoreConfig.ts";
import BaseConfigPanel from "@views/magicScore/components/modals/BaseConfigPanel.tsx";
import t from "@pages/i18n/t.tsx";
import cssPresets from "@assets/styles/cssPresets.ts";
import shadowPresets from "@assets/styles/shadowPresets.ts";
import NewAddScorePartPanel from "@views/magicScore/components/modals/NewAddScorePartPanel.tsx";
import LightButton2 from "@comps/common/LightButton2.tsx";
import byDefault from "@pages/utils/byDefault.ts";
import useScorePart from "@views/magicScore/data/useScorePart.ts";


const TopBar = () => {
	const baseScoreConfig = useBaseScoreConfig()
	const scorePart = useScorePart()
	const alterNum = () => {
		if (baseScoreConfig.fifth === 0) return "♮"
		if (baseScoreConfig.fifth === 1) return "♯"
		if (baseScoreConfig.fifth === -1) return "♭"
		if (baseScoreConfig.fifth > 0) return `♯ × ${baseScoreConfig.fifth}`
		return `♭ × ${baseScoreConfig.fifth * -1}`
	}

	const [partConfigOpen, setPartConfigOpen] = useState(false);
	const switchOpen = () => setPartConfigOpen(!partConfigOpen)
	const getObj = (i: object) => {
		scorePart.addNewPart(i)
		switchOpen()
		baseScoreConfig.setLock(true)
	}
	return <>
		<div css={frame}>
			<div css={topbar_css}>
				<div className="title">{byDefault(baseScoreConfig.title, "(无标题)", true)}</div>
				<div className="subtitle">{byDefault(baseScoreConfig.subTitle, "(无副标题)", true)}</div>
				<div className="base">
					<span>{baseScoreConfig.beat}</span>
					<span>BPM {baseScoreConfig.bpm}</span>
					<span>{baseScoreConfig.mode.toUpperCase()[0] + baseScoreConfig.mode.toLowerCase().slice(1, baseScoreConfig.mode.length)}</span>
					<span>{alterNum()}</span>
				</div>
			</div>
			<div css={toolsFrame}>
				<div style={{display: "flex", ...cssPresets.flexCenter, gap: 8, flexWrap: "wrap"}}>
					<Space>
						<LightButton2 onClick={baseScoreConfig.switchOpen}>
							{t({cn: "修改基本属性", en: "Base Config"})}
						</LightButton2>
						<LightButton2 onClick={() => setPartConfigOpen(true)}>
							{t({cn: "添加音轨", en: "Add Part"})}
						</LightButton2>
					</Space>
					<Space>
						<LightButton2>
							{t({cn: "切换编辑/乐谱", en: "Switch Edit/Score"})}
						</LightButton2>
						<LightButton2>
							{t({cn: "播放", en: "Play"})}
						</LightButton2>
						<LightButton2>
							{t({cn: "停止", en: "Stop"})}
						</LightButton2>
					</Space>
					<Space>
						<LightButton2>
							{t({cn: "下载MIDI", en: "Get MIDI"})}
						</LightButton2>
						<LightButton2>
							{t({cn: "下载XML", en: "Get XML"})}
						</LightButton2>
					</Space>
					<Space>
						<LightButton2>
							{t({cn: "下载JSON", en: "Get JSON"})}
						</LightButton2>
						<LightButton2>
							{t({cn: "导入JSON", en: "Import JSON"})}
						</LightButton2>
					</Space>

				</div>
			</div>
		</div>
		{/* ============================== base config ====================================== */}
		<Modal title={t({cn: "设置基本数据", en: "Base Attributes Config"})} open={baseScoreConfig.isOpen}
		       width={650}
		       onOk={baseScoreConfig.switchOpen}
		       onCancel={baseScoreConfig.switchOpen}
		       footer={null}
		       styles={{footer: {width: "100%", ...cssPresets.flexCenter}}}>
			< BaseConfigPanel/>
		</Modal>
		{/* ============================== add part ====================================== */}
		<Modal title={t({cn: "添加音轨", en: "Add Part"})} open={partConfigOpen}
		       width={650}
		       closeIcon={null}
		       footer={null}
		       onCancel={switchOpen}
		>
			<NewAddScorePartPanel onOK={getObj}
			                      onCancel={switchOpen}
			                      switchOpen={setPartConfigOpen}/>
		</Modal>
	</>
}

const frame = css({
	width: '100%',
	backgroundColor: googleColors.blueGray50,
	...cssPresets.flexCenter
})
const toolsFrame = css({
	width: 330,
	...cssPresets.flexCenter,
	flexWrap: "wrap"
	// backgroundColor: googleColors.blueGray500,
})
const topbar_css = css({
	width: 250,
	paddingTop: 10,
	paddingBottom: 10,
	"& div.base": {
		marginTop: 5, marginBottom: 10,
		...cssPresets.flexCenter,
		flexWrap: "wrap",
		gap: 10,
		height: "auto"
	},
	"&>div.base>span:not(.title)": {
		// marginLeft: 5,
		// marginRight: 5,
		fontSize: 14,
		backgroundColor: googleColors.gray50,
		boxShadow: shadowPresets.sm,
		paddingTop: 4, paddingBottom: 4,
		paddingLeft: 20, paddingRight: 20,
		borderRadius: 5,
		userSelect: "none",
	},
	"&>div.title": {
		display: "block",
		marginLeft: 5,
		marginRight: 5,
		fontSize: 18,
		paddingBottom: 6,
		paddingLeft: 20, paddingRight: 20,
		borderRadius: 5,
		userSelect: "none",
		minHeight: 26
	},
	"&>div.subtitle": {
		display: "block",
		marginLeft: 5,
		marginRight: 5,
		fontSize: 16,
		color: googleColors.gray600,
		paddingBottom: 6,
		paddingLeft: 20, paddingRight: 20,
		borderRadius: 5,
		userSelect: "none",
		minHeight: 25
	},

})
export default TopBar