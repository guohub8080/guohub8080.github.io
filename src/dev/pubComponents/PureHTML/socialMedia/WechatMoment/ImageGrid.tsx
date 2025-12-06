import React from "react";
import ImgEx from "../../basicEx/ImgEx.tsx";
import {WechatMomentImage} from "./types";

const GAP = 6; // px

const getGridTemplate = (count: number) => {
  if (count === 1) {
    return {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto",
    } as React.CSSProperties
  }
  if (count === 2 || count === 4) {
    return {
      gridTemplateColumns: "1fr 1fr",
    } as React.CSSProperties
  }
  return {
    gridTemplateColumns: "1fr 1fr 1fr",
  } as React.CSSProperties
}

const getItemStyle = (count: number): React.CSSProperties => {
  if (count === 1) {
    return {
      width: "66%",
      maxWidth: 420,
      aspectRatio: "1 / 1",
      borderRadius: 6,
      overflow: "hidden",
    }
  }
  return {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 4,
    overflow: "hidden",
  }
}

const ImageGrid = (props: {
  images: WechatMomentImage[]
  onImageClick?: (image: WechatMomentImage, index: number, images: WechatMomentImage[]) => void
}) => {
  const {images, onImageClick} = props
  const count = images?.length || 0
  if (!count) return null

  const containerStyle: React.CSSProperties = {
    display: "grid",
    gap: GAP,
    ...getGridTemplate(count),
  }

  const itemStyle = getItemStyle(count)

  return (
    <div style={containerStyle}>
      {images.map((img, idx) => (
        <ImgEx
          key={idx}
          url={img.url}
          style={itemStyle}
          properties={{
            onClick: () => onImageClick && onImageClick(img, idx, images),
          }}
        />
      ))}
    </div>
  )
}

export default ImageGrid


