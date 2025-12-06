/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../PureHTML/basicEx/SectionEx.tsx";
import SeamlessImg from "./SeamlessImg";

const Link = () => {
  return <SectionEx
    data-label="link-component"
    style={{
      WebkitTouchCallout: 'none',
      userSelect: 'text',
      overflow: 'hidden',
      textAlign: 'center',
      lineHeight: '0',
      marginBottom: '0px'
    }}>
    <a href="https://www.baidu.com" target="_blank">
      <section style={{width:300,height:300,backgroundColor:"green"}}></section>
    </a>
  </SectionEx>
}
export default Link
