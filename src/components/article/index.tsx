import "./styles/index.css";

import { AnchorProvider, type TableOfContents } from "fumadocs-core/toc";
import { type ReactNode, useRef } from "react";

import { Cross } from "../cross";
import Toc from "./toc";

interface Props {
  title: string;
  lastUpdatedAt: Date;
  toc: TableOfContents;
  children: ReactNode;
}

export default function Article({ title, lastUpdatedAt, toc, children }: Props) {
  const tocRef = useRef<HTMLDivElement>(null);

  const y = lastUpdatedAt.getFullYear();
  const m = String(lastUpdatedAt.getMonth() + 1).padStart(2, "0");
  const d = String(lastUpdatedAt.getDate()).padStart(2, "0");
  const isoDate = `${y}.${m}.${d}`;

  return (
    <AnchorProvider toc={toc}>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="article-frame border-border relative flex max-w-[1080px] min-w-[250px] flex-col border border-solid">
          <Cross corner="tl" />
          <Cross corner="bl" />
          <Cross corner="br" />
          <div
            aria-hidden
            className="text-muted-foreground/70 pointer-events-none absolute top-3 right-4 text-right font-mono text-[10px] leading-normal tracking-[0.12em] uppercase"
          >
            <div>Doc · Privacy-Notice</div>
            <div>Rev · {isoDate}</div>
          </div>

          <main
            className="grid"
            style={
              {
                "--grid-rows": 1,
                "--sm-grid-columns": 8,
                "--smd-grid-columns": 10,
                "--md-grid-columns": 12,
                "--sm-height": "calc(var(--width) / var(--grid-columns) * var(--grid-rows))",
                minHeight: 54,
              } as React.CSSProperties
            }
          />
          <section
            className="grid"
            style={
              {
                "--grid-rows": 1,
                "--sm-grid-columns": 8,
                "--smd-grid-columns": 10,
                "--md-grid-columns": 12,
                "--sm-height": "fit-content",
              } as React.CSSProperties
            }
          >
            <div
              className="grid-block"
              style={
                {
                  "--sm-grid-row": "1 / span 1",
                  "--sm-grid-column": "1 / 9",
                  "--smd-grid-column": "2 / 10",
                  "--md-grid-column": "2 / 12",
                  "--sm-cell-rows": 1,
                  "--sm-cell-columns": 8,
                  "--smd-cell-columns": 8,
                  "--md-cell-columns": 10,
                } as React.CSSProperties
              }
            >
              <div className="flex flex-col items-center justify-center">
                <h1
                  className="text-wrapper text-foreground text-center"
                  style={
                    {
                      textWrap: "balance",
                      "--text-weight": "600",
                      "--sm-text-size": "1.5rem",
                      "--sm-text-line-height": "2rem",
                      "--sm-text-letter-spacing": "-0.04em",
                      "--md-text-size": "2rem",
                      "--md-text-line-height": "2.5rem",
                      "--md-text-letter-spacing": "-0.04em",
                      "--lg-text-size": "3.5rem",
                      "--lg-text-line-height": "3.5rem",
                      "--lg-text-letter-spacing": "-0.06em",
                      padding: "0px",
                    } as React.CSSProperties
                  }
                >
                  {title}
                </h1>
              </div>
            </div>
          </section>
          <section
            className="grid"
            style={
              {
                "--grid-rows": 1,
                "--sm-grid-columns": 8,
                "--smd-grid-columns": 10,
                "--md-grid-columns": 12,
                "--sm-height": "calc(var(--width) / var(--grid-columns) * var(--grid-rows))",
                minHeight: 54,
              } as React.CSSProperties
            }
          >
            <div
              className="grid-block"
              style={
                {
                  "--sm-grid-row": "1 / span 1",
                  "--xs-grid-column": "1 / 9",
                  "--sm-grid-column": "2 / 8",
                  "--smd-grid-column": "2 / 10",
                  "--md-grid-column": "2 / 12",
                  "--sm-cell-rows": 1,
                  "--xs-cell-columns": 8,
                  "--sm-cell-columns": 6,
                  "--smd-cell-columns": 8,
                  "--md-cell-columns": 10,
                  padding: "0px",
                  minHeight: 54,
                } as React.CSSProperties
              }
            >
              <div className="flex flex-col items-center justify-center">
                <p className="text-muted-foreground font-mono text-xs tracking-[0.12em] uppercase">
                  Last Updated · {isoDate}
                </p>
              </div>
            </div>
          </section>
          <section
            className="grid"
            style={
              {
                "--grid-rows": 23,
                "--sm-grid-columns": 2,
                "--md-grid-columns": 3,
                "--sm-height": "fit-content",
              } as React.CSSProperties
            }
          >
            <div
              className="grid-block border-border border-l border-dashed"
              style={
                {
                  "--sm-grid-row": `1 / ${toc.length + 1}`,
                  "--sm-grid-column": 3,
                  "--sm-cell-rows": toc.length + 1,
                  padding: "0px",
                  overflow: "visible",
                } as React.CSSProperties
              }
            >
              <Toc toc={toc} containerRef={tocRef} />
            </div>
            {children}
          </section>
        </div>
      </div>
    </AnchorProvider>
  );
}
