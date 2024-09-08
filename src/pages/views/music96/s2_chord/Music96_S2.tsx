import ArticleFrame from "@comps/common/docs/ArticleFrame.tsx";
import ChordView from "@views/music96/s2_chord/slices/ChordView.tsx";
import {Note} from "@/music96/note";
import {Chord} from "@/music96/chord/cls/ChordClass.ts";

const Music96_S2 = () => {
	return <ArticleFrame>
		<ChordView/>
	</ArticleFrame>
}
export default Music96_S2