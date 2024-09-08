// noinspection ES6PreferShortImport
import {XMLBuilder} from "fast-xml-parser"
import byDefault from "../../../common/utils/byDefault.ts";
import sounds_musicXML from "../../static/sounds_musicXML.ts";
import {t_partMeta_OneInstrument} from "../../static/types.ts";


const genOneInstrumentPart = (partMeta: t_partMeta_OneInstrument) => {
	const builder = new XMLBuilder({
		ignoreAttributes: false,
	})

	const buildObj = {
		"score-part": [
			{
				"@_id": partMeta.partID,
				"part-name": partMeta.partName,
				"part-abbreviation": byDefault(partMeta.partAbbr, partMeta.partName),
				"score-instrument": {
					"@_id": `${partMeta.partID}-${byDefault(partMeta.instrumentId, "I1")}`,
					"instrument-name": byDefault(partMeta.instrumentName, "piano"),
					"instrument-sound": byDefault(partMeta.instrumentSound, sounds_musicXML["keyboard.piano"]),
				},
				"midi-device": {
					"@_id": `${partMeta.partID}-${byDefault(partMeta.instrumentId, "I1")}`,
					"@_port": byDefault(partMeta.midiPort, 1)
				},
				"midi-instrument": {
					"@_id": `${partMeta.partID}-${byDefault(partMeta.instrumentId, "I1")}`,
					"midi-channel": byDefault(partMeta.midiChannel, 1),
					"midi-program": byDefault(partMeta.midiProgram, 1),
				}
			},
		],
	}
	return builder.build(buildObj)
}

export default genOneInstrumentPart

