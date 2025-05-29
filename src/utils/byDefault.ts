// noinspection ES6PreferShortImport

import {isNull, isString, isUndefined} from "lodash";

const byDefault = (i: any, d: any) => {
	if (isUndefined(i)) return d;
	if (isNull(i)) return d;
	if (isString(i)) {
		if (i.trim().length === 0) return d;
		return i;
	}
	return i;
}

export default byDefault
