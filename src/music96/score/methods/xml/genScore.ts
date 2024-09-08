import {XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser"
import genMeta from "@/music96/score/methods/xml/genMeta.ts";

// noinspection ES6PreferShortImport

const genScore = () => {
	const head = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">`
	const body = new XMLBuilder({
		ignoreAttributes: false,  processEntities:false
	})
	const b = genMeta({title: "nihao"})
	// console.log(b)
	const a = body.build(
		{
			"score-partwise": [
				{"#text": b}
			],
			":@": {
				"@_verison": "4.0"
			}
		})
	console.log("a:", a)
	return head + a
}

export default genScore