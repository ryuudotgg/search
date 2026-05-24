import { Link } from "@tanstack/react-router";
import type { MDXComponents } from "mdx/types";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

import { cn } from "~/lib/utils";
import type { MDXDepth } from "~/plugins/remark-generate-toc";
import { Cross } from "../cross";

export const components: MDXComponents = {
  block: (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    const row = (("index" in props && Number(props.index)) || 0) + 1;

    const depth =
      "index" in props &&
      typeof props.index === "string" &&
      ((props.index.split(".").length + 1) as MDXDepth);

    const isFirstBlock = "index" in props && props.index === "0";

    return (
      <>
        <div
          {...props}
          className={cn(
            "grid-block relative",
            depth === 2 &&
              "before:border-border before:absolute before:top-0 before:bottom-0 before:left-1/2 before:-z-10 before:-translate-x-1/2 before:border-l before:border-dashed",
            !isFirstBlock && "border-border border-t border-dashed",
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
        {depth === 2 && !isFirstBlock && (
          <>
            <Cross row={row} column={1} />
            <Cross row={row} smColumn={2} mdColumn={3} />
          </>
        )}
      </>
    );
  },
  list: (props) => <div {...props} className="ml-6" style={{ height: "auto" }} />,
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
      <strong className="text-foreground font-mono font-medium">{props.index}</strong>.{" "}
      {props.children}
    </p>
  ),
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="text-wrapper mb-6"
      style={
        {
          "--text-weight": "600",
          "--sm-text-size": "1.5rem",
          "--sm-text-line-height": "2rem",
          "--sm-text-letter-spacing": "-0.04em",
          "--md-text-size": "2rem",
          "--md-text-line-height": "2.5rem",
          "--md-text-letter-spacing": "-0.04em",
          "--lg-text-size": "2rem",
          "--lg-text-line-height": "2.5rem",
          "--lg-text-letter-spacing": "-0.04em",
        } as React.CSSProperties
      }
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className="text-wrapper mb-6"
      style={
        {
          "--text-weight": "600",
          "--sm-text-size": "1.25rem",
          "--sm-text-line-height": "1.5rem",
          "--sm-text-letter-spacing": "-0.04em",
          "--md-text-size": "1.5rem",
          "--md-text-line-height": "2rem",
          "--md-text-letter-spacing": "-0.04em",
          "--lg-text-size": "1.5rem",
          "--lg-text-line-height": "2rem",
          "--lg-text-letter-spacing": "-0.04em",
        } as React.CSSProperties
      }
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
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
    >
      {children}
    </h4>
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
  strong: (props) => <strong {...props} className="text-foreground font-medium" />,
  a: ({ href, ...props }) => <Link to={href} {...props} className="text-link" />,
};
