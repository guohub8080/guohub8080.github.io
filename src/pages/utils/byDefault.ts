// noinspection ES6PreferShortImport

import {isNull, isString, isUndefined} from "lodash";

const byDefault = (input: any, defaultValue: any, isZeroLengthStrReplaced = false) => {
  if (isNull(input) || isUndefined(input)) return defaultValue
  if (isString(input)) {
    if (input.length === 0 && isZeroLengthStrReplaced) return defaultValue
    return input
  }
  return input
}

export default byDefault