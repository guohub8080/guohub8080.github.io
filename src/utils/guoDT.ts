// @ts-ignore
import dayjs, {Dayjs} from "dayjs";
// @ts-ignore
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
// @ts-ignore
import isLeapYear from 'dayjs/plugin/isLeapYear'
// @ts-ignore
import dayOfYear from "dayjs/plugin/dayOfYear"
// @ts-ignore
import weekOfYear from "dayjs/plugin/weekOfYear"
// @ts-ignore
import updateLocale from "dayjs/plugin/updateLocale"

// 返回一个 number 来表示 Day.js 的日期是年中第几周。
dayjs.extend(weekOfYear);
// 返回一个 number 来得到依据 ISO week 标准一年中有几周，此功能依赖 IsLeapYear 插件，才能正常运行
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(dayOfYear);
dayjs.extend(updateLocale)
dayjs.locale("zh-cn")
dayjs.updateLocale("zh-cn", {weekStart: 7})


const getDayjs = (dayString?: string): Dayjs => {
    if (dayString) {
        return dayjs(dayString)
    }
    return dayjs()
}

const getFormattedDayjs = (dayjsObj: Dayjs, formatString = "YYYY年M月D日 HH:mm:ss") => {
    // Format	Output	            Description
    // YY	    18	                Two-digit year
    // YYYY	    2018	            Four-digit year
    // M	    1-12	            The month, beginning at 1
    // MM	    01-12	            The month, 2-digits
    // MMM	    Jan-Dec	            The abbreviated month name
    // MMMM	    January-December	The full month name
    // D	    1-31	            The day of the month
    // DD	    01-31	            The day of the month, 2-digits
    // H	    0-23	            The hour
    // HH	    00-23	            The hour, 2-digits
    // h	    1-12	            The hour, 12-hour clock
    // hh	    01-12	            The hour, 12-hour clock, 2-digits
    // m	    0-59	            The minute
    // mm	    00-59	            The minute, 2-digits
    // s	    0-59	            The second
    // ss	    00-59	            The second, 2-digits
    // SSS  	000-999	            The millisecond, 3-digits
    // A	    AM PM	            The meridiem
    // AA	    A.M. P.M.	        The meridiem, periods
    // a	    am pm	            The meridiem, lowercase
    // aa	    a.m. p.m.	        The meridiem, lowercase and periods
    // d	    0-6	                The day of the week, with Sunday as 0
    // dd	    S-S	                The min name of the day of the week
    // ddd	    Sun-Sat	            The short name of the day of the week
    // dddd 	Sunday-Saturday	    The name of the day of the week
    if (!dayjsObj && !formatString) {
        return dayjs().format("YYYY年M月D日 HH:mm:ss");
    }
    if (dayjsObj) {
        return dayjsObj.format(formatString)
    }
    return dayjs().format(formatString)
}
const getCnTimePeriod = (dayjsObj: Dayjs) => {
    const hour = dayjsObj.hour()
    if (hour >= 0 && hour < 3) return "凌晨"
    if (hour >= 3 && hour < 6) return "黎明"
    if (hour >= 6 && hour < 9) return "早上"
    if (hour >= 9 && hour < 12) return "上午"
    if (hour >= 12 && hour < 15) return "中午"
    if (hour >= 15 && hour < 18) return "下午"
    if (hour >= 18 && hour < 21) return "傍晚"
    if (hour >= 21) return "深夜"
}

const getCnWeekDay = (dayjsObj: Dayjs) => {
    const date_weekday_map = ["日", "一", "二", "三", "四", "五", "六"]
    return date_weekday_map[dayjsObj.day()]
}
export default {getDayjs, getFormattedDayjs, getCnTimePeriod,getCnWeekDay}
