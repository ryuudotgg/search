import { Link } from "@tanstack/react-router";
import type { MDXComponents } from "mdx/types";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

import { cn } from "~/lib/utils";
import { type MDXDepth } from "~/plugins/remark-generate-toc";

export const components: MDXComponents = {
  toc: (props) => (
    <div
      {...props}
      className="grid-block"
      style={
        {
          "--sm-grid-row": `1 / ${Number(props.length) + 1}`,
          "--sm-grid-column": 3,
          "--sm-cell-rows": Number(props.length) + 1,
          padding: "0px",
          overflow: "visible",
        } as React.CSSProperties
      }
    />
  ),
  tocItem: (props) => (
    <Link
      {...props}
      hash={props.id}
      className="text-muted-foreground hover:text-foreground ml-3 block text-sm no-underline transition-colors duration-150 ease-in"
      style={{ marginLeft: `${props.level * 12}px` }}
    />
  ),
  block: (
    props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  ) => {
    const row = (("index" in props && Number(props.index)) || 0) + 1;

    const depth =
      "index" in props &&
      typeof props.index === "string" &&
      ((props.index.split(".").length + 1) as MDXDepth);

    return (
      <>
        <div
          {...props}
          className={cn(
            "grid-block relative",
            {
              "before:border-border before:absolute before:top-0 before:bottom-0 before:left-1/2 before:-z-10 before:-translate-x-1/2 before:border-l before:border-dashed":
                depth === 2,
            },
            {
              "border-border border-t border-dashed":
                !("index" in props) || props.index !== "0",
            }
          )}
          style={
            {
              "--sm-grid-row": `${row} / span 1`,
              "--sm-grid-column": "1 / 3",
              "--sm-cell-rows": 1,
              "--sm-cell-columns": 2,
            } as React.CSSProperties
          }
        />
        {depth === 2 && (
          <>
            <div
              className="grid-cross"
              style={
                {
                  "--cross-row": row,
                  "--cross-column": 1,
                } as React.CSSProperties
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
              className="grid-cross"
              style={
                {
                  "--cross-row": row,
                  "--sm-cross-column": 1,
                  "--md-cross-column": 3,
                } as React.CSSProperties
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
          </>
        )}
      </>
    );
  },
  list: (props) => (
    <div {...props} className="ml-6" style={{ height: "auto" }} />
  ),
  item: (props: { index: string; children: React.ReactNode }) => (
    <p
      {...props}
      className="text-wrapper text-muted-foreground mb-3"
      style={
        {
          "--text-size": "1rem",
          "--text-line-height": "1.5rem",
        } as React.CSSProperties
      }
    >
      <strong className="text-foreground font-medium">{props.index}</strong>.{" "}
      {props.children}
    </p>
  ),
  h2: (props) => (
    <h2
      {...props}
      className="text-wrapper mb-6"
      style={
        {
          "--text-weight": "600",
          "--sm-text-size": "1.5rem",
          "--sm-text-line-height": "2rem",
          "--sm-text-letter-spacing": "-0.029375rem",
          "--md-text-size": "2rem",
          "--md-text-line-height": "2.5rem",
          "--md-text-letter-spacing": "-0.049375rem",
          "--lg-text-size": "2rem",
          "--lg-text-line-height": "2.5rem",
          "--lg-text-letter-spacing": "-0.049375rem",
        } as React.CSSProperties
      }
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="text-wrapper mb-6"
      style={
        {
          "--text-weight": "600",
          "--sm-text-size": "1.25rem",
          "--sm-text-line-height": "1.5rem",
          "--sm-text-letter-spacing": "-0.020625rem",
          "--md-text-size": "1.5rem",
          "--md-text-line-height": "2rem",
          "--md-text-letter-spacing": "-0.029375rem",
          "--lg-text-size": "1.5rem",
          "--lg-text-line-height": "2rem",
          "--lg-text-letter-spacing": "-0.029375rem",
        } as React.CSSProperties
      }
    />
  ),
  h4: (props) => (
    <h4
      {...props}
      className="text-wrapper text-muted-foreground mb-6"
      style={
        {
          "--text-line-height": "1.5rem",
          "--sm-text-weight": "400",
          "--sm-text-size": "1rem",
          "--sm-text-letter-spacing": "initial",
          "--md-text-weight": "600",
          "--md-text-size": "1.25rem",
          "--md-text-letter-spacing": "-0.020625rem",
          "--lg-text-weight": "600",
          "--lg-text-size": "1.25rem",
          "--lg-text-letter-spacing": "-0.020625rem",
        } as React.CSSProperties
      }
    />
  ),
  p: (props) => (
    <p
      {...props}
      className="text-wrapper text-muted-foreground mb-3"
      style={
        {
          "--text-size": "1rem",
          "--text-line-height": "1.5rem",
        } as React.CSSProperties
      }
    />
  ),
  strong: (props) => (
    <strong {...props} className="text-foreground font-medium" />
  ),
  a: ({ href, ...props }) => (
    <Link to={href} {...props} className="text-link" />
  ),
};
