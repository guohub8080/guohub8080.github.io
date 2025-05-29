// noinspection ES6PreferShortImport

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {createJSONStorage, persist} from "zustand/middleware";
import byDefault from "@/utils/byDefault.ts";

type PianoPickerType = {
  w_c_color: string,
  w_d_color: string,
  w_e_color: string,
  w_f_color: string,
  w_g_color: string,
  w_a_color: string,
  w_b_color: string,
  set_w_color: (step: string, newColor?: string) => void,
  reset_color: () => void,
  b_cd_s_color: string,
  b_cd_f_color: string,
  b_de_s_color: string,
  b_de_f_color: string,
  b_fg_s_color: string,
  b_fg_f_color: string,
  b_ga_s_color: string,
  b_ga_f_color: string,
  b_ab_s_color: string,
  b_ab_f_color: string,
  set_b_color: (step: string, newColor?: string) => void,
  resetStore: () => void
}
const default_white_key_color = "#FFFFFF";
const default_black_key_color = "#ffffff00";
const storeKey = 'pianoPickerConfig'
const defaultStore = {
  w_c_color: default_white_key_color,
  w_d_color: default_white_key_color,
  w_e_color: default_white_key_color,
  w_f_color: default_white_key_color,
  w_g_color: default_white_key_color,
  w_a_color: default_white_key_color,
  w_b_color: default_white_key_color,
  b_cd_s_color: default_black_key_color,
  b_cd_f_color: default_black_key_color,
  b_de_s_color: default_black_key_color,
  b_de_f_color: default_black_key_color,
  b_fg_s_color: default_black_key_color,
  b_fg_f_color: default_black_key_color,
  b_ga_s_color: default_black_key_color,
  b_ga_f_color: default_black_key_color,
  b_ab_s_color: default_black_key_color,
  b_ab_f_color: default_black_key_color,
}
const usePianoPicker = create<PianoPickerType>()(immer(persist(
    (set) => ({
      ...defaultStore,
      reset_color: () => {
        set((state) => {
          state.w_c_color = default_white_key_color
          state.w_d_color = default_white_key_color
          state.w_e_color = default_white_key_color
          state.w_f_color = default_white_key_color
          state.w_g_color = default_white_key_color
          state.w_a_color = default_white_key_color
          state.w_b_color = default_white_key_color
          state.b_cd_s_color = default_black_key_color
          state.b_cd_f_color = default_black_key_color
          state.b_de_s_color = default_black_key_color
          state.b_de_f_color = default_black_key_color
          state.b_fg_s_color = default_black_key_color
          state.b_fg_f_color = default_black_key_color
          state.b_ga_s_color = default_black_key_color
          state.b_ga_f_color = default_black_key_color
          state.b_ab_s_color = default_black_key_color
          state.b_ab_f_color = default_black_key_color
        })
      },
      set_w_color: (step: string, newColor?: string) => {
        set((state) => {
          switch (step) {
            case "C":
              state.w_c_color = byDefault(newColor, default_white_key_color)
              return;
            case "D":
              state.w_d_color = byDefault(newColor, default_white_key_color)
              return;
            case "E":
              state.w_e_color = byDefault(newColor, default_white_key_color)
              return;
            case "F":
              state.w_f_color = byDefault(newColor, default_white_key_color)
              return;
            case "G":
              state.w_g_color = byDefault(newColor, default_white_key_color)
              return;
            case "A":
              state.w_a_color = byDefault(newColor, default_white_key_color)
              return;
            case "B":
              state.w_b_color = byDefault(newColor, default_white_key_color)
              return;
          }
        })
      },

      set_b_color: (step: string, newColor?: string) => {
        set((state) => {
          switch (step.toUpperCase()) {
            case "CDS":
              state.b_cd_s_color = byDefault(newColor, default_black_key_color)
              return;
            case "CDF":
              state.b_cd_f_color = byDefault(newColor, default_black_key_color)
              return;
            case "DES":
              state.b_de_s_color = byDefault(newColor, default_black_key_color)
              return;
            case "DEF":
              state.b_de_f_color = byDefault(newColor, default_black_key_color)
              return;
            case "FGS":
              state.b_fg_s_color = byDefault(newColor, default_black_key_color)
              return;
            case "FGF":
              state.b_fg_f_color = byDefault(newColor, default_black_key_color)
              return;
            case "GAS":
              state.b_ga_s_color = byDefault(newColor, default_black_key_color)
              return;
            case "GAF":
              state.b_ga_f_color = byDefault(newColor, default_black_key_color)
              return;
            case "ABS":
              state.b_ab_s_color = byDefault(newColor, default_black_key_color)
              return;
            case "ABF":
              state.b_ab_f_color = byDefault(newColor, default_black_key_color)
              return;
          }
        })
      },
      resetStore: () => {
        set(defaultStore)
        localStorage.removeItem(storeKey)
      },
    }),
    {
      name: storeKey, // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
))
export default usePianoPicker
