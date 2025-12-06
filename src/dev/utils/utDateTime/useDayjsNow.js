import {useEffect, useState} from 'react';
import guoDT from "@utils/utDateTime/guoDT.ts";

const useDayjsNow = (interval = 1000) => {
    const [time, setTime] = useState(new Date());
    const updateTime = () => setTime(new Date());

    useEffect(() => {
        const _timer = setInterval(updateTime, interval);
        return () => clearInterval(_timer);
    }, [interval]);

    return guoDT.getDayjs(time);
};

export default useDayjsNow;