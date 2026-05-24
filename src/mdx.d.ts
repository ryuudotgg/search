declare module "*.mdx" {
  import type { TableOfContents } from "fumadocs-core/toc";
  import type { Element, MDXProps } from "mdx/types";

  export const toc: TableOfContents;
  export default function MDXContent(props: MDXProps): Element;
}
