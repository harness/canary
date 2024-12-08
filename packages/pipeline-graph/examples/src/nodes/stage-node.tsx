import {
  LeafNodeInternalType,
  SerialNodeInternalType,
} from "../../types/nodes-internal";

export interface StageNodeContentType {
  yamlPath: string;
  name: string;
  icon?: React.ReactElement;
}

export function SerialGroupNodeContent(props: {
  node: SerialNodeInternalType<StageNodeContentType>;
  children: React.ReactElement;
  // padding: { top: number; left: number; bottom: number; right: number };
}) {
  const { node, children } = props;

  return (
    <div
      style={
        {
          // position: "absolute",
          // inset: 0,
        }
      }
    >
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          left: "0px",
          height: "36px",
          wordBreak: "break-all",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "rgb(153,153,153)",
            margin: "10px",
            display: "inline-block",
            lineHeight: "12px",
            fontSize: "12px",
            paddingLeft: "30px",
          }}
        >
          Stage - {node.path} ({node.children.length})
        </span>
      </div>
      {children}
    </div>
  );
}
