/* eslint-disable no-mixed-spaces-and-tabs */
import useChord from "@/apps/ChordDisplay/useChord.ts";
import useChordConfig from "@/assets/stores/useChordConfig.ts";
import {css} from "@emotion/react";
import {clamp} from "lodash";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import byDefault from "@/utils/byDefault.ts";
import {OpenSheetMusicDisplay} from "opensheetmusicdisplay";
import {create} from "xmlbuilder2";
import cssPresets from "@/assets/styles/cssPresets.ts";


// 生成和弦音符的核心函数
const generateChordNotes = (notes) => {
	return notes.map((note, index) => ({
		// 强制创建同级note元素
		_attr: { /* 保留位置用于未来属性扩展 */},
		...(index > 0 && {chord: {_attr: {}}}), // 修正1：使用对象结构
		pitch: {
			step: note.step,
			...(note.alter != null && {alter: note.alter}),
			octave: note.octave
		},
		duration: 4, // 强制统一时值
		type: "quarter",
	}));
};

const StaveWithChord = (props: {
	keys?: number
	clef?: string
	w?: number
	h?: number
}) => {
	const {
		n1_step, n1_alter, n1_octave,
		n2_step, n2_alter, n2_octave,
		n3_step, n3_alter, n3_octave,
		n4_step, n4_alter, n4_octave,
		n5_step, n5_alter, n5_octave,
		n6_step, n6_alter, n6_octave,
		n7_step, n7_alter, n7_octave,
	} = useChordConfig()
	const {chord, chordVoicing} = useChord()
	const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
	// 根据props来确定有几个升降号
	const keys = byDefault(props.keys, 0)
	const w = byDefault(props.w, 450)
	const h = byDefault(props.h, 180)
	// 谱表（高音、低音）
	const clef = useMemo(() => {
		const propsClef = byDefault(props.clef, "C").toUpperCase().trim()
		switch (propsClef) {
			case "C":
				return {sign: "C", line: 3}
			case "M":
				return {sign: "C", line: 3}
			case "F":
				return {sign: "F", line: 4}
			case "B":
				return {sign: "F", line: 4}
			default:
				return {sign: "G", line: 2}
		}
	}, [props.clef])

	// 用于引用画布的DOM元素
	const divRef = useRef<HTMLDivElement>(null);
	const notes = useMemo(() => generateChordNotes(chordVoicing), [chordVoicing])
	// 组成 MusicXML 字符串的动态函数
	const musicXML = useMemo(() => {
		const musicXMLObject = {
			'score-partwise': {
				'@version': '3.1',
				'part-list': {
					'score-part': {
						'@id': 'P1',
						'part-name': null  // 生成自闭合标签 <part-name/>
					}
				},
				'part': {
					'@id': 'P1',
					'measure': {
						'@number': '1',
						'attributes': {
							'divisions': '1',
							'key': {
								'fifths': keys,
							},
							clef,
						},
						'note': notes
					}
				}
			}
		};
		return create({version: '1.0', encoding: 'UTF-8'}, musicXMLObject)
			.end({prettyPrint: true});
	}, [chordVoicing, clef, keys, notes])// 确保依赖于 props.notesList
	const FixedMeasureWidthFixedValue = useMemo(() => clamp(chordVoicing.length * 1.5, 3, 7), [chordVoicing])
	// 渲染函数
	const renderRef = useCallback(async () => {
		const container = divRef.current;
		if (!container) return;
		if (osmdRef.current) {
			osmdRef.current.clear()
			osmdRef.current.EngravingRules.FixedMeasureWidthFixedValue = FixedMeasureWidthFixedValue;
		}
		// 如果实例不存在则创建
		if (!osmdRef.current) {
			osmdRef.current = new OpenSheetMusicDisplay(container, {
				autoResize: true,
				drawTitle: false,
				drawComposer: false,
				drawCredits: false,
				drawMetronomeMarks: false,
				drawPartNames: false,
				drawSubtitle: false,
				drawTimeSignatures: false,
				drawLyricist: false,
				renderSingleHorizontalStaffline: true,

			});
			// 配置 EngravingRules
			const rules = osmdRef.current.EngravingRules;
			rules.PageTopMargin = 1;
			rules.PageBottomMargin = 1;
			rules.PageLeftMargin = 2;
			rules.PageRightMargin = 2;
			rules.FixedMeasureWidth = true
			rules.MeasureRightMargin = 0
			osmdRef.current.EngravingRules.FixedMeasureWidthFixedValue = FixedMeasureWidthFixedValue
		}
		// 更新 MusicXML
		await osmdRef.current.load(musicXML);
		osmdRef.current.render();
	}, [musicXML, props, keys, chordVoicing, FixedMeasureWidthFixedValue])

	useEffect(() => {
		renderRef().then()
	}, [renderRef, keys, clef, n1_step, n1_alter, n1_octave,
		n2_step, n2_alter, n2_octave,
		n3_step, n3_alter, n3_octave,
		n4_step, n4_alter, n4_octave,
		n5_step, n5_alter, n5_octave,
		n6_step, n6_alter, n6_octave,
		n7_step, n7_alter, n7_octave, chordVoicing, FixedMeasureWidthFixedValue]) // 确保依赖于 renderRef 和 props.notesList

	// 实际DOM结构
	return <>
		<div css={StaveWindow_css(w, h)}>
			<div className="frame">
				<div ref={divRef} className="svg_frame"/>
			</div>
		</div>
	</>
}

export default StaveWithChord

const StaveWindow_css = (w: number, h: number) => css({
	marginTop: 20,
	cursor: "pointer",
	userSelect: "none",
	marginLeft: "auto",
	marginRight: "auto",
	pointerEvents: "none",
	...cssPresets.flexCenter,

	"& .frame": {
		marginLeft: "auto",
		marginRight: "auto",
		backgroundColor: "white",
		width: w,
		minWidth: 320,
		maxWidth: 400,
		borderRadius: 8,
		overflow: "hidden",
		userSelect: "none",
		height: h,
		...cssPresets.flexCenter,
		"& .svg_frame": {
			width: "100%",
			transform: "scale(1.5)",
		}
	}
})
