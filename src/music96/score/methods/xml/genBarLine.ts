// noinspection ES6PreferShortImport

import {XMLBuilder} from "fast-xml-parser";

const genBarLine = () => {
	const builder = new XMLBuilder({
		ignoreAttributes: false, processEntities: false
	})
	return builder.build({
		"barline": {
			"@_location": "right",
			"bar-style": "light-heavy"
		}
	})
}

export default genBarLine