/* eslint-disable no-mixed-spaces-and-tabs */
// noinspection ES6PreferShortImport

import BaseConfigPanel from "./components/modals/BaseConfigPanel.tsx";
import ScorePage from "./components/ScorePage.tsx";
import genScore from "@/music96/score/methods/xml/genScore.ts";
import genMeta from "@/music96/score/methods/xml/genMeta.ts";
import GenScore from "@/music96/score/methods/xml/genScore.ts";
import genOneInstrumentPart from "@/music96/score/methods/xml/genOneInstrumentPart.ts";
import genBaseAttributes from "@/music96/score/methods/xml/genBaseAttributes.ts";
import genNote from "@/music96/score/methods/xml/genNote.ts";
import genBarLine from "@/music96/score/methods/xml/genBarLine.ts";
import {ScoreNote} from "@/music96/score/cls/ScoreNoteClass.ts";
import noteScoreTypeValues from "@/music96/score/static/noteScoreTypeValues.ts";
import {ScoreMeta} from "@/music96/score/cls/ScoreMetaClass.ts";
import TopBar from "@views/magicScore/components/TopBar.tsx";
import useScoreJSON from "@views/magicScore/data/useScorePart.ts";
import t from "@pages/i18n/t.tsx";
import {css} from "@emotion/react";
import googleColors from "@assets/styles/googleColors.ts";
import cssPresets from "@assets/styles/cssPresets.ts";
import PartBar from "@views/magicScore/components/PartBar.tsx";
import {Button} from "antd";
import useForceRender from "@views/magicScore/data/useForceRender.ts";
import {useEffect, useState} from "react";

const MagicScore = () => {
	// console.log("meta:",genMeta({title:"mo人",subTitle:"调式"}))
	// console.log(genOneInstrumentPart({partID:"P1",partName:"NAME"}))
	// console.log(genBaseAttributes({
	//   divisions:1
	// }))
	// console.log(genNote({
	//   type:"half",
	//   duration:4,
	//   isRest:true,
	//   step:"G",
	//   lyrics:["nihao","aa"],
	//   isTieStarted:true
	// }))
	const a = new ScoreNote(1, "note", noteScoreTypeValues.quarter)
	a.step = "C"
	a.alter = 1
	a.octave = 4
	a.tie.isTied = true
	a.tie.tieType = ["start", "stop"]
	a.chord.isChord = true
	// a.triplet.isTriplet=true
	a.lyrics = ["nihao", "赛丹"]
	// console.log(a.xml)
	const scoreJSON = useScoreJSON()
	const [partList, setPartList] = useState(scoreJSON.partList)
	const forceRender = useForceRender()
	useEffect(() => {
		setPartList(scoreJSON.partList)
	}, [forceRender.num, scoreJSON.partList.length])

	const b = new ScoreMeta("nihao")
	// console.log(b.xml)
	return <div>
		<TopBar/>
		<div style={{display: scoreJSON.partList.length === 0 ? "flex" : "none", width: "100%"}} css={nonePart_css}>
			{t({cn: "无音轨", en: "No Any Part"})}
		</div>
		<div style={{display: scoreJSON.partList.length > 0 ? "initial" : "none", width: "100%"}}>
			{partList.map((item, index) => {
				return <PartBar key={index} item={item}
				                movePart={scoreJSON.movePart}
				                order={index} totalLength={scoreJSON.partList.length}/>
			})}
		</div>
		{/*<ScorePage/>*/}
		<Button onClick={() => console.log(scoreJSON)}>获取SCORE JSON</Button>
	</div>
}

export default MagicScore

const nonePart_css = css({
	backgroundColor: googleColors.gray400,
	height: 150,
	...cssPresets.flexCenter,
	color: googleColors.gray50
})