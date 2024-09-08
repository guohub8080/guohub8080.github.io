/* eslint-disable no-mixed-spaces-and-tabs */


import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {InputNumber, Radio} from "antd";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import H1 from "@comps/common/docs/H1.tsx";
import {Interval} from "@/music96/interval/cls/IntervalClass.ts";
import {t_intervalType} from "@/music96/interval/static/types.ts";

const IntervalView = () => {
  const [prefix, setPrefix] = useState("p")
  const [intervalNum, setIntervalNum] = useState(1)
  const [intervalInstance, setIntervalInstance] = useState(new Interval())
  useEffect(() => {
    try {
      setIntervalInstance(new Interval(prefix as t_intervalType, intervalNum))
    } catch (e) {
      setIntervalInstance({Error: e.message as any} as any)
    }

  }, [prefix, intervalNum])
  return (<>
    <H1>{t({cn: "音程模块", en: "Interval module"})}</H1>
    <H2>{t({cn: "Interval类", en: "Interval Class"})}</H2>
    <P>
      {t({
        cnG: [
          <ShortCode>Interval</ShortCode>, `是一个类，需要通过new关键字来构造实例。在构造函数中，需要以下两个初始输入：`],
        enG: [
          <ShortCode>Interval</ShortCode>, " is a Class that needs to construct instances with new keyword. In the constructor, kindly require 2 initial inputs:"]
      })}
    </P>
    <P><GuideDot/>
      <ShortCode>intervalType?</ShortCode>
      <TypeDesc>{`"p" | "maj" | "min" | "aug" | "dim" | "aug+" | "dim-"`}</TypeDesc>
      <DefaultValue>{`"p"`}</DefaultValue>
      {t({
        cnG: [
          `字符串类型，可留空。输入值为音程的代号，「p」表示「纯」，「maj」表示「大」，「min」表示「小」，「aug」表示「增」，「aug+」表示「倍增」，「dim」表示「减」，以及「dim-」表示「倍减」。`],
        enG: [
          `String type, blank allowed. Use "p" for "pure", "maj" for "major", "min" for "minor", "aug" for "augmented", "aug+" for "double augmented", "dim" for "diminished", and "dim-" for "double diminished".`
        ]
      })}
    </P>
    <P><GuideDot/><ShortCode>intervalNum?</ShortCode>
      <TypeDesc>{`number`}</TypeDesc>
      <DefaultValue>1</DefaultValue>
      {t({
        cnG: [
          `数字类型，可留空。该数字表示的含义是音程乐理中的“度数”，例如二度、三度。如果输入的是0或者负数，那么会引发报错。`],
        enG: [`Number type, blank allowed. This number signifies "degree" in music theory, like second and third degrees. If you input 0 or a negative number, an error is raised then.`]
      })}
    </P>
    <P>{t({
      cn: `在音程中，音程的类型需要和音程度数相匹配，例如只有“纯一度”而没有“大一度”，只有“大三度”而没有“纯三度”。如果在构造函数时提供了错误的信息，那么会报错。在中文文档中，不区分“大七度”和“大7度”的区别。`,
      en: `For intervals, the intervalType must align with the intervalNum. For instance, "pure1" occurs but not "major1," while "major3" is seen but not "pure3." If incorrect information is provided during construction, an error may occur.`
    })}</P>
    <P>{t({
      cn: "所有音程都有增减音程。我们不推荐计算一些非常极端的音程，例如倍减1度，这非常容易引发Bug，但为了编程统一性的考虑没有将其按照错误处理。",
      en: `All intervals feature augmented and diminished situations. We kindly discourage calculating some highly extreme intervals, such as the double diminished 1st degree, due to potential bugs. However, for consistency in programming, we haven't treated it as an error.`
    })}</P>
    <P>{t({
      cnG: ["在构造的音程实例中，",
        <ShortCode>numWithinOctave</ShortCode>, "是音程对应的八度内的音程。例如，纯8度对应纯1度，大9度对应大2度。"
        ,
        <ShortCode>isNatural</ShortCode>, "是指是否是自然音程或是变化音程，超过八度的音程则按八度内的音程计算。需要额外注意的是，增四度、减五度都属于自然音程。",
        <ShortCode>semitoneGap</ShortCode>, "是指音程实际包含的半音差值，例如纯一度的半音差是0，大三度的半音差是4。",
        <ShortCode>semitoneGapWithinOctave</ShortCode>, "计算音程在八度内的半音差值，例如纯八度的半音差是12，但是将其挪到八度以内是纯一度，半音差是0。",
        <ShortCode>logicOctaveGap</ShortCode>, "是指逻辑上的八度差，即忽略音程类型，数字每满8进1。例如，大七度的值为0，倍增7度实际上已经到达了下一个八度的范围，但依然为0。",
        <ShortCode>factOctaveGap</ShortCode>, "是指实际上的八度差，要考虑音程类型。例如大七度的值为0，倍增七度的值为1。",

        <ShortCode>semitoneLocation</ShortCode>, "是一个不希望公开的属性。这个属性只是为了计算复杂音程，仅为数学原因考虑，而和音程模型无关。它表示的含义是把半音差像钟表一样组成圆环，0至11是第一圈，从12开始就进入了第二圈，而该属性关心的是半音差在一圈内的位置。",
      ], enG: [
        "In the Interval instance, ",
        <ShortCode>numWithinOctave</ShortCode>, " refers to the interval within an octave. For instance, pure 8th degree corresponds to pure 1st degree, and major 9th degree corresponds to major 2nd degree. "
        ,
        <ShortCode>isNatural</ShortCode>, " refers to the pitch distance within an octave. For instance, pure 8th degree corresponds to pure 1st degree and major 9th degree aligns with major 2nd degree. This indicates whether it's a natural or modal rhythm. Above the octave, pitch distances are calculated according to those within the octave. Please note, both augmented fourth degree and diminished fifth degree belong to natural rhythms. ",
        <ShortCode>semitoneGap</ShortCode>, "refers to the actual semitone gap encompassed by a musical interval, such as 0 for pure 1st and 4 for major 3rd. ",
        <ShortCode>semitoneGapWithinOctave</ShortCode>, " calculates the semitone gap of the given interval within an octave, e.g., in the case of a pure octave, the semitone gap is 12. But when moving it to within an octave, it's a perfect 1st, with a half-note interval of 0. ",
        <ShortCode>logicOctaveGap</ShortCode>, " refers to logical octave gap, which disregard chord types and advance by 1 every full 8 values. For instance, the value of a major seventh is 0. A double augmented seventh has actually reached the next octave range, but it remains as 0. ",
        <ShortCode>factOctaveGap</ShortCode>, "refers to the absolute gap in octaves, considering the type of interval. For example, a major seventh has a value of 0, and a double augmented seventh has a value of 1. ",
        <ShortCode>_semitoneLocation</ShortCode>, " is an unpublicized attribute, kindly underlined. The attribute solely serves to calculate intricate intervals mathematically. It choreographs the half-tone interval as a circular ring. 0 to 11 is the first cycle, followed by the second starting from 12. This attribute pertains to the position of the half-tone interval within this cycle. ",
      ]
    })}
    </P>
    <P>{t({
      cn: "接下来可使用以下交互界面来查看实例相关属性，也可以点击按钮在控制台查看完整内容。",
      en: "Kindly use the interactive interface to explore instance attributes, or press the button to view the complete content in the console."
    })}</P>
    <P>
      <ShortCode>intervalType</ShortCode>
      <Radio.Group onChange={(x) => setPrefix(x.target.value)}
                   buttonStyle="solid" size="middle" defaultValue="p">
        <Radio.Button value="dim-">{t({cn: "倍减", en: "flat-"})}</Radio.Button>
        <Radio.Button value="dim">{t({cn: "减", en: "flat"})}</Radio.Button>
        <Radio.Button value="min">{t({cn: "小", en: "minor"})}</Radio.Button>
        <Radio.Button value="p">{t({cn: "纯", en: "natural"})}</Radio.Button>
        <Radio.Button value="maj">{t({cn: "大", en: "major"})}</Radio.Button>
        <Radio.Button value="aug">{t({cn: "增", en: "sharp"})}</Radio.Button>
        <Radio.Button value="aug+">{t({cn: "倍增", en: "sharp+"})}</Radio.Button>
      </Radio.Group>
    </P>
    <P>
      <ShortCode>intervalNum</ShortCode>
      <InputNumber defaultValue={intervalNum} onChange={(x) => setIntervalNum(x)}></InputNumber>
    </P>

    <ObjView name="interval instance" data={intervalInstance}/>
    <Console log={intervalInstance}/>
  </>)

}

export default IntervalView
