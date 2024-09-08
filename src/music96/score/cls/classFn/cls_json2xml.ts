import {XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser"

const cls_json2xml = () => {
  const builder = new XMLBuilder({
    ignoreAttributes:false,
    suppressBooleanAttributes: true,
    suppressEmptyNode: true,
    format: true
  });
}

export default cls_json2xml