import styles from "./styles.js";
import useGlobalConfig from "@/configs/useGlobalConfig.ts";


const LimitedWidthDivLayout = (props) => {
    // console.log("bar layout refresh")
    const globalConfig = useGlobalConfig()
    return (<>
        <div css={styles.outerBlock(props.outFrameBgColor)}>
            <div css={styles.innerBlock(globalConfig)} style={props.innerStyle}>
                {props.children}
            </div>
        </div>
    </>);
}
export default LimitedWidthDivLayout