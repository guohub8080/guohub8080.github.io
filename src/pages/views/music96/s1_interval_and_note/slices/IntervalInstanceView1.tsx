/* eslint-disable no-mixed-spaces-and-tabs */

import baseIntervals from "../svgs/baseIntervals.svg"
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {InputNumber, Radio, Space, Switch} from "antd";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import {Interval} from "@/music96/interval/cls/IntervalClass.ts";
import {t_intervalType} from "@/music96/interval/static/types.ts";
import Code from "@comps/common/docs/Code.tsx";

const IntervalInstanceView1 = () => {
    const instanceArrayAttempt = (givenInstance: InstanceType<typeof Interval>,
                                  isSelfTypeExcluded: boolean,
                                  isAugDimExcluded: boolean,
                                  isDoubleAugDimExcluded: boolean) => {
        try {
            if (givenInstance.getEqualInterval) return givenInstance.getEqualInterval(isSelfTypeExcluded, isAugDimExcluded, isDoubleAugDimExcluded)
            throw new Error("Wrong given interval like maj1 or p3.")
        } catch (e) {
            return {error: e.message}
        }
    }
    const [intervalType, setIntervalType] = useState("p")
    const [intervalNum, setIntervalNum] = useState(1)
    const [intervalInstance, setIntervalInstance] = useState(new Interval())
    const [isSelfTypeExcluded, setIsSelfTypeExcluded] = useState(true)
    const [isAugDimExcluded, setIsAugDimExcluded] = useState(false)
    const [isDoubleAugDimExcluded, setIsDoubleAugDimExcluded] = useState(false)
    const [resultEqualIntervalArray, setResultEqualIntervalArray] = useState(() => {
        return instanceArrayAttempt(intervalInstance, isSelfTypeExcluded, isAugDimExcluded, isDoubleAugDimExcluded)
    })
    useEffect(() => {
        try {
            setIntervalInstance(new Interval(intervalType as t_intervalType, intervalNum))
        } catch (e) {
            setIntervalInstance({Error: e.message as any} as any)
            setResultEqualIntervalArray({Error: e.message as any} as any)
        }
    }, [intervalType, intervalNum]);
    useEffect(() => {
        try {
            setResultEqualIntervalArray(() => instanceArrayAttempt(intervalInstance, isSelfTypeExcluded, isAugDimExcluded, isDoubleAugDimExcluded))
        } catch (e) {
            setResultEqualIntervalArray({Error: e.message as any} as any)
        }
    }, [intervalType, intervalNum, isAugDimExcluded, isDoubleAugDimExcluded, isSelfTypeExcluded, intervalInstance])

    return (<>
        <H2>{t({cn: "Interval实例方法: getEqualInterval", en: "Interval instance methods: getEqualInterval"})}</H2>
        <P>
            <ShortCode>getEqualInterval</ShortCode>
            {t({
                cn: "需要3个输入，输出为音程实例的列表。",
                en: " It requires 3 inputs and the output is an Array of interval instances."
            })}
        </P>
        <P><GuideDot/>
            <ShortCode>isSelfTypeExcluded?</ShortCode>
            <TypeDesc>boolean</TypeDesc>
            <DefaultValue>false</DefaultValue>
            {t({
                cnG: [
                    `布尔类型，可留空。true表示输出的等音程列表中要排除和输入音程相同的音程类型，false表示不排除。换言之，是否包含自己的类型。`],
                enG: [
                    `Boolean type, optional. True to exclude self types while generating the list of intervals; false to include. In essence, whether includes the self type.`
                ]
            })}
        </P>

        <P><GuideDot/>
            <ShortCode>isDoubleAugDimExcluded?</ShortCode>
            <TypeDesc>boolean</TypeDesc>
            <DefaultValue>false</DefaultValue>
            {t({
                cnG: [
                    `布尔类型，可留空。true表示输出的等音程列表中要排除倍增和倍减音程，false表示不排除。`],
                enG: [
                    `Boolean type, optional. True for exclude double augmented or double diminished intervals in the output, and false for all to be included.`
                ]
            })}
        </P>
        <P><GuideDot/>
            <ShortCode>isAugDimExcluded?</ShortCode>
            <TypeDesc>boolean</TypeDesc>
            <DefaultValue>false</DefaultValue>
            {t({
                cnG: [
                    `布尔类型，可留空。true表示输出的等音程列表中要排除增减音程，false表示不排除。`],
                enG: [
                    `Boolean type, optional. True for exclude augmented or diminished intervals in the output, and false for all to be included.`
                ]
            })}
        </P>
        <P>{t({
            cnG: [
                `所有的实例方法都需要先构造一个实例才能使用，例如：`],
            enG: [
                `All instance methods require creating an instance before use, like:`
            ]
        })}
        </P>
        <Code>{`const intervalInstance = new Instance("p",8)
const equalInstance = intervalInstance.getEqualInterval(true, true, false)
console.log(equalInstance)
// return: []`}</Code>
        <img src={baseIntervals} alt=""/>
        <P>{t({
            cn: "接下来可使用以下交互界面来查看实例相关属性，也可以点击按钮在控制台查看完整内容。",
            en: "Kindly use the interactive interface to explore instance attributes, or press the button to view the complete content in the console."
        })}</P>
        <P><Space>
            <ShortCode>intervalType</ShortCode>
            <Radio.Group onChange={(x) => setIntervalType(x.target.value)}
                         buttonStyle="solid" size="middle" defaultValue="p">
                <Radio.Button value="dim-">{t({cn: "倍减", en: "flat-"})}</Radio.Button>
                <Radio.Button value="dim">{t({cn: "减", en: "flat"})}</Radio.Button>
                <Radio.Button value="min">{t({cn: "小", en: "minor"})}</Radio.Button>
                <Radio.Button value="p">{t({cn: "纯", en: "natural"})}</Radio.Button>
                <Radio.Button value="maj">{t({cn: "大", en: "major"})}</Radio.Button>
                <Radio.Button value="aug">{t({cn: "增", en: "sharp"})}</Radio.Button>
                <Radio.Button value="aug+">{t({cn: "倍增", en: "sharp+"})}</Radio.Button>
            </Radio.Group></Space>
        </P>
        <P><Space>
            <ShortCode>intervalNum</ShortCode>
            <InputNumber defaultValue={intervalNum} onChange={(x) => setIntervalNum(x)}></InputNumber></Space>
        </P>
        <P>
            <Space>
                <ShortCode>isSelfTypeExcluded</ShortCode>
                <Switch onChange={(x) => setIsSelfTypeExcluded(x)} value={isSelfTypeExcluded}/>
                <span>{isSelfTypeExcluded.toString()}</span>
            </Space>
        </P>
        <P>
            <Space>
                <ShortCode>isAugDimExcluded</ShortCode>
                <Switch onChange={(x) => setIsAugDimExcluded(x)} value={isAugDimExcluded}/>
                <span>{isAugDimExcluded.toString()}</span>
            </Space>
        </P>
        <P>
            <Space>
                <ShortCode>isDoubleAugDimExcluded</ShortCode>
                <Switch onChange={(x) => setIsDoubleAugDimExcluded(x)} value={isDoubleAugDimExcluded}/>
                <span>{isDoubleAugDimExcluded.toString()}</span>
            </Space>
        </P>
        <ObjView name="Equal Interval Array" data={resultEqualIntervalArray}/>
        <Console log={resultEqualIntervalArray}/>
    </>)
}

export default IntervalInstanceView1
