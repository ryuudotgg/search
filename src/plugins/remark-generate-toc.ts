import { valueToEstree } from "estree-util-value-to-estree";
import type { TableOfContents } from "fumadocs-core/toc";
import type { Root } from "mdast";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export type MDXDepth = 1 | 2 | 3 | 4 | 5 | 6;

interface DirectiveResult {
  id: string;
  index: string;
  text: string;
  depth: MDXDepth;
}

function visitCallback(node: Record<string, unknown>): DirectiveResult | undefined {
  if (!node.attributes) return;
  if (typeof node.attributes !== "object") return;

  const attrs = node.attributes as Record<string, unknown>;
  if (!("id" in attrs)) return;
  if (!("index" in attrs)) return;
  if (!("text" in attrs)) return;

  const id = String(attrs.id);
  const index = String(attrs.index);
  const text = String(attrs.text);

  if (index === "0") return { id, index, text, depth: 2 };

  if (!("children" in node)) return { id, index, text, depth: 2 };
  if (!Array.isArray(node.children)) return { id, index, text, depth: 2 };

  let depth = (index.split(".").length + 1) as MDXDepth;
  if (depth > 4) depth = 4;

  delete attrs.id;
  const data = node.data as Record<string, unknown> | undefined;
  if (data?.hProperties && typeof data.hProperties === "object") {
    delete (data.hProperties as Record<string, unknown>).id;
  }

  node.children.unshift({
    type: "heading",
    depth,
    data: { hProperties: { id } },
    children: [
      {
        type: "text",
        value: `${index}${depth === 2 ? "." : ""} ${text}`,
      },
    ],
  });

  return { id, index, text, depth };
}

function buildTocExport(toc: TableOfContents): MdxjsEsm {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ExportNamedDeclaration",
            specifiers: [],
            source: null,
            attributes: [],
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name: "toc" },
                  init: valueToEstree(toc),
                },
              ],
            },
          },
        ],
      },
    },
  };
}

export const remarkGenerateToC: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const toc: TableOfContents = [];

    visit(tree, "containerDirective", (node) => {
      const result = visitCallback(node as unknown as Record<string, unknown>);
      if (!result) return;
      if (result.depth > 3) return;

      toc.push({
        title: result.text,
        url: `#${result.id}`,
        depth: result.depth,
      });
    });

    tree.children.unshift(buildTocExport(toc));

    return tree;
  };
};
