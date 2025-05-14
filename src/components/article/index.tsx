import "./styles/index.css";

import type { ReactNode } from "react";

interface Props {
  title: string;
  lastUpdatedAt: Date;
  children: ReactNode;
}

export default function Article({ title, lastUpdatedAt, children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="before:border-border relative mt-[1px] ml-[1px] flex max-w-[1080px] min-w-[250px] flex-col before:pointer-events-none before:absolute before:inset-0 before:-top-[1px] before:-left-[1px] before:border before:border-solid">
        <main
          className="grid"
          style={
            {
              "--grid-rows": 1,
              "--sm-grid-columns": 8,
              "--smd-grid-columns": 10,
              "--md-grid-columns": 12,
              "--sm-height":
                "calc(var(--width) / var(--grid-columns) * var(--grid-rows))",
            } as React.CSSProperties
          }
        >
          <div
            className="grid-cross"
            style={
              { "--cross-row": 1, "--cross-column": 1 } as React.CSSProperties
            }
          >
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
              } as React.CSSProperties
            }
          />
        </main>
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
                className="text-wrapper text-foreground text-center font-semibold"
                style={
                  {
                    textWrap: "balance",
                    "--sm-text-size": "1.5rem",
                    "--sm-text-line-height": "2rem",
                    "--sm-text-letter-spacing": "-0.96px",
                    "--md-text-size": "2rem",
                    "--md-text-line-height": "2.5rem",
                    "--md-text-letter-spacing": "-1.28px",
                    "--lg-text-size": "3.5rem",
                    "--lg-text-line-height": "3.5rem",
                    "--lg-text-letter-spacing": "-3.36px",
                    padding: "0px",
                  } as React.CSSProperties
                }
              >
                {title}
              </h1>
            </div>
          </div>
        </section>
        <div className="overflow-visible">
          <section
            className="grid"
            style={
              {
                "--grid-rows": 1,
                "--sm-grid-columns": 8,
                "--smd-grid-columns": 10,
                "--md-grid-columns": 12,
                "--sm-height":
                  "calc(var(--width) / var(--grid-columns) * var(--grid-rows))",
              } as React.CSSProperties
            }
          >
            <div
              className="grid-block sm:border-border border-0 sm:border-x sm:border-solid"
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
                } as React.CSSProperties
              }
            >
              <div className="flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-sm font-normal">
                  Last Updated{" "}
                  {lastUpdatedAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
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
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
