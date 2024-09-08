/* eslint-disable no-mixed-spaces-and-tabs */
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {Radio, Space} from "antd";
import {Note} from "@/music96/note/cls/NoteClass.ts";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import H1 from "@comps/common/docs/H1.tsx";
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";
import Code from "@comps/common/docs/Code.tsx";
import {getIntervalByComparingNotes} from "@/music96/interval";

const NoteView = () => {

	const [note1step, setNote1step] = useState("C")
	const [note2step, setNote2step] = useState("D")
	const [note1alter, setNote1alter] = useState(0)
	const [note2alter, setNote2alter] = useState(1)
	const [note1octave, setNote1octave] = useState(4)
	const [note2octave, setNote2octave] = useState(4)
	const [targetIntervalInstance, setTargetIntervalInstance] = useState({})
	useEffect(() => {
		try {
			setTargetIntervalInstance(getIntervalByComparingNotes(
				new Note(note1step as t_noteStep, note1alter as t_alterValue, note1octave),
				new Note(note2step as t_noteStep, note2alter as t_alterValue, note2octave)
			))
		} catch (e) {
			setTargetIntervalInstance({error: e.message} as any)
		}

	}, [note1step, note1alter, note1octave, note2step, note2alter, note2octave])
	return (<>
		<H1>{t({cn: "与音程与音符有关的函数", en: "Functions about interval and note"})}</H1>
		<H2>interval.getIntervalByComparingNotes</H2>
		<P>{t({
			cnG: [
				"这个函数来自于",
				<ShortCode>interval</ShortCode>, `模块。输入值为2个音符的实例对象，输出值为一个音程的实例对象。一个常见的示例代码是：`,],
			enG: [
				<ShortCode>note</ShortCode>, " is the module that handles music notes. Before delving into it, here are some terms to clarify.",
				<ShortCode>src/music96</ShortCode>, " folder to your project. Then you can import the library to your project."]
		})}
			<Code>{`import {getIntervalByComparingNotes} from "./music96/interval";\nconst note1 = new Note("C",1)\nconst note2 = new Note("D")\ngetIntervalByComparingNotes(note1, note2)`}</Code>
		</P>

		<P>{t({
			cn: "接下来可使用以下交互界面来查看实例相关属性，不含调用属性。也可以点击按钮在控制台查看完整内容。",
			en: ""
		})}</P>
		<P><Space>
			<ShortCode>note1 step</ShortCode>
			<Radio.Group onChange={(x) => setNote1step(x.target.value)}
			             buttonStyle="solid" size="middle" defaultValue={note1step}>
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
			<ShortCode>note1 alter</ShortCode>
			<Radio.Group onChange={(x) => setNote1alter(x.target.value)}
			             buttonStyle="solid" size="middle" defaultValue={note1alter}>
				<Radio.Button value={-2}>-2</Radio.Button>
				<Radio.Button value={-1}>-1</Radio.Button>
				<Radio.Button value={0}>0</Radio.Button>
				<Radio.Button value={1}>1</Radio.Button>
				<Radio.Button value={2}>2</Radio.Button>
			</Radio.Group></Space>
		</P>
		<P><Space>
			<ShortCode>note1 octave</ShortCode>
			<Radio.Group buttonStyle="solid" size="middle" defaultValue={note1octave}
			             onChange={(x) => setNote1octave(x.target.value)}>
				<Radio.Button value={1}>1</Radio.Button>
				<Radio.Button value={2}>2</Radio.Button>
				<Radio.Button value={3}>3</Radio.Button>
				<Radio.Button value={4}>4</Radio.Button>
				<Radio.Button value={5}>5</Radio.Button>
				<Radio.Button value={6}>6</Radio.Button>
				<Radio.Button value={7}>7</Radio.Button>
			</Radio.Group></Space>
		</P>
		<P><Space>
			<ShortCode>note2 step</ShortCode>
			<Radio.Group onChange={(x) => setNote2step(x.target.value)}
			             buttonStyle="solid" size="middle" defaultValue={note2step}>
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
			<ShortCode>note2 alter</ShortCode>
			<Radio.Group onChange={(x) => setNote2alter(x.target.value)}
			             buttonStyle="solid" size="middle" defaultValue={note2alter}>
				<Radio.Button value={-2}>-2</Radio.Button>
				<Radio.Button value={-1}>-1</Radio.Button>
				<Radio.Button value={0}>0</Radio.Button>
				<Radio.Button value={1}>1</Radio.Button>
				<Radio.Button value={2}>2</Radio.Button>
			</Radio.Group></Space>
		</P>
		<P><Space>
			<ShortCode>note2 octave</ShortCode>
			<Radio.Group buttonStyle="solid" size="middle" defaultValue={note2octave}
			             onChange={(x) => setNote2octave(x.target.value)}>
				<Radio.Button value={1}>1</Radio.Button>
				<Radio.Button value={2}>2</Radio.Button>
				<Radio.Button value={3}>3</Radio.Button>
				<Radio.Button value={4}>4</Radio.Button>
				<Radio.Button value={5}>5</Radio.Button>
				<Radio.Button value={6}>6</Radio.Button>
				<Radio.Button value={7}>7</Radio.Button>
			</Radio.Group></Space>
		</P>
		<ObjView name={`interval between the two notes`} data={targetIntervalInstance}/>
		<Console log={targetIntervalInstance}/>
	</>)

}

export default NoteView
