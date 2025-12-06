/* eslint-disable no-mixed-spaces-and-tabs */
import TranscodeNaviBar from "./comps/TranscodeNaviBar.tsx";
import Base64Page from "./parts/Base64Page.tsx";
import DecodeRsa from "./parts/DecodeRsa.tsx";
import EncodeRsa from "./parts/EncodeRsa.tsx";
import GenRsa from "./parts/GenRsa.tsx";
import useTranscodeConfig from "./store/useTranscodeConfig.ts";
import {useMemo} from "react";
import {Toaster} from "react-hot-toast";

const Transcode = (props: {}) => {
	const {transcodeMode} = useTranscodeConfig()
	const instance = useMemo(() => {
		if (transcodeMode === "gen_rsa") {
			return <GenRsa/>
		} else if (transcodeMode === "encode_rsa") {
			return <EncodeRsa/>
		} else if (transcodeMode === "decode_rsa") {
			return <DecodeRsa/>
		} else return <Base64Page/>
	}, [transcodeMode])
    return <>
        <Toaster/>
        <div className="w-full">
            <TranscodeNaviBar/>
            {instance}
        </div>
    </>
}

export default Transcode
