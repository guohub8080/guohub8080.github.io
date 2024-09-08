import H1 from "@comps/common/docs/H1.tsx";
import P from "@comps/common/docs/P.tsx";
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import t from "@pages/i18n/t.tsx";
import Code from "@comps/common/docs/Code.tsx";
import ArticleFrame from "@comps/common/docs/ArticleFrame.tsx";

const Intro_Music96 = () => {

	return <ArticleFrame>
		<H1 isTop={true}>{t({cn: "概述", en: "Overview"})}</H1>
		<P><ShortCode>Music96</ShortCode>
			{t({
				cn: "是一个JavaScript乐理库，拥有计算音程、音阶、和弦、五度圈等功能。推荐使用ES6语法。",
				en: " is a music library composed in JavaScript, providing functions for calculating intervals, scales, chords, circle of fifths, etc. ES6 syntax is recommend."
			})}</P>
		<P key={"music962"}>
			{t({
				cnG: ["使用方式：下载软件库，然后将",
					<ShortCode>src/music96</ShortCode>, "文件夹拷贝至项目文件。然后就可以在项目文件中引入了。"],
				enG: ["Instructions: Simply download the library, then copy the ",
					<ShortCode>src/music96</ShortCode>, " folder to your project. Then you can import the library to your project."]
			})}</P>
		<Code>{
			`import music96 from "./music96"`
		}</Code>
	</ArticleFrame>
}

export default Intro_Music96
