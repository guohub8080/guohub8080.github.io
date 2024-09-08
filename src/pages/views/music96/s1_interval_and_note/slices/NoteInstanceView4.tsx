/* eslint-disable no-mixed-spaces-and-tabs */

import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import {useEffect, useState} from "react";
import {Input, Radio, Space, Switch} from "antd";
import {Note} from "@/music96/note/cls/NoteClass.ts";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";
import googleColors from "@assets/styles/googleColors.ts";
import H2 from "@comps/common/docs/H2.tsx";

const NoteInstanceView2 = () => {
	const [step, setStep] = useState("C")
	const [alter, setAlter] = useState(0)
	const [octave, setOctave] = useState(4)
	const [targetSeriesArray, setTargetSeriesArray] = useState([])

	useEffect(() => {
		try {
			const noteInstance = new Note(step as t_noteStep, alter as t_alterValue, octave)
			setTargetSeriesArray(noteInstance.getHarmonicSeries() as any)
		} catch (e) {
			setTargetSeriesArray({error: e.message} as any)
		}
	}, [step, alter, octave])
	return (<>
		<H2>{t({cn: "Note实例方法：getHarmonicSeries", en: "Note Instance Method: getHarmonicSeries"})}</H2>
		<P><ShortCode>{`getHarmonicSeries`}</ShortCode>
			{t({
				cn: "获取泛音列，无输入值。接下来可使用以下交互界面来尝试。也可以点击按钮在控制台查看完整内容。",
				en: "Next, use the interactive interface below. Alternatively, click the button to view full content in the console."
			})}</P>
		<P><Space>
			<ShortCode>step</ShortCode>
			<Radio.Group onChange={(x) => setStep(x.target.value)}
			             buttonStyle="solid" size="middle" defaultValue="C">
				<Radio.Button value="C">C</Radio.Button>
				<Radio.Button value="D">D</Radio.Button>
				<Radio.Button value="E">E</Radio.Button>
				<Radio.Button value="F">F</Radio.Button>
				<Radio.Button value="G">G</Radio.Button>
				<Radio.Button value="A">A</Radio.Button>
				<Radio.Button value="B">B</Radio.Button>
			</Radio.Group></Space>
		</P>
		<P><Space>
			<ShortCode>alter</ShortCode>
			<Radio.Group onChange={(x) => setAlter(x.target.value)}
			             buttonStyle="solid" size="middle" defaultValue={0}>
				<Radio.Button value={-2}>-2</Radio.Button>
				<Radio.Button value={-1}>-1</Radio.Button>
				<Radio.Button value={0}>0</Radio.Button>
				<Radio.Button value={1}>1</Radio.Button>
				<Radio.Button value={2}>2</Radio.Button>
			</Radio.Group></Space>
		</P>
		<P><Space>
			<ShortCode>octave</ShortCode>
			<Radio.Group buttonStyle="solid" size="middle" defaultValue={4}
			             onChange={(x) => setOctave(x.target.value)}>
				<Radio.Button value={1}>1</Radio.Button>
				<Radio.Button value={2}>2</Radio.Button>
				<Radio.Button value={3}>3</Radio.Button>
				<Radio.Button value={4}>4</Radio.Button>
				<Radio.Button value={5}>5</Radio.Button>
				<Radio.Button value={6}>6</Radio.Button>
				<Radio.Button value={7}>7</Radio.Button>
			</Radio.Group></Space>
		</P>
		<P>{targetSeriesArray?.map((x)=>x.artName).join(" > ")}</P>
		<ObjView name={`harmonicSeries`}
		         data={targetSeriesArray}/>
		<Console log={targetSeriesArray}/>
	</>)

}

export default NoteInstanceView2
