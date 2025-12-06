import {isString} from "lodash";

const AboutItems = (props: {
	title: string,
	content: string | any[],
}) => {
	return <div className="min-w-[25px] w-[150px] max-w-full select-none">
		<div className="text-sm w-fit mx-auto mb-1.5 mt-6 px-4 py-1 text-blue-700 bg-blue-50 rounded-full">{props.title}</div>
		{isString(props.content) && <div className="text-sm">{props.content}</div>}
	</div>
}

export default AboutItems
