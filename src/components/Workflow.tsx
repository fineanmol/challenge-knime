import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  drawWorkflowInCanvas,
  getNodeIdByPointInside,
} from "../helpers/canvasHelper";
import { fetchWorkflow, updateNodeStartingPoint } from "../store/workflow";
import { UpdateNodePositionData } from "../types/dataTypes";

const Workflow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [dragStartingPoint, setDragStartingPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dispatch = useDispatch();
  const workflowGraph = useSelector(
    (state: RootState) => state.workflow.workflowGraph
  );

  useEffect(() => {
    dispatch(fetchWorkflow());
  }, [dispatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      const nodeId = getNodeIdByPointInside({
        canvas,
        point: { x: event.clientX, y: event.clientY },
        nodes: workflowGraph.nodes,
      });
      if (nodeId) {
        setIsDragging(true);
        setActiveNodeId(nodeId);
        setDragStartingPoint({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      if (isDragging) {
        setIsDragging(false);
        setActiveNodeId(null);
        setDragStartingPoint(null);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (isDragging && activeNodeId !== null && dragStartingPoint !== null) {
        const activeGraphNode = workflowGraph.nodes.find(
          (node) => node.id === activeNodeId
        );
        if (!activeGraphNode?.data) return;

        const updateNodePositionData: UpdateNodePositionData = {
          id: activeNodeId,
          startingPointX: activeGraphNode.data.startingPointX,
          startingPointY: activeGraphNode.data.startingPointY,
        };

        const deltaX = event.clientX - dragStartingPoint.x;
        const deltaY = event.clientY - dragStartingPoint.y;
        updateNodePositionData.startingPointX += deltaX;
        updateNodePositionData.startingPointY += deltaY;
        setDragStartingPoint({ x: event.clientX, y: event.clientY });

        dispatch(updateNodeStartingPoint(updateNodePositionData));
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [workflowGraph, isDragging, activeNodeId, dragStartingPoint, dispatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    drawWorkflowInCanvas({ context, canvas, workflow: workflowGraph });
  }, [workflowGraph]);

  return (
    <canvas
      ref={canvasRef}
      width="1400"
      height="1400"
      className="border border-solid absolute top-[120px] left-0"
    ></canvas>
  );
};

export default Workflow;
