import { genAnimateTranslate } from "../../../PubUtils/genSvgAnimateTransform/genAnimateTranslate/core.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * AnyPushLoop - 多图循环"推入"切换组件（原 AnyMove/AnySlide Loop）
 */
const AnyPushLoop = (props: {
    viewBoxW: number
    viewBoxH: number
    pics: {
        url: string
        direction: "L" | "R" | "T" | "B"
        switchDuration: number
        stayDuration: number
        keySplines: string
    }[]
}) => {
    const { viewBoxW, viewBoxH } = props;

    const getTotalCycleDuration = () => props.pics.reduce((sum, pic) => sum + pic.switchDuration + pic.stayDuration, 0);

    const getDelayTimeByIndex = (index: number) => {
        const currentPic = props.pics[index];
        if (index === 0) return -currentPic.switchDuration;
        let delay = props.pics[0].stayDuration;
        for (let i = 1; i < index; i++) delay += props.pics[i].switchDuration + props.pics[i].stayDuration;
        return delay;
    };

    const getInitValueByDirection = (direction: "L" | "R" | "T" | "B") => {
        switch (direction) {
            case "L": return { x: viewBoxW, y: 0 };
            case "R": return { x: -viewBoxW, y: 0 };
            case "T": return { x: 0, y: viewBoxH };
            case "B": return { x: 0, y: -viewBoxH };
        }
    };

    const getHoldTimeByIndex = (index: number) => {
        const currentPic = props.pics[index];
        const nextPic = getNextPicByIndex(index);
        return getTotalCycleDuration() - currentPic.switchDuration - currentPic.stayDuration - nextPic.switchDuration;
    };

    const getTranslateValueByDirection = (direction: "L" | "R" | "T" | "B") => {
        switch (direction) {
            case "L": return { x: -viewBoxW, y: 0 };
            case "R": return { x: viewBoxW, y: 0 };
            case "T": return { x: 0, y: -viewBoxH };
            case "B": return { x: 0, y: viewBoxH };
        }
    };

    const getNextPicByIndex = (index: number) => props.pics[(index + 1) % props.pics.length];

    const getTimeLineByIndex = (picIndex: number) => {
        const currentPic = props.pics[picIndex];
        const nextPic = getNextPicByIndex(picIndex);
        const entryValue = getTranslateValueByDirection(currentPic.direction);
        const exitValue = getTranslateValueByDirection(nextPic.direction);
        return [
            { toValue: entryValue, timeSpanSec: currentPic.switchDuration, keySplines: currentPic.keySplines },
            { toValue: { x: 0, y: 0 }, timeSpanSec: currentPic.stayDuration },
            { toValue: exitValue, timeSpanSec: nextPic.switchDuration, keySplines: nextPic.keySplines },
            { toValue: { x: 0, y: 0 }, timeSpanSec: getHoldTimeByIndex(picIndex) }
        ];
    };

    return (
        <>
            {props.pics.map((pic, index) => {
                const timeline = getTimeLineByIndex(index);
                const delay = getDelayTimeByIndex(index);
                const initPos = getInitValueByDirection(pic.direction);
                return (
                    <g key={index}>
                        <foreignObject x={initPos.x} y={initPos.y} width={viewBoxW} height={viewBoxH}>
                            <SvgEx
                                style={{
                                    display: "block",
                                    backgroundImage: svgURL(pic.url),
                                    backgroundSize: "100% auto",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                }}
                                viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                                width="100%"
                            />
                        </foreignObject>
                        {genAnimateTranslate({
                            initValue: { x: 0, y: 0 },
                            timeline,
                            loopCount: 0,
                            delay,
                            freeze: true,
                            additive: true,
                            isRelativeMove: true
                        })}
                    </g>
                );
            })}
        </>
    );
};

export default AnyPushLoop;


