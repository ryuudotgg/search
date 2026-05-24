import type { CSSProperties } from "react";

export interface CrossProps {
  /** Grid cell position. Sets `--cross-row` / `--cross-column`. */
  row?: number | string;
  column?: number | string;
  /** Responsive overrides for `--cross-column`. */
  smColumn?: number | string;
  smdColumn?: number | string;
  mdColumn?: number | string;
  /**
   * Absolute corner positioning. Use when the cross sits on the outer frame of a
   * non-grid container — it bypasses `--cross-row` / `--cross-column` entirely.
   */
  corner?: "tl" | "tr" | "bl" | "br";
}

const cornerInset: Record<NonNullable<CrossProps["corner"]>, CSSProperties> = {
  tl: {
    inset: "auto",
    top: "calc(var(--cross-half-size) * -1)",
    left: "calc(var(--cross-half-size) * -1)",
  },
  tr: {
    inset: "auto",
    top: "calc(var(--cross-half-size) * -1)",
    right: "calc(var(--cross-size) / 2)",
  },
  bl: {
    inset: "auto",
    bottom: "calc(var(--cross-size) / 2)",
    left: "calc(var(--cross-half-size) * -1)",
  },
  br: {
    inset: "auto",
    bottom: "calc(var(--cross-size) / 2)",
    right: "calc(var(--cross-size) / 2)",
  },
};

export function Cross({ row, column, smColumn, smdColumn, mdColumn, corner }: CrossProps) {
  const style = {
    ...(row !== undefined && { "--cross-row": row }),
    ...(column !== undefined && { "--cross-column": column }),
    ...(smColumn !== undefined && { "--sm-cross-column": smColumn }),
    ...(smdColumn !== undefined && { "--smd-cross-column": smdColumn }),
    ...(mdColumn !== undefined && { "--md-cross-column": mdColumn }),
    ...(corner && cornerInset[corner]),
  } as CSSProperties;

  return (
    <div className="grid-cross" style={style} aria-hidden>
      <div
        className="grid-crossline"
        style={{
          width: "var(--cross-half-size)",
          height: "var(--cross-size)",
          borderRightWidth: "1px",
        }}
      />
      <div
        className="grid-crossline"
        style={{
          width: "var(--cross-size)",
          height: "var(--cross-half-size)",
          borderBottomWidth: "1px",
        }}
      />
    </div>
  );
}
