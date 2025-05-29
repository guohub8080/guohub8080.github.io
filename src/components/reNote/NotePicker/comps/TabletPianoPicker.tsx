{/* eslint-disable no-mixed-spaces-and-tabs */
}
import {isFunction} from "lodash";
import * as React from "react"
import usePianoPicker from "@/assets/stores/usePianoPicker.ts";
import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";

const select_key_color = googleColors.gray300
const select_black_key_color = googleColors.yellow600
const default_alter_color = googleColors.gray500
const styles = {
  transition: "all 0.1s ease-in-out",
  cursor: "pointer",
}
const SvgComponent = (props:{
  onSelect?: (step: string, alter: number) => any
}) => {
  const pianoPickerConfig = usePianoPicker();
  const {setNotePicker} = useGlobalSettings();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 591.65 396.67"
      // style={{
      //   enableBackground: "new 0 0 591.65 396.67",
      // }}
      xmlSpace="preserve"
    >
      <g id="white_x5F_keys">
        <path
          onMouseEnter={() => pianoPickerConfig.set_w_color("C", select_key_color)}
          onMouseLeave={() => pianoPickerConfig.set_w_color("C")}
          onClick={() => {
            if(isFunction(props.onSelect)) {
              props.onSelect("C", 0)
              return;
            }
            setNotePicker("C", 0);
            pianoPickerConfig.reset_color();
          }}
          id="w_x5F_c"
          style={{
            fill: pianoPickerConfig.w_c_color,
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
            ...styles,
          }}
          d="M74.74,388.99H15.81 c-6.79,0-12.29-5.5-12.29-12.29V19.97c0-6.79,5.5-12.29,12.29-12.29h58.93c6.79,0,12.29,5.5,12.29,12.29V376.7 C87.03,383.49,81.53,388.99,74.74,388.99z"
        />
        <path
          id="w_x5F_d"
          onMouseEnter={() => pianoPickerConfig.set_w_color("D", select_key_color)}
          onMouseLeave={() => pianoPickerConfig.set_w_color("D")}
          onClick={() => {
            if(isFunction(props.onSelect)) {
              props.onSelect("D", 0)
              return;
            }
            setNotePicker("D", 0);
            pianoPickerConfig.reset_color();
          }}
          style={{
            fill: pianoPickerConfig.w_d_color,
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
            ...styles,
          }}
          d="M158.26,388.99H99.33 c-6.79,0-12.29-5.5-12.29-12.29V19.97c0-6.79,5.5-12.29,12.29-12.29h58.93c6.79,0,12.29,5.5,12.29,12.29V376.7 C170.55,383.49,165.05,388.99,158.26,388.99z"
        />
        <path
          id="w_x5F_e"
          onMouseEnter={() => pianoPickerConfig.set_w_color("E", select_key_color)}
          onMouseLeave={() => pianoPickerConfig.set_w_color("E")}
          onClick={() => {
            if(isFunction(props.onSelect)) {
              props.onSelect("E", 0)
              return;
            }
            setNotePicker("E", 0);
            pianoPickerConfig.reset_color();
          }}
          style={{
            fill: pianoPickerConfig.w_e_color,
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
            ...styles,
          }}
          d="M241.78,388.99h-58.93 c-6.79,0-12.29-5.5-12.29-12.29V19.97c0-6.79,5.5-12.29,12.29-12.29h71.23V376.7C254.07,383.49,248.56,388.99,241.78,388.99z"
        />
        <path
          id="w_x5F_f"
          onMouseEnter={() => pianoPickerConfig.set_w_color("F", select_key_color)}
          onMouseLeave={() => pianoPickerConfig.set_w_color("F")}
          onClick={() => {
            if(isFunction(props.onSelect)) {
              props.onSelect("F", 0)
              return;
            }
            setNotePicker("F", 0);
            pianoPickerConfig.reset_color();
          }}
          style={{
            fill: pianoPickerConfig.w_f_color,
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
            ...styles
          }}
          d="M325.29,388.99h-58.93 c-6.79,0-12.29-5.5-12.29-12.29V7.68h71.23c6.79,0,12.29,5.5,12.29,12.29V376.7C337.58,383.49,332.08,388.99,325.29,388.99z"
        />
        <path
          id="w_x5F_g"
          onMouseEnter={() => pianoPickerConfig.set_w_color("G", select_key_color)}
          onMouseLeave={() => pianoPickerConfig.set_w_color("G")}
          onClick={() => {
            if(isFunction(props.onSelect)) {
              props.onSelect("G", 0)
              return;
            }
            setNotePicker("G", 0);
            pianoPickerConfig.reset_color();
          }}
          style={{
            fill: pianoPickerConfig.w_g_color,
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
            ...styles
          }}
          d="M408.81,388.99h-58.93 c-6.79,0-12.29-5.5-12.29-12.29V19.97c0-6.79,5.5-12.29,12.29-12.29h58.93c6.79,0,12.29,5.5,12.29,12.29V376.7 C421.1,383.49,415.6,388.99,408.81,388.99z"
        />
        <path
          id="w_x5F_a"
          onMouseEnter={() => pianoPickerConfig.set_w_color("A", select_key_color)}
          onMouseLeave={() => pianoPickerConfig.set_w_color("A")}
          onClick={() => {
            if(isFunction(props.onSelect)) {
              props.onSelect("A", 0)
              return;
            }
            setNotePicker("A", 0);
            pianoPickerConfig.reset_color();
          }}
          style={{
            fill: pianoPickerConfig.w_a_color,
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
            ...styles
          }}
          d="M492.33,388.99h-58.93 c-6.79,0-12.29-5.5-12.29-12.29V19.97c0-6.79,5.5-12.29,12.29-12.29h58.93c6.79,0,12.29,5.5,12.29,12.29V376.7 C504.62,383.49,499.11,388.99,492.33,388.99z"
        />
        <path
          id="w_x5F_b"
          onMouseEnter={() => pianoPickerConfig.set_w_color("B", select_key_color)}
          onMouseLeave={() => pianoPickerConfig.set_w_color("B")}
          onClick={() => {
            if(isFunction(props.onSelect)) {
              props.onSelect("B", 0)
              return;
            }
            setNotePicker("B", 0);
            pianoPickerConfig.reset_color();
          }}
          style={{
            fill: pianoPickerConfig.w_b_color,
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
            ...styles
          }}
          d="M575.84,388.99h-58.93 c-6.79,0-12.29-5.5-12.29-12.29V19.97c0-6.79,5.5-12.29,12.29-12.29h58.93c6.79,0,12.29,5.5,12.29,12.29V376.7 C588.13,383.49,582.63,388.99,575.84,388.99z"
        />
      </g>
      <g id="black_x5F_keys">
        <path
          id="b_x5F_cd_00000017501933048868902520000015548850808202048168_"
          style={{
            fill: "#3F3F3F",
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
          }}
          d=" M105.27,231.54H68.8c-5.41,0-9.79-4.38-9.79-9.79V7.68h56.04v214.07C115.06,227.16,110.67,231.54,105.27,231.54z"
        />
        <path
          id="b_x5F_de_00000006707151354311581100000008461333170107408032_"
          style={{
            fill: "#3F3F3F",
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
          }}
          d=" M188.78,231.54h-36.46c-5.41,0-9.79-4.38-9.79-9.79V7.68h56.04v214.07C198.57,227.16,194.19,231.54,188.78,231.54z"
        />
        <path
          id="b_x5F_fg_00000180368607920575396140000013658624419144796338_"
          style={{
            fill: "#3F3F3F",
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
          }}
          d=" M355.82,231.54h-36.46c-5.41,0-9.79-4.38-9.79-9.79V7.68h56.04v214.07C365.61,227.16,361.22,231.54,355.82,231.54z"
        />
        <path
          id="b_x5F_ga_00000083769911719773937060000018003787902989549217_"
          style={{
            fill: "#3F3F3F",
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
          }}
          d=" M439.33,231.54h-36.46c-5.41,0-9.79-4.38-9.79-9.79V7.68h56.04v214.07C449.12,227.16,444.74,231.54,439.33,231.54z"
        />
        <path
          id="b_x5F_ab_00000150100412716827065390000015056437285628711560_"
          style={{
            fill: "#3F3F3F",
            stroke: "#3E3A39",
            strokeWidth: 3,
            strokeMiterlimit: 10,
          }}
          d=" M522.85,231.54h-36.46c-5.41,0-9.79-4.38-9.79-9.79V7.68h56.04v214.07C532.64,227.16,528.26,231.54,522.85,231.54z"
        />
      </g>
      <g id="alters">
        <g id="cd">
          <g id="sharp_x5F_group"
             onMouseEnter={() => pianoPickerConfig.set_b_color("CDs", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("CDs")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("C", 1)
                 return;
               }
               setNotePicker("C", 1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_shaarp"
              style={{
                fill: pianoPickerConfig.b_cd_s_color,
                ...styles
              }}
              d="M116.2,110.95H57.87c-5.92,0-10.72-4.8-10.72-10.72V37.59 c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64C126.91,106.15,122.11,110.95,116.2,110.95z"
            />
            <path
              id="sharp_x5F_sybol"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M101.74,81.39l-5.55,1.9V97.4h-3.65V84.55l-11.02,3.72v14.18h-3.65V89.54 l-5.55,1.9v-8.57l5.55-1.83V65.88l-5.55,1.9v-8.57l5.55-1.9V43.21h3.65v12.85l11.02-3.72V38.15h3.65v12.92l5.55-1.9v8.57 l-5.55,1.83v15.16l5.55-1.9V81.39z M92.55,75.99V60.83l-11.02,3.79v15.16L92.55,75.99z"
            />
          </g>
          <g id="flat_x5F_group" onMouseEnter={() => pianoPickerConfig.set_b_color("CDf", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("CDf")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("D", -1)
                 return;
               }
               setNotePicker("D", -1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_flat_00000143597318305416283370000018402379115573655683_"
              style={{
                fill: pianoPickerConfig.b_cd_f_color,
                ...styles
              }}
              d="M116.2,217.34H57.87 c-5.92,0-10.72-4.8-10.72-10.72v-62.64c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C126.91,212.54,122.11,217.34,116.2,217.34z"
            />
            <path
              id="flat_x5F_sybol"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M100.79,179.8c0,9.59-8.28,17.18-24.85,22.74v-52.37h3.65v20.64 c1.92-2.48,4.38-3.72,7.37-3.72c3.7,0,6.93,1.21,9.69,3.61C99.4,173.12,100.79,176.15,100.79,179.8z M91.38,179.8 c0-1.87-0.38-3.52-1.12-4.95c-0.75-1.43-1.85-2.14-3.3-2.14c-3.37,0-5.83,1.12-7.37,3.37v21.13c3.56-1.78,6.41-4.2,8.57-7.27 C90.3,186.88,91.38,183.5,91.38,179.8z"
            />
          </g>
        </g>
        <g id="de">
          <g id="sharp_x5F_group_00000034791980306674099140000012556611787365490365_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("des", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("des")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("D", 1)
                 return;
               }
               setNotePicker("D", 1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_shaarp_00000150098189369901807140000012094595676980659355_"
              style={{
                fill: pianoPickerConfig.b_de_s_color,
                ...styles
              }}
              d="M199.71,110.95h-58.32 c-5.92,0-10.72-4.8-10.72-10.72V37.59c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C210.43,106.15,205.63,110.95,199.71,110.95z"
            />
            <path
              id="sharp_x5F_sybol_00000005966605018047750520000013261479668668498099_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M185.26,81.39 l-5.55,1.9V97.4h-3.65V84.55l-11.02,3.72v14.18h-3.65V89.54l-5.55,1.9v-8.57l5.55-1.83V65.88l-5.55,1.9v-8.57l5.55-1.9V43.21 h3.65v12.85l11.02-3.72V38.15h3.65v12.92l5.55-1.9v8.57l-5.55,1.83v15.16l5.55-1.9V81.39z M176.06,75.99V60.83l-11.02,3.79v15.16 L176.06,75.99z"
            />
          </g>
          <g id="flat_x5F_group_00000128460005392275346230000006874897174125465279_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("def", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("def")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("E", -1)
                 return;
               }
               setNotePicker("E", -1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_flat_00000094603985634974676350000006228293679196392610_"
              style={{
                fill: pianoPickerConfig.b_de_f_color,
                ...styles
              }}
              d="M199.71,217.34h-58.32 c-5.92,0-10.72-4.8-10.72-10.72v-62.64c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C210.43,212.54,205.63,217.34,199.71,217.34z"
            />
            <path
              id="flat_x5F_sybol_00000019670539478060074890000000230157550693021337_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M184.3,179.8 c0,9.59-8.28,17.18-24.85,22.74v-52.37h3.65v20.64c1.92-2.48,4.38-3.72,7.37-3.72c3.7,0,6.93,1.21,9.69,3.61 C182.92,173.12,184.3,176.15,184.3,179.8z M174.9,179.8c0-1.87-0.38-3.52-1.12-4.95c-0.75-1.43-1.85-2.14-3.3-2.14 c-3.37,0-5.83,1.12-7.37,3.37v21.13c3.56-1.78,6.41-4.2,8.57-7.27C173.82,186.88,174.9,183.5,174.9,179.8z"
            />
          </g>
        </g>
        <g id="fg">
          <g id="sharp_x5F_group_00000111184533782297873060000000437770054885128075_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("fgs", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("fgs")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("F", 1)
                 return;
               }
               setNotePicker("F", 1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_shaarp_00000129207342742234584320000014138307918828779679_"
              style={{
                fill: pianoPickerConfig.b_fg_s_color,
                ...styles
              }}
              d="M366.74,110.95h-58.32 c-5.92,0-10.72-4.8-10.72-10.72V37.59c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C377.46,106.15,372.66,110.95,366.74,110.95z"
            />
            <path
              id="sharp_x5F_sybol_00000095314541101652648920000011389329376573393830_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M352.29,81.39 l-5.55,1.9V97.4h-3.65V84.55l-11.02,3.72v14.18h-3.65V89.54l-5.55,1.9v-8.57l5.55-1.83V65.88l-5.55,1.9v-8.57l5.55-1.9V43.21 h3.65v12.85l11.02-3.72V38.15h3.65v12.92l5.55-1.9v8.57l-5.55,1.83v15.16l5.55-1.9V81.39z M343.1,75.99V60.83l-11.02,3.79v15.16 L343.1,75.99z"
            />
          </g>
          <g id="flat_x5F_group_00000099662435087855861900000002125612808816626340_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("fgf", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("fgf")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("G", -1)
                 return;
               }
               setNotePicker("G", -1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_flat_00000093893367259552231000000007436153646553867923_"
              style={{
                fill: pianoPickerConfig.b_fg_f_color,
                ...styles
              }}
              d="M366.74,217.34h-58.32 c-5.92,0-10.72-4.8-10.72-10.72v-62.64c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C377.46,212.54,372.66,217.34,366.74,217.34z"
            />
            <path
              id="flat_x5F_sybol_00000039115184155902466390000006501620860462196917_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M351.34,179.8 c0,9.59-8.28,17.18-24.85,22.74v-52.37h3.65v20.64c1.92-2.48,4.38-3.72,7.37-3.72c3.7,0,6.93,1.21,9.69,3.61 C349.95,173.12,351.34,176.15,351.34,179.8z M341.93,179.8c0-1.87-0.38-3.52-1.12-4.95c-0.75-1.43-1.85-2.14-3.3-2.14 c-3.37,0-5.83,1.12-7.37,3.37v21.13c3.56-1.78,6.41-4.2,8.57-7.27C340.85,186.88,341.93,183.5,341.93,179.8z"
            />
          </g>
        </g>
        <g id="ga">
          <g id="sharp_x5F_group_00000016076718930458096180000006842172283245481883_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("gas", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("gas")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("G", 1)
                 return;
               }
               setNotePicker("G", 1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_shaarp_00000150101946015706945160000003411392650405087619_"
              style={{
                fill: pianoPickerConfig.b_ga_s_color,
                ...styles
              }}
              d="M450.26,110.95h-58.32 c-5.92,0-10.72-4.8-10.72-10.72V37.59c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C460.98,106.15,456.18,110.95,450.26,110.95z"
            />
            <path
              id="sharp_x5F_sybol_00000090295325788622892640000011370692961162276272_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M435.81,81.39 l-5.55,1.9V97.4h-3.65V84.55l-11.02,3.72v14.18h-3.65V89.54l-5.55,1.9v-8.57l5.55-1.83V65.88l-5.55,1.9v-8.57l5.55-1.9V43.21 h3.65v12.85l11.02-3.72V38.15h3.65v12.92l5.55-1.9v8.57l-5.55,1.83v15.16l5.55-1.9V81.39z M426.61,75.99V60.83l-11.02,3.79v15.16 L426.61,75.99z"
            />
          </g>
          <g id="flat_x5F_group_00000149356911122162918240000010531919609370127291_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("gaf", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("gaf")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("A", -1)
                 return;
               }
               setNotePicker("A", -1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_flat_00000093867193649257269590000002182805129199767975_"
              style={{
                fill: pianoPickerConfig.b_ga_f_color,
                ...styles
              }}
              d="M450.26,217.34h-58.32 c-5.92,0-10.72-4.8-10.72-10.72v-62.64c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C460.98,212.54,456.18,217.34,450.26,217.34z"
            />
            <path
              id="flat_x5F_sybol_00000143616386081159654120000002674617091156136359_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M434.85,179.8 c0,9.59-8.28,17.18-24.85,22.74v-52.37h3.65v20.64c1.92-2.48,4.38-3.72,7.37-3.72c3.7,0,6.93,1.21,9.69,3.61 C433.47,173.12,434.85,176.15,434.85,179.8z M425.45,179.8c0-1.87-0.38-3.52-1.12-4.95c-0.75-1.43-1.85-2.14-3.3-2.14 c-3.37,0-5.83,1.12-7.37,3.37v21.13c3.56-1.78,6.41-4.2,8.57-7.27C424.37,186.88,425.45,183.5,425.45,179.8z"
            />
          </g>
        </g>
        <g id="ab">
          <g id="sharp_x5F_group_00000124868681443098152050000001551428713365610685_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("abs", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("abs")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("A", 1)
                 return;
               }
               setNotePicker("A", 1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_shaarp_00000122715196189531231230000013604262062719602854_"
              style={{
                fill: pianoPickerConfig.b_ab_s_color,
                ...styles
              }}
              d="M533.78,110.95h-58.32 c-5.92,0-10.72-4.8-10.72-10.72V37.59c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C544.49,106.15,539.7,110.95,533.78,110.95z"
            />
            <path
              id="sharp_x5F_sybol_00000061471755923113630420000010292960866838383257_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M519.32,81.39 l-5.55,1.9V97.4h-3.65V84.55l-11.02,3.72v14.18h-3.65V89.54l-5.55,1.9v-8.57l5.55-1.83V65.88l-5.55,1.9v-8.57l5.55-1.9V43.21 h3.65v12.85l11.02-3.72V38.15h3.65v12.92l5.55-1.9v8.57l-5.55,1.83v15.16l5.55-1.9V81.39z M510.13,75.99V60.83l-11.02,3.79v15.16 L510.13,75.99z"
            />
          </g>
          <g id="flat_x5F_group_00000145020657102621636070000001732419394055854990_"
             onMouseEnter={() => pianoPickerConfig.set_b_color("abf", select_black_key_color)}
             onMouseLeave={() => pianoPickerConfig.set_b_color("abf")}
             onClick={() => {
               if(isFunction(props.onSelect)) {
                 props.onSelect("B", -1)
                 return;
               }
               setNotePicker("B", -1);
               pianoPickerConfig.reset_color();
             }}>
            <path
              id="cd_x5F_flat_00000121995065117804239010000008455060957418685630_"
              style={{
                fill: pianoPickerConfig.b_ab_f_color,
                ...styles
              }}
              d="M533.78,217.34h-58.32 c-5.92,0-10.72-4.8-10.72-10.72v-62.64c0-5.92,4.8-10.72,10.72-10.72h58.32c5.92,0,10.72,4.8,10.72,10.72v62.64 C544.49,212.54,539.7,217.34,533.78,217.34z"
            />
            <path
              id="flat_x5F_sybol_00000040532615420750665790000009130222966752162986_"
              style={{
                fill: default_alter_color,
                ...styles
              }}
              d="M518.37,179.8 c0,9.59-8.28,17.18-24.85,22.74v-52.37h3.65v20.64c1.92-2.48,4.38-3.72,7.37-3.72c3.7,0,6.93,1.21,9.69,3.61 C516.99,173.12,518.37,176.15,518.37,179.8z M508.96,179.8c0-1.87-0.38-3.52-1.12-4.95c-0.75-1.43-1.85-2.14-3.3-2.14 c-3.37,0-5.83,1.12-7.37,3.37v21.13c3.56-1.78,6.41-4.2,8.57-7.27C507.88,186.88,508.96,183.5,508.96,179.8z"
            />
          </g>
        </g>
        <g/>
        <g/>
        <g/>
        <g/>
        <g/>
        <g/>
      </g>
    </svg>
  )
}
export default SvgComponent
