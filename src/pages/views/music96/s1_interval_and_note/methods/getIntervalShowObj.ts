// noinspection ES6PreferShortImport

import {Interval} from "@/music96/interval";

const getIntervalShowObj = (interval: InstanceType<typeof Interval>) => {
	return {...interval, simpleDescription: interval.simpleDescription}
}

export default getIntervalShowObj