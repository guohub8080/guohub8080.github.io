/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {Button, ColorPicker, InputNumber, Space, Slider, ConfigProvider} from "antd";
import toast from 'react-hot-toast';
import { Rnd } from 'react-rnd';
import { useLocation } from 'react-router-dom';
import articlesRouter from '@dev/router/articlesLoader';
import logo from "../../assets/svgs/logoSvg/favicon.svg"
import {useKeyPress} from "ahooks";
import {useViewSettingsStore} from "../../store/useViewSettingsStore.ts";

interface FloatToolbarProps {
  clearQueryCompare: Function;
  switchSide: Function;
}

/**
 * 浮动工具栏组件
 * 提供复制HTML、背景色设置、滚动控制等功能
 */
const FloatToolbar = (props: FloatToolbarProps) => {
  // 使用 zustand store 管理视图设置
  const { bgColor, viewPadding, articleScroll, maxScroll, setBgColor, setViewPadding, setArticleScroll } = useViewSettingsStore();
  
  useKeyPress("ctrl.c", () => copyWechatHTMLText())
  useKeyPress("s", () => props.switchSide())
  useKeyPress("ctrl.x", () => copyWechatRichHTML())
  useKeyPress("t", () => copyExportTitle())
  
  const location = useLocation()

  const copyExportTitle = () => {
    try {
      // 与侧栏一致：解码、转小写、去首尾斜杠
      const standardizePath = (p: string) => decodeURIComponent(p || '')
        .toLowerCase()
        .replace(/^\/+|\/+$/g, '')
      const current = standardizePath(location.pathname)
      const match = articlesRouter.find(r => {
        const routePath = r.path?.startsWith('/') ? r.path : '/' + (r.path || '')
        return standardizePath(routePath) === current
      })
      const title = match?.title
      if (!title) {
        toast.error('未找到导出的标题')
        return
      }
      navigator.clipboard.writeText(title).then(() => {
        toast.success('已复制标题：' + title)
      }).catch(err => {
        toast.error('复制失败：' + err.message)
      })
    } catch (e: any) {
      toast.error('复制失败：' + (e?.message || 'unknown'))
    }
  }
  
  /**
   * 复制富文本HTML到剪贴板
   * 可直接粘贴到公众号编辑器
   */
  const copyWechatRichHTML = () => {
    try {
      // 获取根容器 (id="gzt" 的 section)
      const frameHTML = document.getElementById("gzt")
      if (!frameHTML) {
        toast.error("未找到内容容器")
        return
      }
      
      // 克隆整个根节点以避免影响页面显示
      const clonedNode = frameHTML.cloneNode(true) as HTMLElement
      
      // 处理所有SVG元素，添加必要的命名空间
      const svgs = clonedNode.querySelectorAll("svg")
      svgs.forEach(svg => {
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
      })
      
      // 确保内部的主容器宽度正确
      const innerHTMLNode = clonedNode.getElementsByClassName("guozhongtian.")[0] as HTMLElement
      if (innerHTMLNode) {
        innerHTMLNode.style.width = "650px"
        innerHTMLNode.style.maxWidth = "650px"
        innerHTMLNode.style.margin = "0 auto"
      }
      
      // 直接获取克隆节点的 outerHTML（包含根 section）
      const htmlContent = clonedNode.outerHTML
      
      // 创建剪贴板项，只提供 text/html 格式
      const copyItem = new ClipboardItem({
        "text/html": new Blob([htmlContent], {type: "text/html"}),
      })
      
      // 写入剪贴板
      navigator.clipboard.write([copyItem]).then(() => {
        console.log("已复制富文本RICH HTML (包含根section)")
        toast.success("已复制富文本（含根容器），可直接粘贴到公众号编辑器")
      }).catch((err) => {
        console.error("复制失败:", err)
        toast.error("复制失败: " + err.message)
      })
      
    } catch (error) {
      console.error("复制过程出错:", error)
      toast.error("复制出错，请重试")
    }
  }
  
  /**
   * 复制HTML源代码到剪贴板
   */
  const copyWechatHTMLText = () => {
    const frameHTML = document.getElementById("gzt")
    const innerHTMLNode = frameHTML.getElementsByClassName("guozhongtian.")[0]
    const svgs = document.getElementsByTagName("svg")
    for(const i of svgs){
        i.setAttribute("xmlns","http://www.w3.org/2000/svg")
    }
    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-expect-error
    // innerHTMLNode.style.width = "650px"
    navigator.clipboard.writeText(frameHTML.outerHTML).then(() => {
      console.log("已复制源代码")
    })
    toast.success("已复制源代码TEXT SOURCE")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    innerHTMLNode.style.width = null
  }
  
  return <Rnd
    default={{
      x: window.innerWidth - 370,
      y: window.innerHeight * 0.25,
      width: 300,
      height: 'auto'
    }}
    dragHandleClassName="drag-handle"
    enableResizing={false}
    bounds="window"
    style={{
      zIndex: 999
    }}
  >
    <div css={floatToolFrame_css}>
      <div className="drag-handle">
        <DragHandler/>
      </div>
      <div style={{backgroundColor: "#EFEFEF", width: "fit-content", padding: 5, borderRadius: 8}}>
        <div className="logo展示区" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          marginBottom: 10
        }}>
          <img style={{width: 25}} src={logo} alt=""/>
          <div style={{fontWeight: 700}}>公众号预览</div>
        </div>
        <div className="颜色调整">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 15,
              marginBottom: 5
            }}>
            <div>设置背景色</div>
            <ColorPicker allowClear={false} format="hex" showText={true} onChange={(e, y) => {
              setBgColor(y)
            }} value={bgColor} style={{width: 150}}
            />
          </div>

          <div style={{display: "flex", justifyContent: "center", gap: 3}}>
            <div onClick={() => setBgColor("#000000")}>
              <ColorPicker defaultValue="#000000" open={false}/>
            </div>
            <div onClick={() => setBgColor("#BDBDBD")}>
              <ColorPicker defaultValue="#BDBDBD" open={false}/>
            </div>
            <div onClick={() => setBgColor("#ffffff")}>
              <ColorPicker defaultValue="#ffffff" open={false}/>
            </div>
            <div onClick={() => setBgColor("#0D47A1")}>
              <ColorPicker defaultValue="#0D47A1" open={false}/>
            </div>
            <div onClick={() => setBgColor("#B71C1C")}>
              <ColorPicker defaultValue="#B71C1C" open={false}/>
            </div>
            <div onClick={() => setBgColor("#00C853")}>
              <ColorPicker defaultValue="#00C853" open={false}/>
            </div>
            <div onClick={() => setBgColor("#FF5722")}>
              <ColorPicker defaultValue="#FF5722" open={false}/>
            </div>
          </div>
        </div>
      </div>
      <div className="padding调整" style={{marginTop: 5}}>
        <InputNumber
          addonBefore="公众号预览窗格Padding"
          changeOnWheel
          onMouseOver={(e) => e.currentTarget.focus()}
          min={0} max={100}
          step={10}
          value={viewPadding}
          onChange={e => setViewPadding(e)}
          controls
        />
      </div>
      <div className="文章滚动调整" style={{marginTop: 10}}>
        <InputNumber
          addonBefore="文章滚动位置"
          onMouseOver={(e) => e.currentTarget.focus()}
          onWheel={(e) => {
            e.preventDefault();
            const delta = e.deltaY;
            // 向下滚轮（deltaY > 0）时增大数值，向上滚轮时减小数值
            if (delta > 0) {
              setArticleScroll(Math.min(articleScroll + 100, maxScroll));
            } else if (delta < 0) {
              setArticleScroll(Math.max(articleScroll - 100, 0));
            }
          }}
          min={0}
          max={maxScroll}
          step={100}
          value={articleScroll}
          formatter={(value) => `@ ${value}`.split(".")[0]}
          onChange={e => setArticleScroll(e || 0)}
          controls
        />
      </div>
      <div className="滚动条" style={{marginTop: 10, marginBottom: 10}}>
        <ConfigProvider
          theme={{
            components: {
              Slider: {
                trackBg: '#1976D2',
                trackHoverBg: '#1976D2',
                handleColor: '#1976D2',
                handleActiveColor: '#1976D2',
              }
            }
          }}
        >
          <Slider
            min={0}
            max={maxScroll || 100}
            value={articleScroll}
            onChange={(value) => setArticleScroll(value)}
            tooltip={{
              formatter: (value) => `${value}px`
            }}
          />
        </ConfigProvider>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: 12, 
          color: '#666',
          marginTop: 5
        }}>
          <span>顶部</span>
          <span>{maxScroll > 0 ? `${maxScroll}px` : '无内容'}</span>
        </div>
      </div>
      <div className="文章位置同时调整" style={{marginTop: 5}}>
        <Space.Compact>
          <Button onClick={() => setArticleScroll(Math.min(articleScroll + 100, maxScroll))}>+100</Button>
          <Button onClick={() => setArticleScroll(Math.min(articleScroll + 200, maxScroll))}>+200</Button>
          <Button
            onClick={() => setArticleScroll(Math.max(articleScroll - 100, 0))}>-100</Button>
          <Button
            onClick={() => setArticleScroll(Math.max(articleScroll - 200, 0))}>-200</Button>
        </Space.Compact>

      </div>

      <Button style={{width: "100%", marginTop: 40, marginBottom: 5}}
              onClick={() => props.switchSide()}>切换侧边显示 (S)
      </Button>
      <Button style={{width: "100%", marginTop: 5, marginBottom: 5}}
              onClick={copyExportTitle}>复制标题到剪贴板 (T)</Button>
      <Button style={{width: "100%", marginTop: 5, marginBottom: 5}} type="primary"
              onClick={copyWechatRichHTML}>复制HTML到剪贴板 (Ctrl X)</Button>
      <Button
        style={{width: "100%", marginTop: 5, marginBottom: 5}} type="primary"
        onClick={copyWechatHTMLText}>复制源代码到剪贴板 (Ctrl C)</Button>
    </div>
  </Rnd>
}

export default FloatToolbar

const floatToolFrame_css = css({
  width: '100%',
  height: '100%',
  padding: 20,
  paddingTop: 0,
  backgroundColor: "#EFEFEF",
  borderRadius: 8,
  boxShadow: "0px 0px 20px 1px rgba(0, 0, 0, 0.2);"
})

/**
 * 拖动手柄组件
 */
const DragHandler = () => {
  return <div style={{
    width: "100%",
    height: 30,
    backgroundColor: "#3C3C3C",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "move",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 10
  }}>
    <div style={{width: 150, height: 4, backgroundColor: "#EFEFEF", borderRadius: 4}}></div>
  </div>
}

