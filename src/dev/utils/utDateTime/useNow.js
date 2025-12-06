import { useEffect, useState } from 'react';

const useNow = (interval = 1000)=> {
    const [time, setTime] = useState(new Date());
    const updateTime = () => setTime(new Date());

    useEffect(() => {
        const _timer = setInterval(updateTime, interval);
        return () => clearInterval(_timer);
    }, [interval]);

    return [time];
};

export default useNow;