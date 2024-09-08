/* eslint-disable no-mixed-spaces-and-tabs */
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
 import B1 from "@comps/common/docs/B1.tsx";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {Radio, Space} from "antd";
import {Note} from "@/music96/note/cls/NoteClass.ts";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import H1 from "@comps/common/docs/H1.tsx";
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";

const NoteView = () => {
	const [step, setStep] = useState("C")
	const [alter, setAlter] = useState(0)
	const [octave, setOctave] = useState(4)
	const [noteInstance, setNoteInstance] = useState(new Note())
	useEffect(() => {
		setNoteInstance(new Note(step as t_noteStep, alter as t_alterValue, octave))
	}, [step, alter, octave])
	return (<>
		<H1>{t({cn: "音符模块", en: "Note module"})}</H1>
		<P>{t({
			cnG: [
				<ShortCode>note</ShortCode>, `是该库中处理音符的模块。一个音符由两部分组成，以`,
				<B1>C♯</B1>, `为例，该音符包含了两个部分：前面的音符音名`, <B1>C</B1>, "称之为", <ShortCode>step</ShortCode>,
				"，有效的值为以下七个之一：C、D、E、F、G、A和B；后面的音符升降号描述",
				<B1>♯</B1>, "称之为",
				<ShortCode>alter</ShortCode>, `，有效值为sharp（升）、double sharp（重升）、flat（降）、double flat（重降）和natural（还原）。决定一个音符在钢琴键盘的八度位置的属性`,
				<ShortCode>octave</ShortCode>, `不影响音符的音名和升降号，在本模块中规定C4是“中央C”。`],
			enG: [
				<ShortCode>note</ShortCode>, " is the module that handles music notes. Before delving into it, here are some terms to clarify.",
				<ShortCode>src/music96</ShortCode>, " folder to your project. Then you can import the library to your project."]
		})}
		</P>
		<H2>{t({cn: "Note类", en: "Note Class"})}</H2>
		<P>{t({
			cnG: [
				<ShortCode>Note</ShortCode>, `是一个类，需要通过new关键字来构造实例。在构造函数中，需要以下三个初始输入：`],
			enG: [
				<ShortCode>note</ShortCode>, " is the module that handles music notes. Before delving into it, here are some terms to clarify."]
		})}
		</P>
		<P><GuideDot/>
			<ShortCode>step?</ShortCode>
			<TypeDesc>{`"C" | "D" | "E" | "F" | "G" | "A" | "B"`}</TypeDesc>
			<DefaultValue>{`"C"`}</DefaultValue>
			{t({
				cnG: [
					`字符串类型，可留空。输入值为音名的英文大写，同时做了兼容设计，可输入小写字符（不推荐）。`],
				enG: []
			})}
		</P>
		<P><GuideDot/><ShortCode>alter?</ShortCode>
			<TypeDesc>{`-2 | -1 | 0 | 1 | 2`}</TypeDesc>
			<DefaultValue>0</DefaultValue>
			{t({
				cnG: [
					`数字类型，可留空。其中，-2代表重降（double flat），-1代表降（flat），0代表还原（natural），1代表升（sharp），2代表重升（double sharp）。`],
				enG: []
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>octave?</ShortCode>
			<TypeDesc>{`number`}</TypeDesc>
			<DefaultValue>4</DefaultValue>
			{t({
				cnG: [
					`数字类型，可留空。其中，若输入值为负数，则调整为默认值4。`],
				enG: []
			})}
		</P>
		<P>{t({
			cnG: ["有一些需要解释的实例属性。",
				<ShortCode>artName</ShortCode>, "是指通过升降符号来描述音符，其中重升和重降分别使用了两个升、降号来表示（这在音乐上是不规范的）。"
				, <ShortCode>fifthValue</ShortCode>, "是指音符在五度圈的位置，以C为0值，顺时针方向+1，逆时针方向-1。",
				<ShortCode>isNormal</ShortCode>, "是指音符是否常用，例如C♯、E♭是常用的，C♭、E♯则不常用。",
				<ShortCode>isBlack</ShortCode>, "是指音符是否为黑键。",
				<ShortCode>locationId</ShortCode>, "是指音符以C为值0，往右每移动一个键，无论黑白都+1。设置这项属性的目的是为处理不同音但同位置的音符，例如C♯和D♭。",
				<ShortCode>semitoneWithinOctave</ShortCode>, "和上个属性本质是相似的，不同的是该属性计算音符在本八度内的半音值：例如在第4个八度的C♭，实际上位置已和第3个八度的B重合，故将此属性值设置为-1。",
				<ShortCode>stepIndex</ShortCode>, "是值将C的索引值设置为0，D设置为1，以此类推，B的索引值设置为6。将上述属性结合起来，可以实现复杂的乐理计算。",
				<ShortCode>pitchValue</ShortCode>, "是调用属性（getter），是结合音符所在八度位置和本身的半音数计算的一个数值，可简单理解为MIDI值或者钢琴键盘位置。",

			], enG: []
		})}
		</P>
		<P>{t({
			cn: "接下来可使用以下交互界面来查看实例相关属性，不含调用属性。也可以点击按钮在控制台查看完整内容。",
			en: ""
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
		<ObjView data={noteInstance}/>
		<Console log={noteInstance}/>
	</>)

}

export default NoteView
