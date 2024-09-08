/* eslint-disable no-mixed-spaces-and-tabs */
// noinspection ES6PreferShortImport

import t from "@pages/i18n/t.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {Input, Radio, Select, Space} from "antd";
import {useEffect, useState} from "react";
import {Note} from "@/music96/note";
import {CustomizedScale} from "@/music96/scale/cls/CustomizedScaleClass.ts";
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import getCustomizedScaleShowObj from "@views/music96/s3_scale/methods/getCustomizedScaleShowObj.ts";

const dealAlter = (alterValue: number) => {
	if (alterValue === 0) return ""
	if (alterValue === 1) return "♯"
	if (alterValue === -1) return "♭"
	return ""
}
const CustomizedScaleView = () => {
	const [rootNoteStepAlter, setRootNoteStepAlter] = useState(["C", 0])
	const [rootNoteOctave, setRootNoteOctave] = useState(4)
	const [interval2, setInterval2] = useState("maj")
	const [interval3, setInterval3] = useState("maj")
	const [interval4, setInterval4] = useState("p")
	const [interval5, setInterval5] = useState("p")
	const [interval6, setInterval6] = useState("maj")
	const [interval7, setInterval7] = useState("maj")
	const [scaleName, setScaleName] = useState("自定义音阶")
	const [scaleInstance, setScaleInstance] = useState()
	const update = () => {
		try {
			const targetScale = new CustomizedScale(new Note(rootNoteStepAlter[0] as any,
					rootNoteStepAlter[1] as any, rootNoteOctave), scaleName,
				{
					2: interval2, 3: interval3, 4: interval4, 5: interval5, 6: interval6, 7: interval7
				} as any)
			setScaleInstance(targetScale as any)
		} catch (e) {
			setScaleInstance({error: e.message} as any)
		}
	}
	useEffect(() => {
		update()
	}, [rootNoteOctave, rootNoteStepAlter, interval2, interval3, interval4, interval5, interval6, interval7])
	return (<>
		<H2>{t({cn: "自定义音阶类", en: "Customized Scale Class"})}</H2>
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
				<ShortCode>scale name</ShortCode>
				<Input defaultValue={scaleName} onChange={x => setScaleName(x.target.value)}/>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>interval2</ShortCode>
				<Radio.Group buttonStyle="solid" size="middle" value={interval2}
				             onChange={(x) => setInterval2(x.target.value)}>
					<Radio.Button value="min">min</Radio.Button>
					<Radio.Button value="maj">maj</Radio.Button>
				</Radio.Group>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>interval3</ShortCode>
				<Radio.Group buttonStyle="solid" size="middle" value={interval3}
				             onChange={(x) => setInterval3(x.target.value)}>
					<Radio.Button value="min">min</Radio.Button>
					<Radio.Button value="maj">maj</Radio.Button>
				</Radio.Group>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>interval4</ShortCode>
				<Radio.Group buttonStyle="solid" size="middle" value={interval4}
				             onChange={(x) => setInterval4(x.target.value)}>
					<Radio.Button value="dim">dim</Radio.Button>
					<Radio.Button value="p">p</Radio.Button>
					<Radio.Button value="aug">aug</Radio.Button>
				</Radio.Group>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>interval5</ShortCode>
				<Radio.Group buttonStyle="solid" size="middle" value={interval5}
				             onChange={(x) => setInterval5(x.target.value)}>
					<Radio.Button value="dim">dim</Radio.Button>
					<Radio.Button value="p">p</Radio.Button>
					<Radio.Button value="aug">aug</Radio.Button>
				</Radio.Group>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>interval6</ShortCode>
				<Radio.Group buttonStyle="solid" size="middle" value={interval6}
				             onChange={(x) => setInterval6(x.target.value)}>
					<Radio.Button value="min">min</Radio.Button>
					<Radio.Button value="maj">maj</Radio.Button>
				</Radio.Group>
			</Space>
		</P> <P>
		<Space>
			<ShortCode>interval7</ShortCode>
			<Radio.Group buttonStyle="solid" size="middle" value={interval7}
			             onChange={(x) => setInterval7(x.target.value)}>
				<Radio.Button value="min">min</Radio.Button>
				<Radio.Button value="maj">maj</Radio.Button>
			</Radio.Group>
		</Space>
	</P>
		<P>
			<ObjView name="interval instance" data={getCustomizedScaleShowObj(scaleInstance as any)}/>
			<Console log={scaleInstance}/>
		</P>

	</>)
}

export default CustomizedScaleView