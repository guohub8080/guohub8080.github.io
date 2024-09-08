import TopBar from '@comps/common/TopBar/TopBar.js';
import styles from "./styles.js";
import useGlobalConfig from "@/configs/useGlobalConfig.ts";
import React, {forwardRef, LegacyRef, ReactNode} from 'react';


const BarContentLayout = forwardRef(function (props: {
    children?: ReactNode
    settingsElement?: ReactNode
    topElement: ReactNode
    bgColor?: string
}, ref: LegacyRef<HTMLDivElement>) {
    // console.log("bar layout refresh")
    const globalConfig = useGlobalConfig()
    return (<>
        <TopBar settingsElement={props.settingsElement} topElement={props.topElement}/>
        <div css={styles.underBarContent(globalConfig, props.bgColor)} ref={ref}>
            {props.children}
        </div>
    </>);
})

export default BarContentLayout