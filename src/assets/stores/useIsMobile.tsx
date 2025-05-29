/* eslint-disable no-mixed-spaces-and-tabs */

import {useWindowSize} from "react-use";
import {useEffect, useState} from "react";
import * as rdd from "react-device-detect";

const useIsMobile = () => {
	const {width} = useWindowSize();
	const [r, setIsMobile] = useState(false)
	useEffect(() => {

		setIsMobile(rdd.isMobile);
	}, [width])
	return r
}

export default useIsMobile
