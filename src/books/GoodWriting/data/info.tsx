import routerPaths from "../../../dev/router/paths.ts";

export interface GoodWritingIconProps {
  className?: string;
}

export const GoodWritingIcon = ({ className = "w-full h-full" }: GoodWritingIconProps) => (
  <svg
    className={className}
    viewBox="80 80 864 864"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="GoodWriting Icon"
  >
    <path
      d="M160 59.2h704c52.8 0 96 43.2 96 96v704c0 52.8-43.2 96-96 96H160c-52.8 0-96-43.2-96-96v-704c0-52.8 43.2-96 96-96z"
      fill="#FF9002"
    ></path>
    <path
      d="M208 203.2h134.4v67.2h-67.2v67.2H208v-134.4z m540.8 472H816v134.4h-134.4v-67.2h67.2v-67.2z m-540.8 0h67.2v67.2h67.2v67.2H208v-134.4z m417.6-472H816v190.4l-44.8 44.8-192-190.4 46.4-44.8z m-68.8 67.2l190.4 190.4-120 120c-16 16-35.2 27.2-57.6 33.6L371.2 672c-4.8 1.6-9.6 1.6-14.4-1.6l176-176c19.2 14.4 46.4 12.8 64-4.8 17.6-22.4 12.8-54.4-9.6-70.4-17.6-14.4-43.2-14.4-60.8 0-17.6 17.6-19.2 44.8-4.8 64l-176 176c-1.6-4.8-3.2-9.6-1.6-14.4L403.2 448c6.4-22.4 17.6-41.6 33.6-57.6l120-120z"
      fill="#FFFFFF"
    ></path>
  </svg>
);

export const goodWritingConfig = {
  title: "咬文嚼字",
  slug: routerPaths.goodWriting,
  description: "语言表达与写作技巧笔记",
  icon: <GoodWritingIcon />
};

export default goodWritingConfig;


