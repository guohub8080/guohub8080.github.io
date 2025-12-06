import { isNil } from "lodash"

export default (given: any, defaultValue: any) => {
  if (isNil(given)) return defaultValue
  return given
}