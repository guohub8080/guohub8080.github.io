import { isNil } from "lodash";

export default function byDefault(value: any, defaultValue: any) {
    if(isNil(value)) {
        return defaultValue;
    }
    return value;
}