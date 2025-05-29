// noinspection ES6PreferShortImport

import * as music12 from "@/music12";
import {sortBy} from "lodash";

const getBareChordTransformString = (locationList: number[], absoluteRootLocation: number) => {
	const locationGap = locationList.map(x => music12.note.getUpwardLocationGap(absoluteRootLocation, x))
	const transformList = {
		base: "",
		omit: [],
		min: [],
		maj: [],
		p: [],
		dim: [],
		aug: [],
	}
	if (!locationGap.includes(3) && !locationGap.includes(4)) {
		transformList.omit.push(3)
	}
	if (locationGap.includes(3)) {
		transformList.base = "m"
	}
	if (!locationGap.includes(7)) {
		transformList.omit.push(5)
	}
	locationGap.forEach((item) => {
		if (item === 1) {
			transformList.min.push(2)
		} else if (item === 2) {
			transformList.maj.push(2)
		} else if (item === 5) {
			transformList.p.push(4)
		} else if (item === 6) {
			transformList.aug.push(4)
		} else if (item === 8) {
			transformList.min.push(6)
		} else if (item === 9) {
			transformList.maj.push(6)
		} else if (item === 10) {
			transformList.min.push(7)
		} else if (item === 11) {
			transformList.maj.push(7)
		}
	})
	let finalString = ""
	if (transformList.p.length > 0) {
		finalString += sortBy(transformList.p).join(",") + ","
	}
	if (transformList.maj.length > 0) {
		finalString += sortBy(transformList.maj).join(",") + ","
	}
	if (transformList.aug.length > 0) {
		finalString += sortBy(transformList.aug).map(x => `#${x}`).join(",") + ","
	}
	if (transformList.min.length > 0) {
		finalString += sortBy(transformList.maj).map(x => `b${x}`).join(",") + ","
	}
	if (transformList.dim.length > 0) {
		finalString += sortBy(transformList.dim).map(x => `b${x}`).join(",") + ","
	}
	if (transformList.omit.length > 0) {
		finalString += "omit"
		finalString += sortBy(transformList.omit).join(",") + ","
	}
	if (finalString.endsWith(",")) {
		finalString = finalString.slice(0, -1)
	}
	return [transformList.base, finalString]
}

export default getBareChordTransformString
