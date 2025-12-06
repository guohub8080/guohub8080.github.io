import infos from "@/apps/Aboout/infos.ts";
import logo from "@/assets/svgs/logos/Production.svg";
import text_logo from "@/assets/svgs/logos/TextLogoFull.svg";
import updateObj from "@/apps/UpgradeLog/updateObj.ts";
import {useMemo} from "react";

const WideScreenAboutTop = () => {
	const v = useMemo(() => {
		return updateObj[updateObj.length - 1]['v']
	}, [updateObj])
	return <>
		<div className="flex items-center justify-center gap-5 flex-wrap">
			<div className="px-5">
				<div className="select-none w-full h-[50px] mt-10 mb-2.5 flex items-center justify-center">
					<img src={logo} alt="" className="w-full h-full select-none"/>
				</div>
				<div className="select-none w-full h-[50px] flex items-center justify-center mb-5">
					<img src={text_logo} alt="" className="w-full h-full select-none"/>
				</div>
			</div>
			<div className="w-[220px] pt-2.5 flex flex-col items-center">
				<div className="text-blue-800 mb-1.5 text-xs px-4 py-1 bg-blue-50 rounded-full">版本号</div>
				<div className="px-1.5 py-0.5 text-sm text-gray-800">{v}</div>
				<div className="w-full h-[15px]"></div>

				<div className="text-blue-800 mb-1.5 text-xs px-4 py-1 bg-blue-50 rounded-full">备案信息</div>
				<div className="px-1.5 py-0.5 text-sm text-gray-800">{infos.reg}</div>
			</div>
		</div>
	</>
}

export default WideScreenAboutTop
