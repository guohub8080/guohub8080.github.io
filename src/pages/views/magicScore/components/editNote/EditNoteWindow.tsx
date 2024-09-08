/* eslint-disable */
import {css} from "@emotion/react";
import useBaseScoreConfig from "@views/magicScore/data/useBaseScoreConfig.ts";
import AddNoteTopBar from "@views/magicScore/components/editNote/AddNoteTopBar.tsx";


const EditNoteWindow = (props: {
	notesList: object[] | []
	partIndex: number
}) => {

	const baseConfigPanel = useBaseScoreConfig()


	return <div css={editNoteWindow_css}>
		<AddNoteTopBar partIndex={props.partIndex}/>
		你好

	</div>
}


export default EditNoteWindow

const editNoteWindow_css = css({
	width: "100%",
})