import React from 'react'
import ReactDOM from 'react-dom/client'
import "@/pages/assets/styles/global.css"
import App from "@pages/App.tsx";
import {RouterProvider} from "react-router-dom";
import router from "@pages/router";


ReactDOM.createRoot(document.getElementById('root')!).render(
	<RouterProvider router={router}/>
)
