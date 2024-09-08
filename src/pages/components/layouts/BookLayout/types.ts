import {ElementType, ReactNode} from "react";

export type TOC_type = {
    title: string,
    link: string,
    content: ReactNode | ElementType,
    indentLevel: number
}[]

