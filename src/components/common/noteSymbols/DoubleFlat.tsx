/* eslint-disable no-mixed-spaces-and-tabs */

import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import byDefault from "@/utils/byDefault.ts";

const DoubleFlat = (props: {
    color?: string;
}) => {
  const {defaultNoteColor} = useGlobalSettings();
	return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 270 748"
    >
        <path
          style={{fill: byDefault(props.color, defaultNoteColor)}}
          d="M226.28 183.64v557.07h-32.15V520.78L43.72 559.17V7.29h34.24v214.74l148.32-38.39zM196.2 424.32V291.53L75.87 321.62v131.73l120.33-29.03z" />
    </svg>
  )
}

export default DoubleFlat
