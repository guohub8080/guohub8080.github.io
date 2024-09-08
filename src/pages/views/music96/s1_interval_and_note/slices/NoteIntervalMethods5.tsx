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
import googleColors from "@assets/styles/googleColors.ts";

const NoteIntervalMethods5 = () => {
	const [step1, setStep1] = useState("C")
	const [step2, setStep2] = useState("D")
	const [octave1, setOctave1] = useState(4)
	const [octave2, setOctave2] = useState(4)


	const [stepGap, setStepGap
	] = useState(getStepGapByStepAlter(step1 as t_noteStep, octave1, step2 as t_noteStep, octave2))
	useEffect(() => {
		setStepGap(getStepGapByStepAlter(step1 as t_noteStep, octave1, step2 as t_noteStep, octave2))
	}, [step1, octave1, step2, octave2]);
	return (<>
		<H2>getStepGapByStepAlter</H2>
		<P> <ShortCode>getStepGapByStepAlter</ShortCode>
			<Opt>{`number`}</Opt>
			{t({
				cnG: ["给定两个函数的step和octave，计算他们的差距。输入值有4个："]
			})}
		</P>
		<P><GuideDot/>
			<ShortCode>{`step1`}</ShortCode>
			<TypeDesc>{`"C" | "D" | "E" | "F" | "G" | "A" | "B" `}</TypeDesc>
			{t({
				cnG: ["不可留空。"],
				enG: [`Required.`]
			})}
		</P> <P><GuideDot/>
		<ShortCode>{`octave1`}</ShortCode>
		<TypeDesc>{`number`}</TypeDesc>
		{t({
			cnG: ["不可留空。"],
			enG: [`Required.`]
		})}
	</P>
		<P><GuideDot/>
			<ShortCode>{`step2`}</ShortCode>
			<TypeDesc>{`"C" | "D" | "E" | "F" | "G" | "A" | "B" `}</TypeDesc>
			{t({
				cnG: ["不可留空。"],
				enG: [`Required.`]
			})}
		</P> <P><GuideDot/>
		<ShortCode>{`octave2`}</ShortCode>
		<TypeDesc>{`number`}</TypeDesc>
		{t({
			cnG: ["不可留空。"],
			enG: [`Required.`]
		})}
	</P>


		<P>{t({
			cn: "接下来可使用以下交互界面来尝试。也可以点击按钮在控制台查看完整内容。",
			en: "Next, use the interactive interface below. Alternatively, click the button to view full content in the console."
		})}</P>

		<P><Space>
			<ShortCode>step1</ShortCode>
			<Radio.Group onChange={(x) => setStep1(x.target.value)}
			             buttonStyle="solid" size="middle" value={step1}>
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
			<ShortCode>octave1</ShortCode>
			<Radio.Group buttonStyle="solid" size="middle" value={octave1}
			             onChange={(x) => setOctave1(x.target.value)}>
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
			<ShortCode>step2</ShortCode>
			<Radio.Group onChange={(x) => setStep2(x.target.value)}
			             buttonStyle="solid" size="middle" value={step2}>
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
			<ShortCode>octave2</ShortCode>
			<Radio.Group buttonStyle="solid" size="middle" value={octave2}
			             onChange={(x) => setOctave2(x.target.value)}>
				<Radio.Button value={1}>1</Radio.Button>
				<Radio.Button value={2}>2</Radio.Button>
				<Radio.Button value={3}>3</Radio.Button>
				<Radio.Button value={4}>4</Radio.Button>
				<Radio.Button value={5}>5</Radio.Button>
				<Radio.Button value={6}>6</Radio.Button>
				<Radio.Button value={7}>7</Radio.Button>
			</Radio.Group></Space>
		</P>
		<P>Step Gap Result：<span style={{fontWeight:700,color:googleColors.purple700}}>{stepGap}</span></P>
		<Console log={stepGap}/>
	</>)

}

export default NoteIntervalMethods5
