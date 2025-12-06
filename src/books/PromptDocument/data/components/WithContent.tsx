import { useState } from "react"



const WithContent = (props:{content:string}) => {
    const [content, setContent] = useState(props.content)

    return(<div className="w-full h-full">
        <div className="w-full h-full">
            <div className="w-full h-full">{props.content}</div>
        </div>
    </div>)
}

    export default WithContent