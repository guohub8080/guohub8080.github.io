import {createHashRouter, Navigate} from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { generateSvgDocumentRoutes } from "../../books/SvgDocument/data/svgDocumentLoader.tsx";
import { generateMusic12DocumentRoutes } from "../../books/Music12Document/data/music12DocumentLoader.tsx";
import { generateMusicTheoryDocumentRoutes } from "../../books/MusicTheoryDocument/data/musicTheoryDocumentLoader.tsx";
import { generatePromptDocumentRoutes } from "../../books/PromptDocument/data/promptDocumentLoader.tsx";
import { generateTonicMLDocumentRoutes } from "../../books/TonicMLDocument/data/tonicmlDocumentLoader.tsx";
import { generateTonicMLScoreRoutes } from "../../books/TonicMLScore/data/tonicmlScoreLoader.tsx";
import { generateWebDevDocumentRoutes } from "../../books/WebDevDocument/data/webDevDocumentLoader.tsx";
import { generateMinnaJPPrimary1Routes } from "../../books/MinnaJP_Primary1/data/minnaJPPrimary1Loader.tsx";
import { generatePlanTodoRoutes } from "../apps/PlanToDo/pages/data/planTodoLoader.tsx";
import { generateIMERoutes } from "../apps/IME/pages/data/imeLoader.tsx";
import { generateGoodWritingRoutes } from "../../books/GoodWriting/data/goodWritingLoader.tsx";
import { generateEnglishExpressionRoutes } from "../../books/EnglishExpression/data/englishExpressionLoader.tsx";
import About from '../apps/About';
import Settings from '../apps/Settings';
import Home from '../apps/Home';
import Mtkit from '../apps/Mtkit';
import Crypto from '../apps/Crypto';
import TonicMLEditor from '../apps/TonicMLEditor';
import Color from '../apps/Color';
import PubEditor from '../apps/PubEditor';
import Articles from '../apps/PubEditor/pages/articles';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 未匹配路由时：打印错误地址并跳转到首页
const BadRouteRedirect: React.FC = () => {
    const location = useLocation()
    
    useEffect(() => {
        console.warn(`访问了不存在的路由: ${location.pathname}`)
    }, [location.pathname])
    
    return <Navigate to="/home/" replace />
}

//

export default createHashRouter([
    {
        path: "",
        element: <Navigate to="/home/" replace />
    },
    {
        path: "/",
        element: <MainLayout/>,
        children:  [
            {
                path: "home",
                element: <Home />
            },
            ...generateSvgDocumentRoutes(),
            ...generateMusic12DocumentRoutes(),
            ...generateMusicTheoryDocumentRoutes(),
            ...generatePromptDocumentRoutes(),
            ...generateTonicMLDocumentRoutes(),
            ...generateTonicMLScoreRoutes(),
            ...generateWebDevDocumentRoutes(),
            ...generateMinnaJPPrimary1Routes(),
            ...generatePlanTodoRoutes(),
            ...generateIMERoutes(),
            ...generateGoodWritingRoutes(),
            ...generateEnglishExpressionRoutes(),
            {
                path: "about",
                element: <About />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "mtkit",
                element: <Mtkit />
            },
            {
                path: "crypto",
                element: <Crypto />
            },
            {
                path: "color",
                element: <Color />
            },
            {
                path: "tonicml",
                element: <TonicMLEditor />
            },
            {
                path: "pubeditor",
                element: <PubEditor />,
                children: [
                    {
                        index: true,
                        element: <Articles />
                    },
                    {
                        path: "articles",
                        element: <Articles />
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <BadRouteRedirect />
    }
]);