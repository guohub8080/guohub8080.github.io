export interface ArticleFrameProps {
    children?: React.ReactNode;
    borderRadius?: number;
    articleBgColor?: string;
    theme?: "red" | undefined;
    underTitle: UnderTitleItem[];
}

export interface UnderTitleItem {
    title: string;
    name?: string | string[];
}

export interface ArticleBottomProps {
    borderRadius: number;
    borderColor: string;
    lightColor: string;
    darkColor: string;
    titleUnderColor: string;
    underTitle: UnderTitleItem[];
}

export interface EachMentionProps {
    title: string;
    name?: string | string[];
    titleUnderColor: string;
    titleColor: string;
}

