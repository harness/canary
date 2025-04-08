interface Node {
  type: string;
  children?: Node[];
  position?: unknown;
}

interface Element extends Node {
  type: "element";
  tagName: string;
  properties?: {
    className?: string | string[];
    [key: string]: unknown;
  };
  children: Node[];
}

export function wrapCodeBlocks() {
  return (tree: Node) => {
    processNodes(tree);
  };
}

function processNodes(node: Node): void {
  if (!node || !Array.isArray(node.children)) return;

  node.children = node.children.map((child: Node) => {
    if (isCodeBlock(child)) {
      return {
        type: "element",
        tagName: "div",
        properties: { className: ["dark", "dark-std-std"] },
        children: [child],
      };
    }

    processNodes(child);

    return child;
  });
}
function isElement(node: Node): node is Element {
  return node.type === "element" && "tagName" in node;
}

function isCodeBlock(node: Node): boolean {
  if (!isElement(node) || node.tagName !== "pre") return false;

  const firstChild = node.children?.[0];
  return isElement(firstChild) && firstChild.tagName === "code";
}
