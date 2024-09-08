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
	const [intervalString, setIntervalString] = useState("1")
	const [isAscending, setIsAscending] = useState(true)
	const [targetNote, setTargetNote] = useState(new Note())

	useEffect(() => {
		try {
			const noteInstance = new Note(step as t_noteStep, alter as t_alterValue, octave)
			setTargetNote(noteInstance.getNoteByIntervalString(intervalString, isAscending))
		} catch (e) {
			setTargetNote({error: e.message} as any)
		}
	}, [step, alter, octave, intervalString, isAscending])
	return (<>
		<H2>{t({cn: "Note实例方法：getNoteByIntervalString", en: "Note Instance Method: getNoteByIntervalString"})}</H2>
		<P><ShortCode>{`getNoteByIntervalString`}</ShortCode>
			{t({
				cnG: [`根据输入的表示音程的字符串，决定输出的目标音符。可以替换为`, <ShortCode>{`getNoteByInterval`}</ShortCode>,
					"达成相同的效果。输入值为以下2个："],
				enG: [`Given the interval and direction, the new note instance is output. It needs 2 inputs:`]
			})}
		</P>
		<P>
			<GuideDot/>
			<ShortCode>{`numberNotationString`}</ShortCode>
			<TypeDesc>{`string`}</TypeDesc>
			{t({
				cnG: [`字符串类型，不可留空。字符串为数字和符号的组合形式，规则如下：①数字为音程类型，其中1、4、5和其八度的叠加为纯音程，2、3、6、7及其八度叠加为大音程。
				②「f/F」（flat的首字母）表示降，一个符号在1、4、5及其八度叠加中表示减，两个表示倍减，例如「f4」表示减4度，「ff5」表示倍减5度。一个「f/F」在2、3、6、7及其八度叠加中表示小音程，两个表示减，三个表示倍减，例如「f2」表示小2度，「ff3」表示减3度。③「s/S」（sharp的首字母）表示升，一个符号在1、4、5及其八度叠加中表示升，例如「S1」表示增1度，「SS8」表示倍增8度。④数字与符号不区分先后顺序。数字必须出现且仅能出现一次。例如「f5」是正确的，而「5f6」是错误的。⑤升降号可以相互抵消，尽管不推荐这样写。例如「fs1」与「1」的结果是相同的，「ffs1」与「f1」的结果是相同的。⑥「h/H」（high的首字母）表示在isAscending为true时输出结果再高一个八度，反之则低一个八度。「l/L」（low的首字母）表示在isAscending为true时输出结果再低一个八度，反之则高一个八度。⑦可以使用「b/-」代替「f」，「#/+」代替「s」，例如「7b/7-」表示小7度，「#4/+4」表示增4度。`,
				],
				enG: ["Required. The input is a instance of Interval that need the keyword of new."]
			})}
		</P>
		<P>
			<GuideDot/>
			<ShortCode>{`isAscending?`}</ShortCode>
			<TypeDesc>{`boolean`}</TypeDesc>
			<DefaultValue>{true.toString()}</DefaultValue>
			{t({
				cnG: ["布尔类型，可留空。true表示上行计算，false表示下行计算。"],
				enG: ["Required. The input is a instance of Interval that need the keyword of new."]
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
				<ShortCode>numberNotationString</ShortCode>
				<Input defaultValue={intervalString} value={intervalString}
				       onChange={(x) => setIntervalString(x.target.value)}/>
			</Space>
			<div style={{marginTop: 3}}>
				<span style={{marginRight: 3, color: googleColors.gray500}}>{t({cn: "示例选项", en: "options"})}</span>
				<Radio.Group buttonStyle="solid" size="middle" defaultValue="1"
				             value={intervalString}
				             onChange={(x) => setIntervalString(x.target.value)}>
					<Radio.Button value="1s">1s</Radio.Button>
					<Radio.Button value="2b">2b</Radio.Button>
					<Radio.Button value="3">3</Radio.Button>
					<Radio.Button value="#4">#4</Radio.Button>
					<Radio.Button value="5h">5h</Radio.Button>
					<Radio.Button value="L6b">L6b</Radio.Button>
					<Radio.Button value="###bbbb#b7H">###bbbb#b7H</Radio.Button>
				</Radio.Group>
			</div>

		</P>

		<P>
			<Space>
				<ShortCode>isAscending</ShortCode>
				<Switch value={isAscending} onChange={(x) => setIsAscending(x)}/>
				<span>{isAscending.toString()}</span>
			</Space>
		</P>

		<ObjView name={`target note`}
		         data={targetNote}/>
		<Console log={targetNote}/>
	</>)

}

export default NoteInstanceView2
