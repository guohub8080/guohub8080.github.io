import { CSSProperties, useEffect, useState } from 'react'
import right from "./right.svg"
import front from "./front.svg"
import top from "./top.svg"

export default function RotateCube() {
    const [rotation, setRotation] = useState({rotateX: -25, rotateY: -30, rotateZ: 0})

    useEffect(() => {
        let targetX = -35 + Math.random() * 20  // -35 到 -15
        let targetY = -30 - Math.random() * 45
        let animationId
        let intervalId
        
        // 随机生成新目标角度
        const generateNewTarget = () => {
            targetX = -35 + Math.random() * 20  // -35 到 -15
            targetY = -30 - Math.random() * 45
            
            // 下次随机时间（0.5-1.5秒）后再次切换
            const nextDelay = 500 + Math.random() * 1000
            setTimeout(generateNewTarget, nextDelay)
        }
        
        // 动画循环
        const animate = () => {
            setRotation(prev => {
                const newX = prev.rotateX + (targetX - prev.rotateX) * 0.08
                const newY = prev.rotateY + (targetY - prev.rotateY) * 0.08
                
                return {
                    rotateX: newX,
                    rotateY: newY,
                    rotateZ: 0
                }
            })
            
            animationId = requestAnimationFrame(animate)
        }
        
        // 启动动画和随机切换
        animationId = requestAnimationFrame(animate)
        const initialDelay = 500 + Math.random() * 1000
        setTimeout(generateNewTarget, initialDelay)
        
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [])

    const boxContainerStyle:CSSProperties = {
        width: '100%',
        height: '200px',
        marginBottom: '40px',
        perspective: '1500px',
        perspectiveOrigin: 'center center',
        userSelect: 'none',
        transform: 'scale(0.5)',
        zIndex: 10,
        position: 'relative',
        filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.25))'
    }

    const boxWrapperStyle:CSSProperties = {
        width: '200px',
        height: '180px',
        paddingTop: '100px',
        margin: 'auto',
        userSelect: 'none',
        zIndex: 0,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg) rotateZ(0deg)`
    }

    const cubeFaceStyle:CSSProperties = {
        width: '200px',
        height: '200px',
        userSelect: 'none',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transformOrigin: 'bottom',
        color: 'var(--color-foreground)',
        opacity: 1
    }

    return (
        <div style={boxContainerStyle}>
            <div style={boxWrapperStyle}>
                <div style={{...cubeFaceStyle, transform: 'translateZ(100px)'}}>
                    <img src={front} style={{width: "100%", height: "100%"}} alt=""/>
                </div>
                <div style={{...cubeFaceStyle, transform: 'translateZ(-100px)', backgroundColor: 'var(--color-primary)'}}>Back</div>
                <div style={{...cubeFaceStyle, backgroundColor: 'var(--color-primary)', transform: 'translateX(-100px) rotateY(90deg)'}}>Left</div>
                <div style={{...cubeFaceStyle, transform: 'rotateY(-270deg) translateX(100px)', transformOrigin: 'top right'}}>
                    <img src={right} style={{width: "100%", height: "100%"}} alt=""/>
                </div>
                <div style={{...cubeFaceStyle, transform: 'rotateX(-270deg) translateY(-100px)', transformOrigin: 'top center'}}>
                    <img src={top} style={{width: "100%", height: "100%"}} alt=""/>
                </div>
                <div style={{...cubeFaceStyle, background: 'var(--color-primary)', transform: 'translateZ(100px) rotateX(90deg)', boxShadow: '0 0px 25px rgba(0, 0, 0, 0.5)'}}>bottom</div>
            </div>
        </div>
    )
}

