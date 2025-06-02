import {useEffect, useState} from 'react'
import {css} from '@emotion/react'
import {Await, Outlet, useNavigate} from 'react-router-dom'
import RotateCube from "../../components/RotateCube/index.jsx";
import styles from "./styles.js"
import snowCss from "./snow.module.css"

const isScreenWiderThan16_9 = (w, h) => {
	const ratio = 16 / 9
	return Boolean(w / h > ratio)
}
/**
 * @param props
 * 里面需要传入两个参数：
 * @param props.maskTransparency 遮罩的透明度  1表示全遮  0表示全透明
 * @param props.picSrc 图片的URL地址
 * @returns {JSX.Element}
 */
export default (props) => {
	// const homeStore = useHomeStore()
	// const windowSize = useWindowSize()
	// const bgPicSize = isScreenWiderThan16_9(windowSize.width, windowSize.height) ? {
	//     h: "auto", w: `${windowSize.width}px`
	// } : {w: "auto", h: `${windowSize.height}px`}
	// console.log(bgPicSize)
	return (<>
		{/*<RotateCube/>*/}
		<div css={styles.bgFrame}>
			
			<div css={styles.bgPicFrame}>
				<div className={snowCss.bgFrame}>
				</div>
			</div>
			<div css={styles.mask(props?.maskTransparency)}/>
		</div>
	
	
	</>)
}

