/* eslint-disable */
import {css} from "@emotion/react";
import {Button, Input, InputNumber, message, Radio, Select} from "antd";
import {useEffect} from "react";
import guoDT from "@pages/utils/guoDT.ts";
import LightButton from "@comps/common/LightButton.tsx";
import {random, range} from "lodash";
import t from "@pages/i18n/t.tsx";
import collect from "collect.js";
import useBaseScoreConfig from "@views/magicScore/data/useBaseScoreConfig.ts";
import useGlobalSettings from "@pages/storage/globalSettings.ts";
import getRandomScoreID from "@views/magicScore/data/getRandomScoreID.ts";
import fifthOptions from "@views/magicScore/data/fifthOptions.ts";


const BaseConfigPanel = () => {
	const getCurrentTime = () => {
		return guoDT.getFormattedDayjs(guoDT.getDayjs(), "YYYY_MM_DD   HH:mm:ss")
	}


	const getRandomBpm = () => {
		return random(70, 126)
	}

	const getRandomFifth = (): number => {
		return collect(range(-7, 8)).random() as number
	}

	const inputWidth = 320
	const {fontFamily} = useGlobalSettings()
	const baseConfigPanel = useBaseScoreConfig()
	useEffect(() => {
		if (baseConfigPanel.left.length === 0) baseConfigPanel.setLeft(getRandomScoreID())
		if (baseConfigPanel.right.length === 0) baseConfigPanel.setRight(getCurrentTime())
	}, [])

	return <div css={topbar_css}>
		<div className="innerFrame">
			{/*======================================= title =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "乐谱标题", en: "Title"})}</span>
				<div className="r">
					<Input style={{width: inputWidth, marginRight: 15, fontFamily: fontFamily}} value={baseConfigPanel.title}
					       onChange={(e) => baseConfigPanel.setTitle(e.target.value)}/>
				</div>
			</div>
			{/*======================================= subtitle =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "副标题", en: "Subtitle"})}</span>
				<div className="r">
					<Input style={{width: inputWidth, marginRight: 15, fontFamily: fontFamily}} value={baseConfigPanel.subTitle}
					       onChange={(e) => baseConfigPanel.setSubtitle(e.target.value)}/>
				</div>
			</div>
			{/*======================================= left =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "左下角", en: "Left"})}</span>
				<div className="r">
					<Input style={{width: inputWidth, marginRight: 15, fontFamily: fontFamily, color: "black"}}
					       disabled={true}
					       value={baseConfigPanel.left}
					       onChange={(e) => baseConfigPanel.setLeft(e.target.value)}/>
					<LightButton width={100} onClick={() => baseConfigPanel.setLeft(getRandomScoreID())}>{t({
						cn: "随机",
						en: "Roll"
					})}</LightButton>
				</div>
			</div>
			{/*======================================= right =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "右下角", en: "Right"})}</span>
				<div className="r">
					<Input style={{width: inputWidth, marginRight: 15, fontFamily: fontFamily, color: "black"}}
					       value={baseConfigPanel.right}
					       disabled={true} onChange={(e) => baseConfigPanel.setRight(e.target.value)}/>
					<LightButton width={100} onClick={() => baseConfigPanel.setRight(getCurrentTime())}>{t({
						cn: "更新",
						en: "Update"
					})}</LightButton>
				</div>
			</div>
			{/*======================================= bpm =========================================*/}
			<div className="line">
				<span className="t">BPM</span>
				<div className="r">
					<InputNumber style={{width: 80, marginRight: 5}} value={baseConfigPanel.bpm}
					             disabled={baseConfigPanel.isLocked}
					             onChange={(e) => baseConfigPanel.setBpm(e)}/>
					<LightButton width={235} disabled={baseConfigPanel.isLocked}
					             onClick={() => baseConfigPanel.setBpm(getRandomBpm())}>
						{t({cn: "随机BPM", en: "Random BPM"})}
					</LightButton>
				</div>
			</div>
			{/*======================================= beat =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "拍号", en: "Beat"})}</span>
				<div className="r">
					<Radio.Group buttonStyle="solid" size="middle" value={baseConfigPanel.beat}
					             disabled={baseConfigPanel.isLocked}
					             onChange={(x) => baseConfigPanel.setBeat(x.target.value)}>
						<Radio.Button style={{width: 80}} value="4/4">4/4</Radio.Button>
						<Radio.Button style={{width: 80}} value="3/4">3/4</Radio.Button>
						<Radio.Button style={{width: 80}} value="6/8">6/8</Radio.Button>
						<Radio.Button style={{width: 80}} value="2/4">2/4</Radio.Button>
					</Radio.Group>
				</div>
			</div>
			{/*======================================= fifth =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "升降号", en: "Fifth"})}</span>
				<div className="r">
					<InputNumber style={{width: 80, marginRight: 5}} value={baseConfigPanel.fifth} max={7} min={-7}
					             disabled={baseConfigPanel.isLocked}
					             onChange={(e) => baseConfigPanel.setFifth(e)}/>
					<Select style={{width: 235, marginRight: 15}} allowClear={false} onSelect={(x) => baseConfigPanel.setFifth(x)}
					        disabled={baseConfigPanel.isLocked}
					        value={baseConfigPanel.fifth}
					        options={fifthOptions}/>
					<LightButton disabled={baseConfigPanel.isLocked} width={100}
					             onClick={() => baseConfigPanel.setFifth(getRandomFifth())}>
						{t({cn: "随机", en: "Roll"})}
					</LightButton>
				</div>
			</div>
			{/*======================================= mode =========================================*/}
			<div className="line">
				<span className="t">{t({cn: "调式", en: "Mode"})}</span>
				<div className="r">
					<Radio.Group buttonStyle="solid" size="middle" value={baseConfigPanel.mode}
					             onChange={(x) => baseConfigPanel.setMode(x.target.value)}>
						<Radio.Button style={{width: 160}} value="major">Major</Radio.Button>
						<Radio.Button style={{width: 160}} value="minor">Minor</Radio.Button>
					</Radio.Group>
				</div>
			</div>
		</div>

	</div>
}

const topbar_css = css({
	width: '100%',
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
		width: 650
	}, "& div.line>span.t": {
		// backgroundColor: "red",
		width: 80,
		display: "inline-block",
		textAlign: "right"
	}, "& div.line>div.r": {
		width: "calc(100% - 120px)",
		display: "inline-block",
		// backgroundColor:"green",
		textAlign: "left"
	},
	"& span.t": {
		marginRight: 10,
	}
})
export default BaseConfigPanel