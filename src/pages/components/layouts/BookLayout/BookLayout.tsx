import Foot from "@comps/common/Foot/index.tsx";
import LimitedWidthDivLayout from "@comps/layouts/LimitedWidthDivLayout/index.tsx";
import useGlobalConfig from "@/configs/useGlobalConfig.ts";
import BarContentLayout from '@comps/layouts/BarContentLayout/BarContentLayout.tsx';
import TOC from '@comps/layouts/BookLayout/TOC/TOC.tsx';
import {ReactNode, useEffect, useState} from "react";
import {useWindowSize} from "usehooks-ts";
import styles from "./styles.ts"
import BtmNavigator from "./BtmNavigator.tsx";
import ArrowNav from "@comps/layouts/BookLayout/ArrowNav.tsx";
import TOC_TopBar from "@comps/layouts/BookLayout/TOC/TOC_TopBar.tsx";
import {IconType} from "react-icons";
import {TOC_type} from "@comps/layouts/BookLayout/types.ts";


const BookLayout = (props: {
    children?: ReactNode
    topElement?: ReactNode
    topImgSrc?: ReactNode
    topIconComp?: IconType
    settingsElement?: ReactNode
    pageTitle: string
    tocContent?: TOC_type
}) => {
    console.log("bar layout refresh")
    const globalConfig: any = useGlobalConfig()

    // 目录的宽度
    const tocWidth = 250
    const [isTOCDisplay, setIsTOCDisplay] = useState(true);
    const windowSize = useWindowSize()

    // 当窗口宽度小于某个大小的时候，目录缩进去；当窗口宽度大于某个大小的时候，目录展开。
    useEffect(() => {
        if (windowSize.width <= (globalConfig.breakPoint as number) + tocWidth) {
            setIsTOCDisplay(false)
        } else {
            setIsTOCDisplay(true)
        }
    }, [globalConfig.breakPoint, windowSize.width])


    return (<>
        <BarContentLayout settingsElement={props.settingsElement}
                          bgColor="#f1f2f5"
                          topElement={<TOC_TopBar
                              title={props.pageTitle}
                              iconComp={props.topIconComp}
                              isBarTOC={!isTOCDisplay}
                              tocContent={props.tocContent}
                              imgSrc={props.topImgSrc}/>}>
            <LimitedWidthDivLayout innerStyle={{}}>
                {/*因为宽屏目录是fixed定位*/}
                {isTOCDisplay && <TOC tocWidth={tocWidth} content={props.tocContent}/>}
                <div css={styles.innerBookFrame_css(isTOCDisplay ? tocWidth + 10 : 0, isTOCDisplay)}>
                    <div css={styles.innerBookRightDiv_css(isTOCDisplay)}>
                        {/*深度导航（面包屑）*/}
                        <ArrowNav toc={props.tocContent} mainTitle={props.pageTitle}/>
                        {/*这里才是真正的子内容存放的容器*/}
                        <div></div>
                        <div css={styles.articleMainFrame_css(15)}>{props.children}</div>
                        {/*上一篇和下一篇的导航底*/}
                        <div css={styles.btmNavigatorFrame_css}>
                            <BtmNavigator direction="pre" title={""} isForbidden={false} clickLink={""}/>
                            <BtmNavigator direction="next" title={""} isForbidden={false} clickLink={""}/>
                        </div>
                        {/*页脚*/}
                        <Foot/>
                    </div>
                </div>
            </LimitedWidthDivLayout>
        </BarContentLayout>
    </>);
}
export default BookLayout