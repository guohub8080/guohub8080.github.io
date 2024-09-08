/* eslint-disable no-mixed-spaces-and-tabs */
// noinspection ES6PreferShortImport

import {css} from "@emotion/react";
import googleColors from "@assets/styles/googleColors.ts";
import cssPresets from "@assets/styles/cssPresets.ts";
import {Button, Drawer, Modal, Space} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined, EditOutlined} from "@ant-design/icons";
import {PiMusicNotesSimpleBold} from "react-icons/pi";
import t from "@pages/i18n/t.tsx";
import React, {useState} from "react";
import useScorePart from "@views/magicScore/data/useScorePart.ts";
import ModifyScorePartPanel from "@views/magicScore/components/modals/ModifyScorePartPanel.tsx";
import {t_scorePartObj} from "@views/magicScore/data/types.ts";
import EditNoteWindow from "@views/magicScore/components/editNote/EditNoteWindow.tsx";

const PartBar = (props: {
	item: t_scorePartObj
	order: number
	totalLength: number
	movePart: (needMoveIndex: number, isForwardDirection: boolean) => void
}) => {
	const scorePart = useScorePart()

	const [isPartConfigOpen, setIsPartConfigOpen] = useState(false);
	const [isMusicNotesEditOpen, setIsMusicNotesEditOpen] = useState(false);
	const updateNewPartConfigs = (i) => {
		scorePart.updatePartMeta(i, props.order)
		setIsPartConfigOpen(false)
	}
	const onCancel = () => {
		setIsPartConfigOpen(false)
	}
	const switchOpen = () => setIsPartConfigOpen(!isPartConfigOpen)
	return <>
		<div css={partBar_css}>
			{/* ============================= show base info =============================*/}
			<div className="order">{props.order + 1}</div>
			<div className="part_name">{props.item.partMeta.partName}</div>
			<div className="clef">{props.item.partMeta.clef}</div>
			<div className="midi_port">
				<span style={{color: googleColors.yellow100, marginRight: 15}}>MIDI</span>
				<span style={{color: googleColors.red600}}>
							{props.item.partMeta.midiChannel}
			</span>
			</div>
			<Space style={{marginLeft: 150}}>
				{/* ========================= move up =============================== */}
				<Button type="primary" disabled={props.order === 0}
				        onClick={() => props.movePart(props.order, true)}
				        icon={<ArrowUpOutlined/>}
				/>
				{/* ========================= move down =============================== */}
				<Button type="primary" disabled={props.totalLength === props.order + 1}
				        onClick={() => props.movePart(props.order, false)}
				        icon={<ArrowDownOutlined/>}/>
				{/* ========================= edit partObj =============================== */}
				<Button type="primary" onClick={switchOpen}
				        icon={<EditOutlined/>}/>
				{/* ========================= edit score notes =============================== */}
				<Button type="primary" onClick={() => setIsMusicNotesEditOpen(true)}
				        icon={<PiMusicNotesSimpleBold/>}/>
			</Space>
		</div>
		{/* ============================== Modify Part =================================== */}
		<Modal title={t({cn: "修改音轨", en: "Modify Part"})} open={isPartConfigOpen}
		       width={650} closeIcon={null} footer={null}>
			<ModifyScorePartPanel onOK={updateNewPartConfigs}
			                      partMetaObj={scorePart.partList[props.order].partMeta}
			                      onCancel={onCancel}
			                      switchOpen={setIsPartConfigOpen}/>
		</Modal>
		{/* ============================== add note =================================== */}
		<Drawer title={t({
			cn: "编辑音符",
			en: "Edit Notes"
		}) + ` - Part ${props.order + 1} - ${scorePart.partList[props.order].partMeta.partName}`}
		        placement="bottom"
		        height={"calc(100vh)"}
		        styles={{body:{padding:0}}}
		        onClose={() => setIsMusicNotesEditOpen(false)}
		        open={isMusicNotesEditOpen}>
			<EditNoteWindow notesList={props.item.notesList} partIndex={props.order}/>
		</Drawer>

	</>

}

export default PartBar


const partBar_css = css({
	width: "100%",
	backgroundColor: googleColors.blueGray100,
	paddingTop: 10,
	paddingBottom: 10,
	borderBottomColor: googleColors.gray400,
	borderBottomWidth: 1,
	borderBottomStyle: "solid",
	...cssPresets.flexCenter,
	gap: 5,
	"&>div.order": {
		width: 25,
		height: 25,
		...cssPresets.flexCenter,
		backgroundColor: googleColors.red400,
		color: "white",
		borderRadius: 5
	}, "&>div.part_name": {
		width: 140,
		height: 25,
		...cssPresets.flexCenter,
		backgroundColor: googleColors.blue400,
		color: "white",
		borderRadius: 5
	}, "&>div.clef": {
		width: 25,
		height: 25,
		...cssPresets.flexCenter,
		backgroundColor: googleColors.green400,
		color: "white",
		borderRadius: 5
	}, "&>div.midi_port": {
		width: 90,
		height: 25,
		...cssPresets.flexCenter,
		backgroundColor: googleColors.orange400,
		color: "white",
		borderRadius: 5
	},

})