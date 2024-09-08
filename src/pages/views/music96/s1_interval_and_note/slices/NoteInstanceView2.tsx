/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */


import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import GuideDot from "@comps/common/docs/GuideDot.tsx";
import TypeDesc from "@comps/common/docs/TypeDesc.tsx";
import DefaultValue from "@comps/common/docs/DefaultValue.tsx";
import H2 from "@comps/common/docs/H2.tsx";
import {useEffect, useState} from "react";
import {InputNumber, Radio, Space, Switch} from "antd";
import {Note} from "@/music96/note/cls/NoteClass.ts";
import ObjView from "@comps/common/docs/ObjView.tsx";
import Console from "@comps/common/docs/Console.tsx";
import {Interval} from "@/music96/interval/cls/IntervalClass.ts";
import {t_intervalType} from "@/music96/interval/static/types.ts";
import {t_alterValue, t_noteStep} from "@/music96/note/static/types.ts";

const NoteInstanceView2 = () => {
  const [step, setStep] = useState("C")
  const [alter, setAlter] = useState(0)
  const [octave, setOctave] = useState(4)
  const [targetNotesArray, setTargetNotesArray] = useState(new Note())
  const [isSelfIncluded, setIsSelfIncluded] = useState(true)
  const [alterAbsLessThan, setAlterAbsLessThan] = useState(1)


  useEffect(() => {
    try {
      const noteInstance = new Note(step as t_noteStep, alter as t_alterValue, octave)
      const notesArray = noteInstance.getSamePitchNotes(isSelfIncluded,alterAbsLessThan as any)
      setTargetNotesArray(notesArray as any)
    } catch (e) {
      setTargetNotesArray({error: e.message} as any)
    }
  }, [step, alter, octave, alterAbsLessThan,isSelfIncluded])
  return (<>

    <H2>{t({cn: "Note实例方法：getSamePitchNotes", en: "Note Instance Method: getSamePitchNotes"})}</H2>
    <P><ShortCode>{`getSamePitchNotes`}</ShortCode>
      {t({
        cnG: [
          `输出音符的等音音符，输出结果是列表类型，列表的每一项都是音符的实例。输入值有2个：`],
        enG: [
          `Given the interval and direction, the new note instance is output. It needs 2 inputs:`]
      })}
    </P>
    <P>
      <GuideDot/>
      <ShortCode>{`isSelfIncluded?`}</ShortCode>
      <TypeDesc>{`boolean`}</TypeDesc>
      <DefaultValue>true</DefaultValue>
      {t({
        cnG: ["布尔类型，可留空。表示输出的音符是否包含本音符（因为本音符和本音符是必然等高的）。true表示包含，false表示不包含。默认为true。"],
        enG: ["Required. The input is a instance of Interval that need the keyword of new."]
      })}
    </P>
    <P>
      <GuideDot/>
      <ShortCode>{`alterAbsLessThan?`}</ShortCode>
      <TypeDesc>{`0 | 1 | 2`}</TypeDesc>
      <DefaultValue>{1}</DefaultValue>
      {t({
        cnG: ["可留空。输入的是数字类型，表示输出的音符是否包含增减或倍增倍减。0表示输出的音符只能是还原，1表示包含还原和增减，2表示包含还原、增减和倍增倍减。"],
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
        <ShortCode>isSelfIncluded</ShortCode>
        <Switch value={isSelfIncluded} onChange={(x) => setIsSelfIncluded(x)}/>
        <span>{isSelfIncluded.toString()}</span>
      </Space>
    </P>
    <P>
      <Space>
        <ShortCode>alterAbsLessThan</ShortCode>
        <Radio.Group buttonStyle="solid" size="middle" defaultValue={1}
                     onChange={(x) => setAlterAbsLessThan(x.target.value)}>
          <Radio.Button value={0}>0</Radio.Button>
          <Radio.Button value={1}>1</Radio.Button>
          <Radio.Button value={2}>2</Radio.Button>
        </Radio.Group>
      </Space>
    </P>
    <ObjView name={`same pitch notes`}
             data={targetNotesArray}/>
    <Console log={targetNotesArray}/>
  </>)

}

export default NoteInstanceView2
