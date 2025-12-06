import routerPaths from "../../../dev/router/paths.ts";

export interface EnglishExpressionIconProps {
  className?: string;
}

export const EnglishExpressionIcon = ({ className = "w-full h-full" }: EnglishExpressionIconProps) => (
  <svg
    className={className}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="English Expression Icon"
  >
    <path
      d="M214.5 806.6c-5.9 0-11.7-1.2-17.3-3.7-15.4-6.8-25.2-22-25.2-38.8V653.5h-42.5C59.2 653.5 2 596.4 2 526V170.8C2 100.5 59.2 43.3 129.5 43.3h509.9c70.3 0 127.5 57.2 127.5 127.5V526c0 70.3-57.2 127.5-127.5 127.5H400.7L242.9 795.7c-7.9 7.2-18.1 10.9-28.4 10.9z"
      fill="#60A9FF"
    />
    <path
      d="M894.5 340H852v186c0 117.2-95.4 197-212.6 197h-206l-5.8 4.9c2.7 67.9 58.4 122.1 127 122.1H712l159.5 111.8c7 4.6 15.1 10.9 23.2 10.9 7 0 13.9 0.3 20.3-3.1 13.7-7.5 22.2-20.8 22.2-36.4l-0.1-74.8c49.4-17.5 85-64.3 85-119.7V468.5C1022 398.2 964.8 340 894.5 340z"
      fill="#C1DDFE"
    />
  </svg>
);

export const englishExpressionConfig = {
  title: "英语表达",
  slug: routerPaths.englishExpression,
  description: "英语表达学习和练习",
  icon: <EnglishExpressionIcon />
};

export default englishExpressionConfig;
