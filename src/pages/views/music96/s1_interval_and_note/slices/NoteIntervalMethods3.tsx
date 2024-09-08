/* eslint-disable no-mixed-spaces-and-tabs */
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {Button, Flex, Input, InputNumber, Radio, Select, Slider, Space, Switch} from "antd";
import {Note} from "@/music96/note/cls/NoteClass.ts";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import H1 from "@comps/common/docs/H1.tsx";
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";
import Code from "@comps/common/docs/Code.tsx";
import {getIntervalByComparingNotes} from "@/music96/interval";
import {
	getStepIndexByMove, getStepGapByStepAlter, getStepByStepMove
} from "@/music96/note";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import collect from "collect.js";
import Opt from "@comps/common/docs/Opt.tsx";

const NoteIntervalMethods3 = () => {
	const [step, setStep] = useState("C")

	const [move, setMove] = useState(1)
	const [isAscending, setIsAscending] = useState(true)

	const [targetStep, setTargetStep
	] = useState(getStepByStepMove(step as t_noteStep, move, isAscending))
	useEffect(() => {
		setTargetStep(getStepByStepMove(step as t_noteStep, move, isAscending))
	}, [step, move, isAscending]);
	return (<>
		<H1>{t({cn: "note模块中有关step计算的函数", en: "step functions from note module"})}</H1>
		<P>{t({
			cnG: [
				"有三个和step有关的函数来自于",
				<ShortCode>note</ShortCode>, `模块。常见的引入方式是：`,],
			enG: [
				<ShortCode>note</ShortCode>, " is the module that handles music notes. Before delving into it, here are some terms to clarify.",
				<ShortCode>src/music96</ShortCode>, " folder to your project. Then you can import the library to your project."]
		})}
			<Code>{`import { getStepIndexByMove, getStepGapByStepAlter, \ngetStepByStepMove} from "./music96/note";`}</Code>
		</P>
		<H2>getStepByStepMove</H2>
		<P> <ShortCode>getStepByStepMove</ShortCode>
			<Opt>{`[ number, "C" | "D" | "E" | "F" | "G" | "A" | "B" ]`}</Opt>
			{t({
				cnG: ["将step值看做一个循环的圈，CDEFGAB七个音符每个音符占据一个格子。给定初始的step值和移动方向（正数表示向上移动，负数表示向下移动），输出移动后的step值（“CDEFGAB”之一）。输出值为",
					<TypeDesc>{`[ number, "C" | "D" | "E" | "F" | "G" | "A" | "B" ]`}</TypeDesc>,
					"，其中第一位数字表示经过了多少轮的移动。例如，“C”向右（上）移动1位是“D”，向左（下）移动一位是“B”，向右（上）移动7位是新一轮的“C”。输入值有3个："]
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`step`}</ShortCode>
			<TypeDesc>{`"C" | "D" | "E" | "F" | "G" | "A" | "B"`}</TypeDesc>
			{t({
				cnG: ["不可留空。"],
				enG: [`Required.`]
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`move`}</ShortCode>
			<TypeDesc>{`number`}</TypeDesc>
			{t({
				cnG: ["不可留空。可以是正数、负数或者0，正数表示向右（上）移动，负数表示向左（下）移动。"],
				enG: [`Required.`]
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`isAscending?`}</ShortCode>
			<TypeDesc>{`boolean`}</TypeDesc>
			<DefaultValue>true</DefaultValue>
			{t({
				cnG: ["可留空。true表示向上或向右移动，false表示向下或向左移动。"],
				enG: [`Ooptional.`]
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
			<ShortCode>move</ShortCode>
			<InputNumber value={move} onChange={(x) => setMove(x)}></InputNumber>
		</Space></P>
		<P>
			<Space>
				<ShortCode>isAscending</ShortCode>
				<Switch value={isAscending} onChange={(x) => setIsAscending(x)}></Switch>
				{isAscending.toString()}
			</Space>

		</P>
		<ObjView name={`target note`} data={targetStep}/>
		<Console log={targetStep}/>
	</>)

}

export default NoteIntervalMethods3
