/* eslint-disable no-mixed-spaces-and-tabs */


import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {Radio, Select, Space} from "antd";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import H1 from "@comps/common/docs/H1.tsx";
import {Chord} from "@/music96/chord/cls/ChordClass.ts";
import {Note} from "@/music96/note";
import getChordShowObj from "@views/music96/s2_chord/methods/getChordShowObj.ts";
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";

const dealAlter = (alterValue: number) => {
  if (alterValue === 0) return ""
  if (alterValue === 1) return "♯"
  if (alterValue === -1) return "♭"
  return ""
}
const ChordView = () => {
  const [rootNoteStepAlter, setRootNoteStepAlter] = useState(["C", 0])
  const [rootNoteOctave, setRootNoteOctave] = useState(4)
  const [chordTerm, setChordTerm] = useState("maj3")
  const [chordInstance, setChordInstance] = useState(new Chord(new Note(rootNoteStepAlter[0] as t_noteStep,
    rootNoteStepAlter[1] as t_alterValue, rootNoteOctave), "halfDim7"))
  useEffect(() => {
    try {
      setChordInstance(new Chord(new Note(rootNoteStepAlter[0] as t_noteStep, rootNoteStepAlter[1] as t_alterValue, rootNoteOctave), chordTerm))
    } catch (e) {
      setChordInstance({Error: e.message} as any)
    }
  }, [rootNoteStepAlter, rootNoteOctave, chordTerm])
  return (<>
    <H1>{t({cn: "和弦模块", en: "Chord module"})}</H1>
    <H2>{t({cn: "Chord类", en: "Chord Class"})}</H2>
    <P><ShortCode>Chord</ShortCode>
      {t({
        cnG: [
          `是一个类，需要通过new关键字来构造实例。在构造函数中，需要以下两个初始输入：`],
        enG: [
          " is a Class that needs to construct instances with new keyword. In the constructor, kindly require 2 initial inputs:"]
      })}
    </P>
    <P><GuideDot/>
      <ShortCode>rootNote</ShortCode>
      <TypeDesc>{`InstanceType<typeof Note>`}</TypeDesc>
      {t({
        cnG: [
          `音符实例，作为和弦的根音。`],
        enG: []
      })}
    </P>
    <P><GuideDot/><ShortCode>chordTerm</ShortCode>
      <TypeDesc>{`string`}</TypeDesc>
      {t({
        cnG: [`和弦的字符串术语代号。`],
        enG: []
      })}
    </P>
    <P>{t({
      cn: `在和弦的实例化过程中，我们构造了很多私有变量（使用#开头）来达到计算的目的。在Chord类中，我们介绍以下思路以供读者读懂相应的类的属性。`,
      en: ``
    })}</P>
    <P>{t({
      cn: "在初始实例化之后，我们可能会对和弦做一些变形修改（transform），例如对音符的升降、添加或忽略。在完成音符的变形后，还可能对和弦进行和弦配置（Chord Voicing）的操作，最后才会得出一个和弦最终的音符列表。例如，我们对C4作为根音，进行大三和弦的初始实例化，然后对其进行一个增加六音的操作，然后将和弦配置为重复根音，其他音不变。经过上述的三重路径，最终的音符为C4、E4、G4、A4、C5。",
      en: ``
    })}</P>

    <P>{t({
      cn: "接下来可使用以下交互界面来查看实例相关属性，也可以点击按钮在控制台查看完整内容。",
      en: "Kindly use the interactive interface to explore instance attributes, or press the button to view the complete content in the console."
    })}</P>
    <P>
      <Space>
        <ShortCode>rootNote step</ShortCode>
        <Select style={{width: 200}} allowClear={false} onSelect={(x) => setRootNoteStepAlter(x as any)}
                labelRender={() => `${rootNoteStepAlter[0]}${dealAlter(rootNoteStepAlter[1] as any)}`}
                value={rootNoteStepAlter}
                options={[{value: ["C", 0], label: "C"}, {value: ["C", 1], label: "C♯"},
                  {value: ["D", -1], label: "D♭"}, {value: ["D", 0], label: "D"},
                  {value: ["D", 1], label: "D♯"}, {value: ["E", -1], label: "E♭"},
                  {value: ["E", 0], label: "E"}, {value: ["F", 0], label: "F"},
                  {value: ["F", 1], label: "F♯"}, {value: ["G", -1], label: "G♭"},
                  {value: ["G", 0], label: "G"}, {value: ["G", 1], label: "G♯"},
                  {value: ["A", -1], label: "A♭"}, {value: ["A", 0], label: "A"},
                  {value: ["A", 1], label: "A♯"}, {value: ["B", -1], label: "B♭"},
                  {value: ["B", 0], label: "B"}]}/>
      </Space>
    </P>
    <P>
      <Space>
        <ShortCode>rootNote octave</ShortCode>
        <Radio.Group buttonStyle="solid" size="middle" value={rootNoteOctave}
                     onChange={(x) => setRootNoteOctave(x.target.value)}>
          <Radio.Button value={1}>1</Radio.Button>
          <Radio.Button value={2}>2</Radio.Button>
          <Radio.Button value={3}>3</Radio.Button>
          <Radio.Button value={4}>4</Radio.Button>
          <Radio.Button value={5}>5</Radio.Button>
          <Radio.Button value={6}>6</Radio.Button>
          <Radio.Button value={7}>7</Radio.Button>
        </Radio.Group>
      </Space>
    </P>
    <P>
      <Space>
        <ShortCode>chordTerm</ShortCode>
        <Select style={{width: 200}} allowClear={false} onSelect={(x) => setChordTerm(x)}
                value={chordTerm}
                options={[
                  {value: "maj3", label: "maj3"},
                  {value: "min3", label: "min3"},
                  {value: "aug3", label: "aug3"},
                  {value: "dim3", label: "dim3"},
                  {value: "maj7", label: "maj7"},
                  {value: "min7", label: "min7"},
                  {value: "dom7", label: "dom7"},
                  {value: "halfDim7", label: "halfDim7"},
                ]}/>
      </Space>
    </P>

    <ObjView name="interval instance" data={getChordShowObj(chordInstance)}/>
    <Console log={chordInstance}/>
  </>)

}

export default ChordView
