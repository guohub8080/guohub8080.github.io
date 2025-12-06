import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HSLA, RGBA, oklchToRgba, parseHexColor, rgbaToCss, rgbaToHsla, toHex, rgbaToOklch, formatOklch, detectAndParseColor, DetectedKind } from "../utils/color.ts";

export function useQueryParams() {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
}

export function useColorState() {
  const query = useQueryParams();
  const navigate = useNavigate();

  const defaultHex = (query.get("color") || "f44d0dff").replace(/^#/, "");
  const [hex, setHex] = useState<string>(defaultHex);
  const [detectedKind, setDetectedKind] = useState<DetectedKind>('hex');
  const [universalInput, setUniversalInput] = useState<string>("");

  const rgba = useMemo<RGBA | null>(() => parseHexColor(hex), [hex]);
  const hsla = useMemo<HSLA | null>(() => (rgba ? rgbaToHsla(rgba) : null), [rgba]);
  const oklch = useMemo(() => (rgba ? rgbaToOklch(rgba) : null), [rgba]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("format", "hex");
    params.set("color", hex);
    navigate({ search: params.toString() }, { replace: true });
  }, [hex, navigate]);

  const displayHex = rgba ? toHex(rgba, true) : "";
  const displayRgba = rgba ? rgbaToCss(rgba) : "";
  const displayHsla = hsla ? `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})` : "";
  const displayOklch = oklch ? formatOklch(oklch) : "";

  const invalid = rgba == null;

  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickWithInput = () => {
    colorInputRef.current?.click();
  };

  const handlePickWithEyedropper = async () => {
    try {
      // @ts-expect-error: Eyedropper not in TS lib yet for all targets
      if (window.EyeDropper) {
        // @ts-expect-error
        const eye = new window.EyeDropper();
        const res = await eye.open();
        // res.sRGBHex is like #RRGGBB
        const picked = res.sRGBHex.replace(/^#/, "");
        setHex(picked + "ff"); // default opaque alpha
        toast.success("已从屏幕取色");
      } else if (navigator.clipboard && 'permissions' in navigator) {
        toast.error("当前浏览器不支持取色器");
      } else {
        toast.error("取色器不可用");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        toast.error("取色失败");
      }
    }
  };

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  };

  const handleNativeColorChange = (val: string) => {
    // val is #rrggbb from <input type="color">
    const v = val.replace(/^#/, "");
    setHex(v + "ff");
  };

  const recognizeUniversalInput = () => {
    const { rgba, kind } = detectAndParseColor(universalInput);
    if (!rgba) {
      toast.error("无法识别该颜色格式");
      return;
    }
    setDetectedKind(kind);
    setHex(toHex(rgba, true).replace(/^#/, ""));
    toast.success(`识别为 ${kind.toUpperCase()}`);
  };

  return {
    hex,
    setHex,
    rgba,
    hsla,
    oklch,
    invalid,
    displayHex,
    displayRgba,
    displayHsla,
    displayOklch,
    handlePickWithEyedropper,
    handlePickWithInput,
    handleNativeColorChange,
    colorInputRef,
    copyValue,
    universalInput,
    setUniversalInput,
    detectedKind,
    recognizeUniversalInput,
  };
}


