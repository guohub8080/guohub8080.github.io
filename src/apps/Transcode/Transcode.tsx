/* eslint-disable no-mixed-spaces-and-tabs */
import TranscodeNaviBar from "@/apps/Transcode/comps/TranscodeNaviBar.tsx";
import Base64Page from "@/apps/Transcode/parts/Base64Page.tsx";
import DecodeRsa from "@/apps/Transcode/parts/DecodeRsa.tsx";
import EncodeRsa from "@/apps/Transcode/parts/EncodeRsa.tsx";
import GenRsa from "@/apps/Transcode/parts/GenRsa.tsx";
import googleColors from "@/assets/colors/googleColors.ts";
import useTranscodeConfig from "@/assets/stores/useTranscodeConfig.ts";
import {css} from "@emotion/react";
import {ConfigProvider} from "antd";
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
		<ConfigProvider wave={{disabled: true}} theme={{
			token: {
				colorPrimary: googleColors.blue800,
			},
			components: {
				Button: {
				}
			}
		}}>
			<Toaster/>
			<div css={Transcode_css}>
				<TranscodeNaviBar/>
				{instance}
			</div>
		</ConfigProvider>
	</>
}

export default Transcode

const Transcode_css = css({})
