export type WorkflowNode = {
  id: number;
  data: WorkflowNodeData;
};

export type FlowEdge = {
  fromNodeId: number;
  fromInputNumber: number;
  toNodeId: number;
  toInputNumber: number;
};

export type WorkflowBlock = {
  name: string;
  description: string;
  image: string;
  inputs: number[];
  outputs: number[];
};

export type StartingPoint = {
  startingPointX: number;
  startingPointY: number;
};

export type WorkflowNodeData = WorkflowBlock & StartingPoint;

export type WorkflowGraph = {
  nodes: WorkflowNode[];
  edges: FlowEdge[];
};

export type UpdateNodePositionData = StartingPoint & { id: number };
