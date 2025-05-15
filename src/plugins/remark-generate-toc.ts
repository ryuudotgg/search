import type { BlockContent, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface Heading {
  id: string;
  index: string;
  text: string;
  children?: Heading[];
}

export type MDXDepth = 1 | 2 | 3 | 4 | 5 | 6;

function visitCallback(node: Record<string, unknown>) {
  if (!node.attributes) return;
  if (typeof node.attributes !== "object") return;

  if (!("id" in node.attributes)) return;
  if (!("index" in node.attributes)) return;
  if (!("text" in node.attributes)) return;

  const result = {
    id: String(node.attributes.id),
    index: String(node.attributes.index),
    text: String(node.attributes.text),
  };

  if (result.index === "0") return result;

  if (!("children" in node)) return result;
  if (!Array.isArray(node.children)) return result;

  let depth = (result.index.split(".").length + 1) as MDXDepth;
  if (depth > 4) depth = 4;

  node.children.unshift({
    type: "heading",
    depth,
    children: [
      {
        type: "text",
        value: `${result.index}${depth === 2 ? "." : ""} ${result.text}`,
      },
    ],
  });

  if (depth > 3) return;

  return result;
}

function createList(headings: Heading[], level = 0): BlockContent {
  return {
    type: "mdxJsxFlowElement",
    name: "ol",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "className",
        value: "mt-3 flex flex-col gap-3",
      },
    ],
    children: headings.map((heading) => {
      return {
        type: "mdxJsxFlowElement",
        name: "li",
        attributes: [],
        children: [
          {
            type: "containerDirective",
            name: "tocItem",
            data: { hName: "tocItem", hProperties: { id: heading.id, level } },
            children: [
              {
                type: "text",
                value: heading.text,
              } as unknown as BlockContent,
            ],
          },
          ...(heading.children?.length ? [createList(heading.children, level + 1)] : []),
        ],
      };
    }),
  };
}

export const remarkGenerateToC: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const headings: Heading[] = [];

    visit(tree, "containerDirective", (node) => {
      const result = visitCallback(node as unknown as Record<string, unknown>);

      if (result) {
        const parentIndex = result.index.split(".").slice(0, -1).join(".");
        const parent = headings.find((heading) => heading.index === parentIndex);

        if (parent) {
          parent.children ??= [];
          parent.children.push(result);
        } else headings.push(result);
      }
    });

    const toc = {
      type: "containerDirective",
      name: "toc",
      data: { hName: "toc", hProperties: { length: headings.length } },
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "className",
              value: "sticky top-4 h-full max-h-[calc(100svh-4rem)] overflow-y-scroll p-10 md:p-12",
            },
          ],
          children: [
            {
              type: "mdxJsxFlowElement",
              name: "div",
              attributes: [
                {
                  type: "mdxJsxAttribute",
                  name: "className",
                  value: "mb-[1.375rem] h-auto font-semibold",
                },
              ],
              children: [
                {
                  type: "text",
                  value: "On this page",
                } as unknown as BlockContent,
              ],
            },
            createList(headings),
          ],
        },
      ],
    } satisfies Root["children"][0];

    tree.children.unshift(toc);

    return tree;
  };
};
