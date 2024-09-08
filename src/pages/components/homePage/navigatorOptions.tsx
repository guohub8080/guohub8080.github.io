import t from "@pages/i18n/t.tsx";

const options = (givenRouter: string) => {
	switch (givenRouter) {
		case "/home":
			return t({cn: "首页和关于作者", en: "Home & About"})
		case "/music96/intro":
			return t({cn: "music96.js 简介", en: "music96.js intro"})
		case "/music96/interval_and_note":
			return t({cn: "音程与音符", en: "interval and note"})
		case "/music96/chord":
			return t({cn: "和弦", en: "chord"})
		case "/music96/scale":
			return t({cn: "调式", en: "mode"})
		case "/usemidi":
			return t({cn: "useMIDI Hook", en: "useMIDI Hook"})
		case "/interval":
			return t({cn: "音程计算", en: "Interval Calculator"})
		case "/score":
			return t({cn: "乐谱工具", en: "Score"})
	}
}
export default options