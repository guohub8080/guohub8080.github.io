export type RGBA = { r: number; g: number; b: number; a: number };
export type HSLA = { h: number; s: number; l: number; a: number };
export type OKLCH = { mode: 'oklch'; l: number; c: number; h: number; alpha?: number };

import { converter, parse as culoriParse, formatCss as culoriFormatCss } from "culori";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function parseHexColor(input: string): RGBA | null {
  const hex = input.trim().replace(/^#/, "").toLowerCase();
  const valid = /^[0-9a-f]{3,8}$/.test(hex);
  if (!valid) return null;

  let r = 0, g = 0, b = 0, a = 255;
  if (hex.length === 3 || hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    if (hex.length === 4) a = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    if (hex.length === 8) a = parseInt(hex.slice(6, 8), 16);
  } else {
    return null;
  }
  return { r, g, b, a };
}

export function toHex({ r, g, b, a }: RGBA, includeAlpha = true): string {
  const rh = r.toString(16).padStart(2, "0");
  const gh = g.toString(16).padStart(2, "0");
  const bh = b.toString(16).padStart(2, "0");
  const ah = a.toString(16).padStart(2, "0");
  return "#" + rh + gh + bh + (includeAlpha ? ah : "");
}

export function rgbaToHsla({ r, g, b, a }: RGBA): HSLA {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r1) h = ((g1 - b1) / delta) % 6;
    else if (max === g1) h = (b1 - r1) / delta + 2;
    else h = (r1 - g1) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: Math.round((a / 255) * 100) / 100,
  };
}

export function hslaToRgba({ h, s, l, a }: HSLA): RGBA {
  const s1 = clamp(s, 0, 100) / 100;
  const l1 = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h >= 0 && h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a: Math.round(clamp(a, 0, 1) * 255),
  };
}

export function rgbaToCss({ r, g, b, a }: RGBA): string {
  const alpha = Math.round((a / 255) * 100) / 100;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// OKLCH helpers (via culori)
const toOklch = converter<OKLCH>("oklch");
const toRgb = converter("rgb");

export function rgbaToOklch(rgba: RGBA): OKLCH {
  const css = rgbaToCss(rgba);
  const parsed = culoriParse(css);
  const oklch = toOklch(parsed as any) as OKLCH;
  return oklch;
}

export function oklchToRgba(oklch: OKLCH): RGBA {
  const rgb = toRgb(oklch as any) as any;
  // culori rgb is { r: 0..1, g: 0..1, b: 0..1, alpha? }
  const a = rgb.alpha == null ? 1 : rgb.alpha;
  return {
    r: Math.round(clamp(rgb.r, 0, 1) * 255),
    g: Math.round(clamp(rgb.g, 0, 1) * 255),
    b: Math.round(clamp(rgb.b, 0, 1) * 255),
    a: Math.round(clamp(a, 0, 1) * 255),
  };
}

export function formatOklch(ok: OKLCH): string {
  // culori formatCss supports OKLCH
  return culoriFormatCss(ok as any);
}

// -------- Universal detector --------
export type DetectedKind = 'hex' | 'rgb' | 'rgba' | 'hsla' | 'oklch' | 'unknown';

function parseRgbLike(input: string): RGBA | null {
  const normalized = input
    .trim()
    .replace(/，/g, ",")
    .replace(/[()]/g, "")
    .replace(/^rgba?\s*/i, "")
    .replace(/\s+/g, "");
  const parts = normalized.split(",");
  if (parts.length !== 3 && parts.length !== 4) return null;
  const nums = parts.map((p) => p.trim());
  const to255 = (v: string) => {
    if (v.endsWith("%")) {
      const n = parseFloat(v);
      if (isNaN(n)) return null;
      return clamp(Math.round((n / 100) * 255), 0, 255);
    }
    const n = parseFloat(v);
    if (isNaN(n)) return null;
    return clamp(Math.round(n), 0, 255);
  };
  const r = to255(nums[0]); if (r == null) return null;
  const g = to255(nums[1]); if (g == null) return null;
  const b = to255(nums[2]); if (b == null) return null;
  let a = 255;
  if (nums.length === 4) {
    const av = nums[3];
    if (av.endsWith("%")) {
      const n = parseFloat(av);
      if (!isNaN(n)) a = clamp(Math.round((n / 100) * 255), 0, 255);
    } else {
      const n = parseFloat(av);
      if (!isNaN(n)) {
        a = n <= 1 ? clamp(Math.round(n * 255), 0, 255) : clamp(Math.round(n), 0, 255);
      }
    }
  }
  return { r, g, b, a };
}

export function detectAndParseColor(input: string): { rgba: RGBA | null; kind: DetectedKind } {
  const raw = (input || "").trim();
  if (!raw) return { rgba: null, kind: 'unknown' };

  // HEX (# optional)
  const hexMatch = raw.replace(/^#/, "");
  if (/^[0-9a-fA-F]{3,8}$/.test(hexMatch)) {
    const rgba = parseHexColor(hexMatch);
    return { rgba, kind: rgba && (hexMatch.length === 6 || hexMatch.length === 3) ? 'hex' : 'hex' };
  }

  // RGB / RGBA (supports Chinese commas, no parens)
  const rgb = parseRgbLike(raw);
  if (rgb) {
    return { rgba: rgb, kind: rgb.a === 255 ? 'rgb' : 'rgba' };
  }

  // HSLA or OKLCH via culori as a fallback
  try {
    const parsed = culoriParse(raw);
    if (parsed) {
      const rgbObj = toRgb(parsed as any) as any;
      if (rgbObj && typeof rgbObj.r === "number" && typeof rgbObj.g === "number" && typeof rgbObj.b === "number") {
        const a = rgbObj.alpha == null ? 1 : rgbObj.alpha;
        const rgba: RGBA = {
          r: Math.round(clamp(rgbObj.r, 0, 1) * 255),
          g: Math.round(clamp(rgbObj.g, 0, 1) * 255),
          b: Math.round(clamp(rgbObj.b, 0, 1) * 255),
          a: Math.round(clamp(a, 0, 1) * 255),
        };
        // best-effort kind inference
        const lower = raw.toLowerCase();
        let kind: DetectedKind = 'unknown';
        if (lower.startsWith("hsl")) kind = 'hsla';
        else if (lower.startsWith("oklch")) kind = 'oklch';
        return { rgba, kind };
      }
    }
  } catch {}

  return { rgba: null, kind: 'unknown' };
}

