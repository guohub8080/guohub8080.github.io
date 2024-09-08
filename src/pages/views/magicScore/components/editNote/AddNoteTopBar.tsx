/* eslint-disable no-mixed-spaces-and-tabs */
import SectionF from "@comps/frames/SectionF.tsx";
import {css} from "@emotion/react";
import googleColors from "@assets/styles/googleColors.ts";
import {Select} from "antd";
import useAddNoteBar from "@views/magicScore/data/useAddNoteBar.ts";
import rootNoteOptions from "@views/magicScore/data/rootNoteOptions.ts";
import {useEffect, useState} from "react";
import t from "@pages/i18n/t.tsx";
import {Scale} from "@/music96/scale/cls/ScaleClass.ts";
import {Note} from "@/music96/note";
import cssPresets from "@assets/styles/cssPresets.ts";

const dealAlter = (alterValue: number) => {
	if (alterValue === 0) return ""
	if (alterValue === 1) return "♯"
	if (alterValue === -1) return "♭"
	return ""
}
const AddNoteTopBar = (props: {
	partIndex: number
}) => {
	const addNoteBar = useAddNoteBar()
	const [rootNoteStepAlter, setRootNoteStepAlter] = useState(["C", 0])
	const onSelectMode = (x: string) => {
		if (x === "FREE") addNoteBar.setIsFreeMode(true)
		else {
			addNoteBar.setIsFreeMode(false);
			addNoteBar.setMode(x as string)
		}
	}
	const [scaleNotes, setScaleNotes] = useState<Scale>(new Scale(new Note(rootNoteStepAlter[0] as any,
		rootNoteStepAlter[1] as any, addNoteBar.rootNoteOctave), addNoteBar.mode as any))
	useEffect(() => {
		if (addNoteBar.isFreeMode) {
			setScaleNotes(new Scale(new Note(rootNoteStepAlter[0] as any,
				rootNoteStepAlter[1] as any, addNoteBar.rootNoteOctave), "MAJ"))
		} else {
			setScaleNotes(new Scale(new Note(rootNoteStepAlter[0] as any,
				rootNoteStepAlter[1] as any, addNoteBar.rootNoteOctave), addNoteBar.mode as any))
		}

	}, [rootNoteStepAlter, addNoteBar.rootNoteOctave, addNoteBar.mode])
	return <div css={topBar_css}>
		<div>
			<span style={{marginRight: 10}}>{t({cn: "主音", en: "R Note"})}</span>
			<Select style={{width: 80}} allowClear={false} onSelect={(x) => setRootNoteStepAlter(x as any)}
			        size="middle"
			        labelRender={() => `${rootNoteStepAlter[0]}${dealAlter(rootNoteStepAlter[1] as any)}`}
			        value={rootNoteStepAlter}
			        options={rootNoteOptions}/>
			<span style={{marginRight: 10, marginLeft: 25}}>{t({cn: "八度", en: "Octave"})}</span>
			<Select style={{width: 60}} allowClear={false} onSelect={(x) => addNoteBar.setRootNote({octave: x})}
			        size="middle"
			        value={addNoteBar.rootNoteOctave}
			        options={[{value: 1, label: 1}, {value: 2, label: 2}, {value: 3, label: 3}, {value: 4, label: 4}, {
				        value: 5,
				        label: 5
			        }, {value: 6, label: 6}, {value: 7, label: 7},]}/>
			<span style={{marginRight: 10, marginLeft: 25}}>{t({cn: "音阶", en: "Mode"})}</span>
			<Select style={{width: 180}} allowClear={false} onSelect={x => onSelectMode(x)}
			        size="middle"
			        value={addNoteBar.mode}
			        options={[{value: "MAJ", label: "Major"}, {value: "MIN", label: "Minor"}, {value: "FREE", label: "/"},]}/>
		</div>
		<div style={{paddingTop: 5, paddingBottom: 5, color: googleColors.gray800, height: 50, ...cssPresets.flexCenter}}>
			<div>
				{scaleNotes.notesList.map((x, y) => <span key={y}>
				<span style={{
					display: "inline-block",
					width: "fit-content",
					fontSize: 20,
					color: googleColors.orange800
				}}>{y + 1}</span>
				<span style={{
					display: "inline-block",
					width: "fit-content",
					marginRight: 40,
					fontSize: 20,
					textAlign: "left",
					color: googleColors.blue800
				}}>{x.artName}</span>
			</span>)}
			</div>

		</div>

	</div>
}

export default AddNoteTopBar

const topBar_css = css({
	width: "100%",
	backgroundColor: googleColors.blueGray100,
	paddingTop: 5,
	paddingBottom: 5
})