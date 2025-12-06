import React from "react";

interface ModesPanelProps {
  displayHex: string;
  displayRgba: string;
  displayHsla: string;
  displayOklch?: string;
  onCopy: (value: string) => void;
}

const formats: Array<{ label: string; description: string }> = [
  { label: "HEX", description: "Web 安全色值，支持透明度" },
  { label: "RGBA", description: "屏幕配色友好，含 Alpha" },
  { label: "HSLA", description: "便于调节色相、饱和度与亮度" },
  { label: "OKLCH", description: "感知均匀的现代色彩空间" },
];

const ModeCard: React.FC<{
  label: string;
  description: string;
  value: string;
  onCopy: (value: string) => void;
}> = ({ label, description, value, onCopy }) => {
  if (!value) return null;
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-foreground/5 opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex flex-col gap-4 p-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-xl border bg-muted/40 p-4 font-mono text-sm leading-tight text-foreground">
          {value}
        </div>
        <button
          className="self-start rounded-full border border-muted-foreground/30 px-4 py-1 text-xs font-medium uppercase tracking-[0.26em] text-muted-foreground transition hover:bg-foreground hover:text-background"
          onClick={() => onCopy(value)}
        >
          复制
        </button>
      </div>
    </div>
  );
};

export const ModesPanel: React.FC<ModesPanelProps> = ({
  displayHex,
  displayRgba,
  displayHsla,
  displayOklch,
  onCopy,
}) => {
  const values = [displayHex, displayRgba, displayHsla, displayOklch || ""];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold leading-tight">多色彩空间视图</h2>
          <p className="text-sm text-muted-foreground">
            快速复制你需要的格式，保持色彩语义与一致性。
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {formats.map((meta, index) => (
          <ModeCard
            key={meta.label}
            label={meta.label}
            description={meta.description}
            value={values[index]}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  );
};


