// noinspection ES6PreferShortImport

import {range} from "lodash";
import collect from "collect.js";

const getRandomPartName = () => {
	const alphabet = "ABCDEFGHKLMNPQRSTUVWXYZ".split("")
	const r1 = range(0, 4).map((_, i) => collect(alphabet).random()).join("")
	const number = "0123456789".split("")
	const num = range(0, 4).map((_, i) => collect(number).random()).join("")
	return `P-${r1}-${num}`
}

export default getRandomPartName