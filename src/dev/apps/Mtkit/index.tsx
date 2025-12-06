import mtkit_text_svg from "./icons/MtKitText.svg";
import {Toaster} from "react-hot-toast";
import WebAddrCard from "./comps/WebAddrCard.tsx";
import github from "./icons/github_logo.svg";
import cloudflare from "./icons/cloudflare.svg";
import vercel from "./icons/vercel.svg";
import netlify from "./icons/netlify_light.svg";

const MtKit = (props: {}) => {
	return <>
		<Toaster/>
		<div className="flex flex-col items-center">
			<div className="mt-10 mb-2.5 flex justify-center">
				<div className="drop-shadow-[0_0_8px_rgba(255,255,255,1),0_0_16px_rgba(255,255,255,0.8),0_0_24px_rgba(255,255,255,0.6),0_0_32px_rgba(255,255,255,0.4),0_0_48px_rgba(255,255,255,0.3),0_0_64px_rgba(255,255,255,0.2)]">
					<svg className="w-[45px]" viewBox="-20 -20 462.72 531.31" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="gradient" x1="247.75" y1="520.79" x2="244.85" y2="-1217.21" gradientTransform="translate(137.61 161.42) scale(.3 -.3)" gradientUnits="userSpaceOnUse">
								<stop offset="0" stopColor="#5cc3f6"/>
								<stop offset="1" stopColor="#3771e8"/>
							</linearGradient>
						</defs>
						<polygon fill="#52aef2" points="361.4 85.5 361.4 162 164.8 195.5 164.8 120.5 361.4 85.5"/>
						<polygon fill="#4b9ef0" points="245.8 215.6 245.8 251.9 164.8 265.6 164.8 230.6 245.8 215.6"/>
						<polygon fill="#4691ee" points="245.8 279.7 245.8 316.4 164.8 330.1 164.8 295 245.8 279.7"/>
						<polygon fill="#4c9ff0" points="361.4 194.7 361.4 231 280.4 244.7 280.4 209.6 361.4 194.7"/>
						<polygon fill="#4085eb" points="245.8 344.6 245.8 380.9 164.8 394.6 164.8 360.1 245.8 344.6"/>
						<path fill="url(#gradient)" d="M422.6,11.3v341.7c-1,64.8-83.6,93.5-124.9,42.9-44.4-54.5,10.2-133.2,77.6-111,2,.6,11.8,5.4,12.3,4.8V47.6l-246.6,43.5c-.8,64.6-.3,129.2-.4,193.8,0,45.8,2.3,94.9,0,140.2-4.5,89.9-137.8,86.9-140.6-.8v-5.2c1.8-52.4,60.1-84.5,105.6-58.4,1.6-94.7-.7-189.4.4-284.1.1-10-3.7-27.5,8.8-30.5L412,0c5.8,0,11.1,5.6,10.7,11.3h-.1Z"/>
					</svg>
				</div>
			</div>
			<div className="flex justify-center w-full">
				<div className="drop-shadow-[0_0_8px_rgba(255,255,255,1),0_0_16px_rgba(255,255,255,0.8),0_0_24px_rgba(255,255,255,0.6),0_0_32px_rgba(255,255,255,0.4),0_0_48px_rgba(255,255,255,0.3),0_0_64px_rgba(255,255,255,0.2)]">
					<img src={mtkit_text_svg} alt="MtKit" className="w-full max-w-[150px] h-auto"/>
				</div>
			</div>
		</div>
		<div className="max-w-[800px] mx-auto px-4 mt-8">
			<div className="flex flex-wrap justify-center items-center gap-6">
				<WebAddrCard
					url={"https://mtkit.top"} title="项目主页"/>
				<WebAddrCard
					img={github}
					url={"https://github.com/guohub8080/mtkit"} title="GitHub仓库"/>
				<WebAddrCard
					img={github}
					url={"https://guohub8080.github.io/mtkit/"} title="GitHub Pages镜像"/>
				<WebAddrCard
					img={cloudflare}
					url={"https://mtkit.pages.dev/"} title="Cloudflare Pages镜像"/>
				<WebAddrCard
					img={vercel}
					url={"https://mtkit.vercel.app/"} title="Vercel镜像"/>
				<WebAddrCard
					img={netlify}
					url={"https://mtkit.netlify.app/"} title="Netlify镜像"/>
			</div>
		</div>
		<div className="w-full h-[120px]"></div>
	</>
}

export default MtKit
