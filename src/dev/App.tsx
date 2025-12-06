// import {ConfigProvider, theme} from "antd";
// import zhCN from "antd/locale/zh_CN";
import {RouterProvider} from "react-router-dom";
import router from "./router";
import React from "react";
import { Toaster } from 'react-hot-toast';


const App = () => {
    return (<>
        {/* Ant Design 已禁用 - 使用 shadcn/ui */}
        {/* <ConfigProvider 
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: '#1976D2',
                },
            }}
        > */}
            <RouterProvider router={router}/>
            <Toaster position="top-center" />
        {/* </ConfigProvider> */}
    </>)
}

export default App