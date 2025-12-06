export const NODE = "NODE";
export const STAGE_START = "STAGE_START";
export const STAGE_END = "STAGE_END";
export const STAGE_ERROR = "STAGE_ERROR";
export const STAGE_SUCCESS = "STAGE_SUCCESS";
export const STAGE_SKIP = "STAGE_SKIP";
export const AUTO_PROCESS = "AUTO_PROCESS";

export type CommonTagType = typeof NODE | typeof STAGE_START | typeof STAGE_END | typeof STAGE_ERROR | typeof STAGE_SUCCESS;