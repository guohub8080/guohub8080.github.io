import {useEffect, useState} from 'react'
import {css} from '@emotion/react'
import {Await, Outlet, useNavigate} from 'react-router-dom'
import cube from "./cube.module.css"
import right from "./right.svg"
import front from "./front.svg"
import top from "./top.svg"

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
    return (<>
        <div className={cube.boxContainer}>
            <div className={cube.boxWrapper}>
                <div className={`${cube.cubeFace} ${cube.cubeFront}`}>
                    <img src={front}
                         style={{width: "100%", height: "100%"}} alt=""/>
                </div>
                <div className={`${cube.cubeFace} ${cube.cubeBack}`}>Back</div>
                <div className={`${cube.cubeFace} ${cube.cubeLeft}`}>Left</div>
                <div className={`${cube.cubeFace} ${cube.cubeRight}`}>
                    <img src={right} style={{width: "100%", height: "100%"}} alt=""/>
                </div>
                <div className={`${cube.cubeFace} ${cube.cubeTop}`}>
                    <img src={top} style={{width: "100%", height: "100%"}} alt=""/>
                </div>
                <div className={`${cube.cubeFace} ${cube.cubeBottom}`}>bottom</div>
            </div>
        </div>


    </>)
}

