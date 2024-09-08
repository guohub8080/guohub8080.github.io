/* eslint-disable no-mixed-spaces-and-tabs */


import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import Code from "@comps/common/docs/Code.tsx";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {InputNumber, Radio, Space, Switch} from "antd";
import {Note} from "@/music96/note/cls/NoteClass.ts";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import {Interval} from "@/music96/interval/cls/IntervalClass.ts";
import {t_intervalType} from "@/music96/interval/static/types.ts";

const NoteInstanceView1 = () => {
	const [step, setStep] = useState("C")
	const [alter, setAlter] = useState(0)
	const [octave, setOctave] = useState(4)
	const [noteInstance, setNoteInstance] = useState(new Note())
	const [targetNoteInstance, setTargetNoteInstance] = useState(new Note())
	const [intervalType, setIntervalType] = useState("p")
	const [intervalNum, setIntervalNum] = useState(1)
	const [isAscending, setIsAscending] = useState(true)


	useEffect(() => {
		setNoteInstance(new Note(step as any, alter as any, octave))
	}, [step, alter, octave])
	useEffect(() => {
		try {
			const newIntervalInstance = new Interval(intervalType as t_intervalType, intervalNum)
			setTargetNoteInstance(noteInstance.getNoteByInterval(newIntervalInstance, isAscending))
		} catch (e) {
			setTargetNoteInstance({error: e.message} as any)
		}
	}, [intervalNum, intervalType, isAscending])
	return (<>

		<H2>{t({cn: "Note实例方法：getNoteByInterval", en: "Note Instance Method: getNoteByInterval"})}</H2>
		<P>{t({
			cn: "Note模块的实例方法同样需要先进行实例化再去调用。同Interval的实例方法。",
			en: "Note's instance methods require instantiation before they can be invoked, as with the Interval example."
		})}</P>
		<P>{t({
			cnG: [<ShortCode>{`getNoteByInterval`}</ShortCode>,
				`给定音程和上下行，输出一个Note实例。需要以下两个输入：`],
			enG: [
				<ShortCode>{`getNoteByInterval`}</ShortCode>,
				`Given the interval and direction, the new note instance is output. It needs 2 inputs:`]
		})}
		</P>
		<P>
			<GuideDot/>
			<ShortCode>{`intervalInstance`}</ShortCode>
			<TypeDesc>{`InstanceType< typeof Interval>`}</TypeDesc>
			{t({
				cnG: ["不能留空。输入的是一个音程的实例，需要使用new关键字。"],
				enG: ["Required. The input is a instance of Interval that need the keyword of new."]
			})}
		</P>
		<P>
			<GuideDot/>
			<ShortCode>{`isAscending?`}</ShortCode>
			<TypeDesc>{`boolean`}</TypeDesc>
			<DefaultValue>true</DefaultValue>
			{t({
				cnG: ["布尔类型，可留空。true表示上行计算，false表示下行计算。"],
				enG: ["Boolean type, optional. True denotes upward calculation, false indicates downward calculation."]
			})}
		</P>

		<P>{t({
			cn: "接下来可使用以下交互界面来尝试。也可以点击按钮在控制台查看完整内容。",
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
		<P>
			<Space>
				<ShortCode>intervalType</ShortCode>
				<Radio.Group onChange={(x) => setIntervalType(x.target.value)}
				             buttonStyle="solid" size="middle" defaultValue="p">
					<Radio.Button value="dim-">{t({cn:"倍减",en:"flat-"})}</Radio.Button>
					<Radio.Button value="dim">{t({cn:"减",en:"flat"})}</Radio.Button>
					<Radio.Button value="min">{t({cn:"小",en:"minor"})}</Radio.Button>
					<Radio.Button value="p">{t({cn:"纯",en:"natural"})}</Radio.Button>
					<Radio.Button value="maj">{t({cn:"大",en:"major"})}</Radio.Button>
					<Radio.Button value="aug">{t({cn:"增",en:"sharp"})}</Radio.Button>
					<Radio.Button value="aug+">{t({cn:"倍增",en:"sharp+"})}</Radio.Button>
				</Radio.Group>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>intervalNum</ShortCode>
				<InputNumber defaultValue={intervalNum} onChange={(x) => setIntervalNum(x)}></InputNumber>
			</Space>
		</P>
		<P>
			<Space>
				<ShortCode>isAscending</ShortCode>
				<Switch value={isAscending} onChange={(x) => setIsAscending(x)}></Switch>
			</Space>

		</P>
		<ObjView name={`${noteInstance.simpleDescription} ${isAscending ? '▲' : '▼'} ${intervalType} ${intervalNum} is`}
		         data={targetNoteInstance}/>
		<Console log={targetNoteInstance}/>
	</>)

}

export default NoteInstanceView1
