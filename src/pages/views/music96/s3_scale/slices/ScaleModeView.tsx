/* eslint-disable no-mixed-spaces-and-tabs */
// noinspection ES6PreferShortImport

import H1 from "@comps/common/docs/H1.tsx";
import t from "@pages/i18n/t.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {Radio, Select, Space} from "antd";
import {useEffect, useState} from "react";
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import {Scale} from "@/music96/scale/cls/ScaleClass.ts";
import {Note} from "@/music96/note";
import ObjView from "@comps/common/docs/ObjView.tsx";
import getCustomizedScaleShowObj from "@views/music96/s3_scale/methods/getCustomizedScaleShowObj.ts";
import Console from "@comps/common/docs/Console.tsx";
import getScaleShowObj from "@views/music96/s3_scale/methods/getScaleShowObj.ts";

const ScaleModeView = () => {

	const dealAlter = (alterValue: number) => {
		if (alterValue === 0) return ""
		if (alterValue === 1) return "♯"
		if (alterValue === -1) return "♭"
		return ""
	}
	const update = () => {
		return new Scale(new Note(rootNoteStepAlter[0] as any,
			rootNoteStepAlter[1] as any, rootNoteOctave), scaleMode as any)
	}
	const [rootNoteStepAlter, setRootNoteStepAlter] = useState(["C", 0])
	const [rootNoteOctave, setRootNoteOctave] = useState(4)
	const [scaleMode, setScaleMode] = useState("MAJ")
	const [scaleInstance, setScaleInstance] = useState(update())
	useEffect(() => {
		try {
			setScaleInstance(update())
		} catch (e) {
			setScaleInstance({error: e.message} as any)
		}
	}, [rootNoteStepAlter, rootNoteOctave, scaleMode]);
	return (<>
		<H1>{t({cn: "音阶模块", en: "Scale module"})}</H1>
		<H2>{t({cn: "Scale类", en: "Scale Class"})}</H2>
		<P>
			<Space>
				<ShortCode>rootNote step</ShortCode>
				<Select style={{width: 200}} allowClear={false} onSelect={(x) => setRootNoteStepAlter(x as any)}
				        labelRender={() => `${rootNoteStepAlter[0]}${dealAlter(rootNoteStepAlter[1] as any)}`}
				        value={rootNoteStepAlter}
				        options={[{value: ["C", 0], label: "C"}, {value: ["C", 1], label: "C♯"},
					        {value: ["D", -1], label: "D♭"}, {value: ["D", 0], label: "D"},
					        {value: ["D", 1], label: "D♯"}, {value: ["E", -1], label: "E♭"},
					        {value: ["E", 0], label: "E"}, {value: ["F", 0], label: "F"},
					        {value: ["F", 1], label: "F♯"}, {value: ["G", -1], label: "G♭"},
					        {value: ["G", 0], label: "G"}, {value: ["G", 1], label: "G♯"},
					        {value: ["A", -1], label: "A♭"}, {value: ["A", 0], label: "A"},
					        {value: ["A", 1], label: "A♯"}, {value: ["B", -1], label: "B♭"},
					        {value: ["B", 0], label: "B"}]}/>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>rootNote octave</ShortCode>
				<Radio.Group buttonStyle="solid" size="middle" value={rootNoteOctave}
				             onChange={(x) => setRootNoteOctave(x.target.value)}>
					<Radio.Button value={1}>1</Radio.Button>
					<Radio.Button value={2}>2</Radio.Button>
					<Radio.Button value={3}>3</Radio.Button>
					<Radio.Button value={4}>4</Radio.Button>
					<Radio.Button value={5}>5</Radio.Button>
					<Radio.Button value={6}>6</Radio.Button>
					<Radio.Button value={7}>7</Radio.Button>
				</Radio.Group>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>scale mode</ShortCode>
				<Select style={{width: 300}} allowClear={false} onSelect={(x) => setScaleMode(x as any)}
				        value={scaleMode}
				        options={[
					        {value: "MAJ", label: "Ionian (nature major)"},
					        {value: "MIN", label: "Aeolian (nature minor)"},
					        {value: "LYD", label: "Lydian"},
					        {value: "MLY", label: "Mixo-lydian"},
					        {value: "DOR", label: "Dorian"},
					        {value: "PHR", label: "Phrygian"},
					        {value: "LOC", label: "Locrian"},
				        ]}/>
			</Space>
		</P>
		<P>
			<ObjView name="interval instance" data={getScaleShowObj(scaleInstance)}/>
			<Console log={scaleInstance}/>
		</P>
	</>)
}

export default ScaleModeView