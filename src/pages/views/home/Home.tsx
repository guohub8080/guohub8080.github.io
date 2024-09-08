import {css} from "@emotion/react";
import t from "@pages/i18n/t.tsx"
import ShortCode from "@comps/common/docs/ShortCode.tsx";
import P from "@comps/common/docs/P.tsx";
import H1 from "@comps/common/docs/H1.tsx";

const Home = () => {
	return <div css={homeBg_css}>

		<H1>Music96</H1>
		<P><ShortCode>Music96</ShortCode>
			{t({
				cn: "是一个使用JavaScript编辑的乐理模块。",
				en: " is an module of JavaScript."
			})}</P>
	</div>
}

export default Home

const homeBg_css = css({
	maxWidth: 650,
	display: "block",
	textAlign: "justify",
	margin: "0 auto",
	backgroundColor: "white",
	padding: 10,
	"& p": {
		textAlign: "justify",
		lineHeight: 1.7,
	}
})