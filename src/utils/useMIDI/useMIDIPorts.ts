import {useList} from "react-use";
import JZZ from "./jzz.ts";
import {useEffect, useState} from "react";

const useMIDIPorts = (): {
	inputs: undefined | null | port[],
	outputs: undefined | null | port[], info: undefined | object
} => {
	const [inputs, inputActions] = useList([])
	const [outputs, outputActions] = useList([])
	const [info, setInfo] = useState({})
	useEffect(() => {
		JZZ({sysex: true}).and(() => {
			const JZZInfo = JZZ().info()
			inputActions.set(JZZInfo.inputs)
			outputActions.set(JZZInfo.outputs)
			setInfo(JZZInfo)
		})
	}, [])
	JZZ({sysex: true}).onChange(() => {
		JZZ({sysex: true}).and(() => {
			const JZZInfo = JZZ().info()
			inputActions.set(JZZInfo.inputs)
			outputActions.set(JZZInfo.outputs)
			setInfo(JZZInfo)
		})
	})
	return {inputs, outputs, info}
}

export default useMIDIPorts


type port = {
	engine: string
	id: string
	manufacturer: string
	name: string
	version: string
}