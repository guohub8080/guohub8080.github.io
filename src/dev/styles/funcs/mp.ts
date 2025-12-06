import byDefault from "../../utils/common/byDefault.ts";
import { CSSProperties } from "react";

export type mpProps = {
    mt?: number | string; // margin-top，可选
    mb?: number | string; // margin-bottom，可选
    ml?: number | string; // margin-left，可选
    mr?: number | string; // margin-right，可选
    pt?: number | string; // padding-top，可选
    pb?: number | string; // padding-bottom，可选
    pl?: number | string; // padding-left，可选
    pr?: number | string; // padding-right，可选
};

export const mpGet = (props: mpProps): CSSProperties => {
    const result = {}
    result['marginTop'] = byDefault(props.mt, 0)
    result['marginBottom'] = byDefault(props.mb, 0)
    result['marginLeft'] = byDefault(props.ml, 0)
    result['marginRight'] = byDefault(props.mr, 0)
    result['paddingTop'] = byDefault(props.pt, 0)
    result['paddingBottom'] = byDefault(props.pb, 0)
    result['paddingLeft'] = byDefault(props.pl, 0)
    result['paddingRight'] = byDefault(props.pr, 0)
    return result
}

export const mpBlankCss = {
    margin: 0,
    padding: 0,
}

export const mpBlank = {
    mt: 0,
    mb: 0,
    ml: 0,
    mr: 0,
    pt: 0,
    pb: 0,
    pl: 0,
    pr: 0
}

