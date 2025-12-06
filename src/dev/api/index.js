import axios from "axios";
import {encode} from "base64-arraybuffer";
// see https://www.u72.net/dev/show-19856.html
// http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1
// 第二个接口：https://cn.bing.com/cnhp/coverstory（获取当日的壁纸故事）

const api = axios.create({
    baseURL: "",
    timeout: 5000,
    withCredentials: true,
})
api.interceptors.request.use(
    function (config) {
        let token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// export const api_bingGet = axios.create({
//     baseURL: "http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1", timeout: 5000,
// })
//
// export const api_bingStory = axios.create({
//     baseURL: "https://cn.bing.com/cnhp/coverstory",
//     timeout: 5000
// })

export const api_getBingPic = async (dayNum = 0) => {
    // 1.从第一个API中获取图片的JSON信息
    const apiURL_1 = `https://www.bing.com/HPImageArchive.aspx?format=js&idx=${dayNum}&n=1&video=0`
    const apiResult_1 = await api.get(apiURL_1, {withCredentials: true})
    // 如果有结果，就继续
    if (apiResult_1.status === 200) {
        const resultDataJson = apiResult_1.data.images[0]
        // console.log(apiResult.data.images[0])
        const picSrcURL = `https://cn.bing.com${resultDataJson?.url}`
        const picCopyright = resultDataJson["copyright"]
        const picCopyrightLink = resultDataJson["copyrightlink"]
        const picDate = resultDataJson["enddate"]
        const picTitle = resultDataJson["title"]
        // console.log(apiResult_1)
        // 如果获取到第一个API中的数据，那么就提取正确的图片URL，并通过arraybuffer的格式返回
        const apiResult_2 = await api.get(picSrcURL,
            {responseType: "arraybuffer"})
        // console.log(realPicResult)
        if (apiResult_2.status === 200) {
            // return realPicResult.data
            const picSrc = `data:img/jpeg;base64,${encode(apiResult_2.data)}`
            // console.log("src", imgSrc)
            return {picSrc, picSrcURL, picCopyright, picCopyrightLink, picDate, picTitle}
        }
        return void 0
    }
    return void 0
}
