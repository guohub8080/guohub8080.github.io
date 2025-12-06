import { round } from 'lodash'
import type { HotAreaConfig } from './types.ts'

/**
 * 热区辅助函数的输入参数
 */
export interface ViewBoxSize {
    viewBoxW: number
    viewBoxH: number
}

/**
 * 保留6位小数精度（如果是小数）
 */
function toPrecision(value: number): number {
    return round(value, 6)
}

/**
 * 获取全屏热区配置
 */
export function getFullScreenHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: 0,
        y: 0,
        w: toPrecision(size.viewBoxW),
        h: toPrecision(size.viewBoxH),
    }
}

/**
 * 无热区
 * @param size
 * @returns 
 */
export function getNullHotArea(): HotAreaConfig {
    return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    }
}

/**
 * 获取左半屏热区配置
 */
export function getLeftHalfHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: 0,
        y: 0,
        w: toPrecision(size.viewBoxW / 2),
        h: toPrecision(size.viewBoxH),
    }
}

/**
 * 获取右半屏热区配置
 */
export function getRightHalfHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: toPrecision(size.viewBoxW / 2),
        y: 0,
        w: toPrecision(size.viewBoxW / 2),
        h: toPrecision(size.viewBoxH),
    }
}

/**
 * 获取上半屏热区配置
 */
export function getTopHalfHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: 0,
        y: 0,
        w: toPrecision(size.viewBoxW),
        h: toPrecision(size.viewBoxH / 2),
    }
}

/**
 * 获取下半屏热区配置
 */
export function getBottomHalfHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: 0,
        y: toPrecision(size.viewBoxH / 2),
        w: toPrecision(size.viewBoxW),
        h: toPrecision(size.viewBoxH / 2),
    }
}

/**
 * 获取左上角热区配置（四分之一屏）
 */
export function getTopLeftHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: 0,
        y: 0,
        w: toPrecision(size.viewBoxW / 2),
        h: toPrecision(size.viewBoxH / 2),
    }
}

/**
 * 获取左下角热区配置（四分之一屏）
 */
export function getBottomLeftHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: 0,
        y: toPrecision(size.viewBoxH / 2),
        w: toPrecision(size.viewBoxW / 2),
        h: toPrecision(size.viewBoxH / 2),
    }
}

/**
 * 获取右上角热区配置（四分之一屏）
 */
export function getTopRightHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: toPrecision(size.viewBoxW / 2),
        y: 0,
        w: toPrecision(size.viewBoxW / 2),
        h: toPrecision(size.viewBoxH / 2),
    }
}

/**
 * 获取右下角热区配置（四分之一屏）
 */
export function getBottomRightHotArea(size: ViewBoxSize): HotAreaConfig {
    return {
        x: toPrecision(size.viewBoxW / 2),
        y: toPrecision(size.viewBoxH / 2),
        w: toPrecision(size.viewBoxW / 2),
        h: toPrecision(size.viewBoxH / 2),
    }
}

