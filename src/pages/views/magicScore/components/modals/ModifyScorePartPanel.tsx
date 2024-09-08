/* eslint-disable */
import {css} from "@emotion/react";
import {Button, Card, Input, InputNumber, Radio, Select} from "antd";
import {useEffect, useState} from "react";
import LightButton from "@comps/common/LightButton.tsx";
import {isFunction, keys, range} from "lodash";
import t from "@pages/i18n/t.tsx";
import collect from "collect.js";
import useBaseScoreConfig from "@views/magicScore/data/useBaseScoreConfig.ts";
import useGlobalSettings from "@pages/storage/globalSettings.ts";
import sounds_musicXML from "@/music96/score/static/sounds_musicXML.ts";
import cssPresets from "@assets/styles/cssPresets.ts";
import useScoreJSON from "@views/magicScore/data/useScorePart.ts";
import googleColors from "@assets/styles/googleColors.ts";
import byDefault from "@pages/utils/byDefault.ts";
import getRandomPartName from "@views/magicScore/data/getRandomPartName.ts";
import {t_scorePartMeta} from "@views/magicScore/data/types.ts";
import useForceRender from "@views/magicScore/data/useForceRender.ts";

const soundOptions = keys(sounds_musicXML).map(x => {
	return {value: x, label: x}
})


const ModifyScorePartPanel = (props: {
	switchOpen: (i: any) => void
	onCancel?: () => void
	onOK: (i: object) => any
	partMetaObj: t_scorePartMeta
}) => {

	const [partObj, setPartObj] = useState(props.partMetaObj)

	const inputWidth = 320
	const {fontFamily} = useGlobalSettings()
	const baseConfig = useBaseScoreConfig()
	const {forceRender} = useForceRender()
	return <div css={topbar_css}>
		<div className="innerFrame">
			{/*======================================= Part Name =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "音轨名称", en: "Part Name"})}</span>
				<div className="r">
					<Input style={{width: inputWidth - 120, marginRight: 15, fontFamily: fontFamily}} value={partObj.partName}
					       onChange={(e) => setPartObj({...partObj, partName: e.target.value})}/>
					<LightButton onClick={() => setPartObj({...partObj, ...{partName: getRandomPartName()}})}
					             width={105}>
						{t({cn: "随机", en: "Roll"})}
					</LightButton>
				</div>
			</div>
			{/*======================================= Instrument =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "乐器", en: "Instrument"})}</span>
				<div className="r">
					<Select style={{width: inputWidth, marginRight: 15}} allowClear={false}
					        onSelect={(x) => setPartObj({...partObj, ...{instrument: x}})}
					        value={partObj.instrument}
					        options={soundOptions}/>
				</div>
			</div>
			{/*======================================= MIDI Channel =========================================*/}
			<div className="line">
				<span className="t">MIDI Channel</span>
				<div className="r">
					<InputNumber min={1} max={16} style={{width: 80, marginRight: 42, fontFamily: fontFamily, color: "black"}}
					             value={partObj.midiChannel}
					             onChange={(e) => setPartObj({...partObj, midiChannel: e})}/>
					<span className="t">MIDI Program</span>
					<InputNumber min={1} max={128} style={{width: 80, marginRight: 15, fontFamily: fontFamily, color: "black"}}
					             value={partObj.midiProgram}
					             onChange={(e) => setPartObj({...partObj, midiProgram: e})}/>
				</div>
			</div>
			{/*======================================= CLEF =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "谱表", en: "Clef"})}</span>
				<div className="r">
					<Radio.Group buttonStyle="solid" size="middle" value={partObj.clef}
					             onChange={(x) => setPartObj({...partObj, clef: x.target.value})}>
						<Radio.Button value="G">Treble</Radio.Button>
						<Radio.Button value="B">Bass</Radio.Button>
						<Radio.Button value="M">Alto</Radio.Button>
						<Radio.Button value="P">Percussion</Radio.Button>
					</Radio.Group>
				</div>
			</div>
			{/*======================================= Bese Info =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "基本信息", en: "Bese Info"})}</span>
				<div className="r">
					<div style={{width: inputWidth, display: "flex", justifyContent: "space-between"}}>
						<Card type="inner" size="small" styles={{header: {fontWeight: "normal"}}}
						      title={t({cn: "拍号", en: "BEAT"})}
						      style={{width: 80, cursor: "not-allowed", userSelect: "none"}}>
							{baseConfig.beat}
						</Card>
						<Card type="inner" size="small" styles={{header: {fontWeight: "normal"}}} title={t({cn: "速度", en: "BPM"})}
						      style={{width: 80, cursor: "not-allowed", userSelect: "none"}}>
							{baseConfig.bpm}
						</Card>
						<Card type="inner" size="small" styles={{header: {fontWeight: "normal"}}}
						      title={t({cn: "升降号数量", en: "Alter Numbers"})}
						      style={{width: 140, cursor: "not-allowed", userSelect: "none"}}>
							{baseConfig.fifth}
						</Card>
					</div>
				</div>
			</div>
			{/* ======================== foot bar of confirm / cancel ==========================*/}
			<div style={{width: "100%", ...cssPresets.flexCenter, marginTop: 25, gap: 20}}>
				<Button style={{width: 150}} onClick={() => {
					props.onOK(partObj)
					console.log(1)
					forceRender()
				}} type="primary">
					{t({cn: "确定", en: "Confirm"})}
				</Button>
				<Button style={{width: 150}} onClick={() => {
					props.onCancel()
					setPartObj(props.partMetaObj)
				}}>
					{t({cn: "取消", en: "Cancel"})}
				</Button>
			</div>
		</div>

	</div>
}

const topbar_css = css({
	width: '100%',
	...cssPresets.flexCenter,
	"& div.innerFrame": {},
	"&>div": {
		width: '100%',
		maxWidth: 700,
		backgroundColor: 'white',
		margin: 'auto', paddingTop: 10,
		paddingBottom: 10,
	},
	"& div.line": {
		marginTop: 5,
		marginBottom: 7,
		marginLeft: "auto",
		marginRight: "auto",
		width: 600,
		...cssPresets.flexCenter
	}, "& div.line>span.t": {
		// backgroundColor: "red",
		width: 130,
		display: "inline-block",
		textAlign: "right"
	}, "& div.line>div.r": {
		width: 400,
		display: "inline-block",
		// backgroundColor:"green",
		textAlign: "left"
	},
	"& span.t": {
		marginRight: 10,
	}
})
export default ModifyScorePartPanel