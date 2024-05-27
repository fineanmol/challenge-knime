import {
  FlowEdge,
  WorkflowNodeData,
  WorkflowNode,
  WorkflowGraph,
} from "../types/dataTypes";

const CANVAS_NODE_DIMENSIONS = {
  width: 200,
  descriptionOffsetY: 180,
  imageOffsetY: 40,
  imageWidth: 101,
  imageHeight: 104,
  inputFromTheImageOffsetY: new Map([
    [1, 11],
    [2, 32],
    [3, 53],
  ]),
  imageDimensions: {
    offsetBoxX: 19,
    widthBox: 64,
    heightBox: 64,
  },
};

const CANVAS_NODE_FONTS = {
  nameFont: "20px san-serif",
  descriptionFont: "20px san-serif",
};

export const isPointInsideNode = (opts: {
  canvas: HTMLCanvasElement;
  point: {
    x: number;
    y: number;
  };
  node: WorkflowNode;
}): boolean => {
  const { canvas, node, point } = opts;
  const offsetFromBorderToImageX =
    (CANVAS_NODE_DIMENSIONS.width - CANVAS_NODE_DIMENSIONS.imageWidth) / 2;
  const nodeBoxImageLeftX =
    canvas.offsetLeft +
    node.data.startingPointX +
    offsetFromBorderToImageX +
    CANVAS_NODE_DIMENSIONS.imageDimensions.offsetBoxX;
  const nodeBoxImageRightX =
    nodeBoxImageLeftX + CANVAS_NODE_DIMENSIONS.imageDimensions.widthBox;

  const nodeBoxImageTopY =
    node.data.startingPointY +
    CANVAS_NODE_DIMENSIONS.imageOffsetY +
    canvas.offsetTop;
  const nodeBoxImageBottomY =
    nodeBoxImageTopY + CANVAS_NODE_DIMENSIONS.imageDimensions.heightBox;

  if (
    point.x <= nodeBoxImageRightX &&
    point.x >= nodeBoxImageLeftX &&
    point.y >= nodeBoxImageTopY &&
    point.y <= nodeBoxImageBottomY
  ) {
    return true;
  }
  return false;
};

export const getNodeIdByPointInside = (opts: {
  canvas: HTMLCanvasElement;
  point: {
    x: number;
    y: number;
  };
  nodes: WorkflowNode[];
}): number | null => {
  const { canvas, point, nodes } = opts;
  for (const node of nodes) {
    if (isPointInsideNode({ canvas, point, node })) {
      console.log(node.id);
      return node.id;
    }
  }
  return null;
};

export const drawNodeWithLoadedImage = (opts: {
  context: CanvasRenderingContext2D;
  nodeData: WorkflowNodeData;
  loadedImage: HTMLImageElement;
}) => {
  const { context, nodeData, loadedImage } = opts;

  const { name, description, startingPointX, startingPointY } = nodeData;

  context.font = CANVAS_NODE_FONTS.nameFont;

  const nameTextWidth = context.measureText(name).width;
  const descriptionTextWidth = context.measureText(description).width;

  context.drawImage(
    loadedImage,
    startingPointX +
      (CANVAS_NODE_DIMENSIONS.width - CANVAS_NODE_DIMENSIONS.imageWidth) / 2,
    startingPointY + CANVAS_NODE_DIMENSIONS.imageOffsetY,
    CANVAS_NODE_DIMENSIONS.imageWidth,
    CANVAS_NODE_DIMENSIONS.imageHeight
  );
  context.fillText(
    name,
    startingPointX + CANVAS_NODE_DIMENSIONS.width / 2 - nameTextWidth / 2,
    startingPointY
  );

  context.font = context.font = CANVAS_NODE_FONTS.descriptionFont;

  context.fillText(
    description,
    startingPointX +
      CANVAS_NODE_DIMENSIONS.width / 2 -
      descriptionTextWidth / 2,
    startingPointY + CANVAS_NODE_DIMENSIONS.descriptionOffsetY
  );
};

export const drawWorkflowInCanvas = (opts: {
  context: CanvasRenderingContext2D;
  workflow: WorkflowGraph;
  canvas: HTMLCanvasElement;
}) => {
  const { context, workflow, canvas } = opts;
  const { nodes, edges } = workflow;
  let loadedImages = 0;
  const imgs: HTMLImageElement[] = [];
  const images = nodes.map((it) => it.data.image);
  for (const image of images) {
    const img = new Image();
    img.src = image;
    imgs.push(img);
    img.onload = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < nodes.length; i++) {
          drawNodeWithLoadedImage({
            context,
            nodeData: nodes[i].data,
            loadedImage: imgs[i],
          });
        }
        for (const edge of edges) {
          drawEdge({ context, nodes, edge });
        }
      }
    };
  }
};

export const drawEdge = (opts: {
  context: CanvasRenderingContext2D;
  nodes: WorkflowNode[];
  edge: FlowEdge;
}) => {
  const { context, nodes, edge } = opts;
  context.beginPath();
  const fromNode = nodes.find((it) => it.id === edge.fromNodeId);
  const toNode = nodes.find((it) => it.id === edge.toNodeId);

  if (!fromNode || !toNode) {
    // todo handle error
    return;
  }

  if (
    CANVAS_NODE_DIMENSIONS.inputFromTheImageOffsetY.get(
      edge.fromInputNumber
    ) === undefined ||
    CANVAS_NODE_DIMENSIONS.inputFromTheImageOffsetY.get(edge.toInputNumber) ===
      undefined
  ) {
    return;
  }

  const offsetFromBorderToImageX =
    (CANVAS_NODE_DIMENSIONS.width - CANVAS_NODE_DIMENSIONS.imageWidth) / 2;

  const arrowStartX =
    fromNode.data.startingPointX +
    offsetFromBorderToImageX +
    CANVAS_NODE_DIMENSIONS.imageWidth;
  const arrowStartY =
    fromNode.data.startingPointY +
    CANVAS_NODE_DIMENSIONS.imageOffsetY +
    CANVAS_NODE_DIMENSIONS.inputFromTheImageOffsetY.get(edge.fromInputNumber)!;

  const arrowEndX = toNode.data.startingPointX + offsetFromBorderToImageX;
  const arrowEndY =
    toNode.data.startingPointY +
    CANVAS_NODE_DIMENSIONS.imageOffsetY +
    CANVAS_NODE_DIMENSIONS.inputFromTheImageOffsetY.get(edge.toInputNumber)!;

  const arrowCenterPointX = arrowStartX + (arrowEndX - arrowStartX) / 2;
  const arrowCenterPointY = arrowStartY + (arrowEndY - arrowStartY) / 2;

  const controlPointOffset = (arrowEndX - arrowStartX) / 4;

  context.moveTo(arrowStartX, arrowStartY);

  context.quadraticCurveTo(
    arrowCenterPointX - controlPointOffset,
    arrowStartY,
    arrowCenterPointX,
    arrowCenterPointY
  );

  context.moveTo(arrowCenterPointX, arrowCenterPointY);

  context.quadraticCurveTo(
    arrowCenterPointX + controlPointOffset,
    arrowEndY,
    arrowEndX,
    arrowEndY
  );

  context.stroke();
};
