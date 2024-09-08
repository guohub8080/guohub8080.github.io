import ArticleFrame from "@comps/common/docs/ArticleFrame.tsx";
import NoteView from "@views/music96/s1_interval_and_note/slices/NoteView.tsx";
import NoteInstanceView1 from "@views/music96/s1_interval_and_note/slices/NoteInstanceView1.tsx";
import IntervalView from "@views/music96/s1_interval_and_note/slices/IntervalView.tsx";
import IntervalInstanceView1 from "@views/music96/s1_interval_and_note/slices/IntervalInstanceView1.tsx";
import NoteInstanceView2 from "@views/music96/s1_interval_and_note/slices/NoteInstanceView2.tsx";
import NoteInstanceView3 from "@views/music96/s1_interval_and_note/slices/NoteInstanceView3.tsx";
import NoteInstanceView4 from "@views/music96/s1_interval_and_note/slices/NoteInstanceView4.tsx";
import NoteIntervalMethods1 from "@views/music96/s1_interval_and_note/slices/NoteIntervalMethods1.tsx";
import NoteIntervalMethods2 from "@views/music96/s1_interval_and_note/slices/NoteIntervalMethods2.tsx";
import NoteIntervalMethods3 from "@views/music96/s1_interval_and_note/slices/NoteIntervalMethods3.tsx";
import NoteIntervalMethods4 from "@views/music96/s1_interval_and_note/slices/NoteIntervalMethods4.tsx";
import NoteIntervalMethods5 from "@views/music96/s1_interval_and_note/slices/NoteIntervalMethods5.tsx";

const Music96_S1=()=>{
    return <ArticleFrame>
        <IntervalView/>
        <IntervalInstanceView1/>
        <NoteView/>
        <NoteInstanceView1/>
        <NoteInstanceView2/>
        <NoteInstanceView3/>
        <NoteInstanceView4/>
        <NoteIntervalMethods1/>
        <NoteIntervalMethods2/>
        <NoteIntervalMethods3/>
        <NoteIntervalMethods4/>
        <NoteIntervalMethods5/>
    </ArticleFrame>
}
export default Music96_S1