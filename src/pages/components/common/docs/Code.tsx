import {ReactHTMLElement, ReactNode, useEffect, useRef, useState} from "react";
import hljs from 'highlight.js/lib/core';
import "highlight.js/styles/arduino-light.css"
import javascript from 'highlight.js/lib/languages/javascript';
import googleColors from "@assets/styles/googleColors.ts";

const Code = (props: {
	children: ReactNode,
	lang?: string
}) => {
	const [h, setH] = useState(false)
	hljs.registerLanguage('javascript', javascript);
	const ref = useRef(null)
	const lang = props.lang || "javascript"
	// useEffect(() => {
	// 	hljs.configure({ignoreUnescapedHTML: true})
	//
	// 	const codes = document.querySelectorAll("pre code")
	// 	codes.forEach((el) => {
	// 		hljs.highlightElement(el as HTMLElement)
	// 	})
	// 	hljs.highlightAll()
	// }, [props.children])
	return (
		<pre ref={ref} style={{
			textAlign: "left",
			marginBottom:10,
			marginTop:10
			// paddingLeft: 20,
			// paddingRight: 20,
			// borderRadius: 10,
			// backgroundColor: googleColors.gray500
		}}>
		<code style={{backgroundColor: googleColors.gray100, textAlign: "left", borderRadius: 10,fontFamily:"consolas"}}>
		{props.children}
		</code>
	</pre>
	);
}

export default Code
