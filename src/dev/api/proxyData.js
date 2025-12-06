export default {
    '/getRandomBingPic': {
        target: "https://bing.icodeq.com/", //跨域地址
        changeOrigin: true, //支持跨域
        ws: true,
        rewrite: (path) => path.replace(/^\/getRandomBingPic/, "")//重写路径,替换/api
    },
    "/getBingPicToday": {
        target: "https://cn.bing.com/", //跨域地址
        changeOrigin: true, //支持跨域
        ws: true,
        rewrite: (path) => path.replace(/^\/getBingPicToday/, "")//重写路径,替换/api
    },
    "/getBingPic": {
        // target: "https://www.haoht123.com/wp-content/themes/begin/inc/go.php?url=https://cn.bing.com/cnhp/coverstory?d=20180826",
        target: "https://www.bing.com/HPImageArchive.aspx",
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/getBingPic/, '')
    }
}