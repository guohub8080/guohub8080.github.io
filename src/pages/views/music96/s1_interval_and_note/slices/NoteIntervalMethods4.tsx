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

const NoteIntervalMethods4 = () => {
	const [stepIndex, setStepIndex] = useState(0)

	const [move, setMove] = useState(1)
	const [isAscending, setIsAscending] = useState(true)

	const [targetStep, setTargetStep
	] = useState(getStepIndexByMove(stepIndex, move, isAscending))
	useEffect(() => {
		setTargetStep(getStepIndexByMove(stepIndex, move, isAscending))
	}, [stepIndex, move, isAscending]);
	return (<>

		<H2>getStepIndexByMove</H2>
		<P> <ShortCode>getStepIndexByStepMove</ShortCode>
			<Opt>{`[ number, 0 | 1 | 2 | 3 | 4 | 5 | 6 ]`}</Opt>
			{t({
				cnG: ["和上个函数类似，唯一不同的是将step值替换为index值。函数规定，0代表C，1代表D，以此类推，6代表B。输入值有3个："]
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`stepIndex`}</ShortCode>
			<TypeDesc>{`0 | 1 | 2 | 3 | 4 | 5 | 6`}</TypeDesc>
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
			<ShortCode>stepIndex</ShortCode>
			<Radio.Group onChange={(x) => setStepIndex(x.target.value)}
			             buttonStyle="solid" size="middle" defaultValue={stepIndex}>
				<Radio.Button value={0}>0(C)</Radio.Button>
				<Radio.Button value={1}>1(D</Radio.Button>
				<Radio.Button value={2}>2(E)</Radio.Button>
				<Radio.Button value={3}>3(F)</Radio.Button>
				<Radio.Button value={4}>4(G)</Radio.Button>
				<Radio.Button value={5}>5(A)</Radio.Button>
				<Radio.Button value={6}>6(B)</Radio.Button>
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
		<ObjView name={`target step index`} data={targetStep}/>
		<Console log={targetStep}/>
	</>)

}

export default NoteIntervalMethods4
