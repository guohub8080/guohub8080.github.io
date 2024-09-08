/* eslint-disable no-mixed-spaces-and-tabs */
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {Button, Flex, Radio, Select, Slider, Space, Switch} from "antd";
import {Note} from "@/music96/note/cls/NoteClass.ts";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import H1 from "@comps/common/docs/H1.tsx";
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";
import Code from "@comps/common/docs/Code.tsx";
import {getIntervalByComparingNotes} from "@/music96/interval";
import {
	getWhiteRandomNote,
	getCasualRandomNote,
	getNormalRandomNote,
	getBlackRandomNote
} from "@/music96/note";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import collect from "collect.js";

const NoteIntervalMethods2 = () => {
	const genCasualNote = (isConsole = true) => {
		if (isConsole) console.log(getCasualRandomNote(octave))
		else {
			setTargetNoteInstance(getCasualRandomNote(octave))
		}
	}
	const genBlackORWhiteNote = (isConsole = true, isOnlyBlack = true, isNormal = true) => {
		if (!isConsole) {
			if (isOnlyBlack) setTargetNoteInstance(getBlackRandomNote(octave, isNormal))
			else {
				setTargetNoteInstance(getWhiteRandomNote(octave, isNormal))
			}
		} else {
			if (isOnlyBlack) console.log(getBlackRandomNote(octave, isNormal))
			else {
				console.log(getWhiteRandomNote(octave, isNormal))
			}
		}
	}
	const genNormalNote = (isConsole = true) => {
		if (isConsole) console.log(getNormalRandomNote(octave))
		else setTargetNoteInstance(getNormalRandomNote(octave))
	}
	const [octave, setOctave] = useState([4])
	const [isNormal, setIsNormal] = useState(false)

	const [targetNoteInstance, setTargetNoteInstance] = useState(new Note())

	return (<>
		<H2>{t({cn: "note模块中有关随机生成音符的函数", en: "random note generator functions from note module"})}</H2>
		<P>{t({
			cnG: [
				"有一系列的随机函数来自于",
				<ShortCode>note</ShortCode>, `模块。常见的引入方式是：`,],
			enG: [
				<ShortCode>note</ShortCode>, " is the module that handles music notes. Before delving into it, here are some terms to clarify.",
				<ShortCode>src/music96</ShortCode>, " folder to your project. Then you can import the library to your project."]
		})}
			<Code>{`import { getWhiteRandomNote, getCasualRandomNote,\ngetNormalRandomNote, getBlackRandomNote } from "./music96/note";`}</Code>
		</P>

		<P> <ShortCode>getCasualRandomNote</ShortCode>
			{t({cn: "获取随机的音符。音符的step、alter值范围没有任何限制，为CDEFGAB七个音符、还原/升降/重升重降的任意组合。输入值有1个："})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`octave?`}</ShortCode>
			<TypeDesc>{`number | number[]`}</TypeDesc>
			<DefaultValue>4</DefaultValue>
			{t({
				cnG: ["可留空。如果只输入数字，表示输入数字的八度值固定，在step、alter中进行随机。如果输入为数字列表，表示在列表中随机选出一个八度值，然后在step、alter中进行随机。下面的随机函数的变量与此用法相同。"],
				enG: [`Ooptional. True denotes upward calculation, false indicates downward calculation.`]
			})}
		</P>
		<P> <ShortCode>getBlackRandomNote / getWhiteRandomNote</ShortCode>
			{t({cn: "获取随机的黑键/白键音符。输入值有2个："})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`octave?`}</ShortCode>
			<TypeDesc>{`number | number[]`}</TypeDesc>
			<DefaultValue>4</DefaultValue>
			{t({
				cnG: ["可留空。"],
				enG: [`Ooptional.`]
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`isNormal?`}</ShortCode>
			<TypeDesc>{`boolean`}</TypeDesc>
			<DefaultValue>true</DefaultValue>
			{t({
				cnG: ["可留空。需注意，有些琴键有一些并不常用的名字，例如B♯实际上是C，E♯实际上是F。如果将此项设置为true，那么将一些并不常用的音程排除，如果设置为false，那么无论是否常用的音名都保留。常用的音名除CDEFGAB外，还有C♯、D♭、D♯、E♭、F♯、G♭、G♯、A♭、A♯、B♭。其余的均为非常用音名，例如C♯♯、E♯、F♭♭等。"],
				enG: [`Ooptional.`]
			})}
		</P>
		<P> <ShortCode>getNormalRandomNote</ShortCode>
			{t({cn: "获取随机的黑键或白键音符。输入值有2个："})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`octave?`}</ShortCode>
			<TypeDesc>{`number | number[]`}</TypeDesc>
			<DefaultValue>4</DefaultValue>
			{t({
				cnG: ["可留空。"],
				enG: [`Ooptional.`]
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`isNormal?`}</ShortCode>
			<TypeDesc>{`boolean`}</TypeDesc>
			<DefaultValue>true</DefaultValue>
			{t({
				cnG: ["可留空。"],
				enG: [`Ooptional.`]
			})}
		</P>
		<P>{t({
			cn: "接下来可使用以下交互界面来尝试。也可以点击按钮在控制台查看完整内容。",
			en: "Next, use the interactive interface below. Alternatively, click the button to view full content in the console."
		})}</P>
		<P><Space>
			<ShortCode>octave</ShortCode>
			<Select
				mode="multiple"
				variant="filled"
				autoFocus={true}
				style={{width: "100%", maxWidth: 380, minWidth: 380}}
				placeholder="Please select"
				defaultValue={octave}
				value={octave}
				allowClear={false}
				popupMatchSelectWidth={true}
				showSearch={false}
				onChange={(x) => {
					if (x.length !== 0) setOctave(collect(x).sort().all())
				}}
				options={[{label: 1, value: 1}, {label: 2, value: 2},
					{label: 3, value: 3}, {label: 4, value: 4},
					{label: 5, value: 5}, {label: 6, value: 6}, {label: 7, value: 7},
				]}
			/>
		</Space></P>
		<P><Space>
			<Button style={{width: 240}} type="primary" onClick={() => genCasualNote(false)}>getCasualRandomNote</Button>
			<Button onClick={() => genCasualNote(true)}>console.log</Button>
		</Space></P>
		<P><Space wrap={true} style={{width: "100%"}}>
			<ShortCode>isNormal</ShortCode>
			<Switch value={isNormal} onChange={(x) => setIsNormal(x)}/>
			{isNormal.toString()}
		</Space>
		</P>
		<P><Space>
			<Button style={{width: 240}} type="primary"
			        onClick={() => genBlackORWhiteNote(false, false, isNormal)}>getWhiteRandomNote</Button>
			<Button onClick={() => genBlackORWhiteNote(true, false, isNormal)}>console.log</Button>
		</Space></P>
		<P><Space>
			<Button style={{width: 240}} type="primary"
			        onClick={() => genBlackORWhiteNote(false, true, isNormal)}>getBlackRandomNote</Button>
			<Button onClick={() => genBlackORWhiteNote(true, true, isNormal)}>console.log</Button>
		</Space></P>
		<P><Space>
			<Button style={{width: 240}} type="primary" onClick={() => genNormalNote(false)}>getNormalRandomNote</Button>
			<Button onClick={() => genNormalNote(true)}>console.log</Button>
		</Space></P>
		<ObjView name={`random note`} data={targetNoteInstance}/>
		<Console log={targetNoteInstance}/>
	</>)

}

export default NoteIntervalMethods2
