import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { workflowMock } from '../dataMock';
import { StartingPoint, WorkflowBlock, WorkflowGraph, WorkflowNode, UpdateNodePositionData } from '../types/dataTypes';

interface WorkflowState {
  workflowGraph: WorkflowGraph;
}

const initialState: WorkflowState = {
  workflowGraph: { nodes: [], edges: [] },
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    updateWorkflow(state, action: PayloadAction<WorkflowGraph>) {
      state.workflowGraph = action.payload;
    },
    updateNodeStartingPoint(state, action: PayloadAction<UpdateNodePositionData>) {
      const nodeData = state.workflowGraph.nodes.find(node => node.id === action.payload.id)?.data;
      if (nodeData) {
        nodeData.startingPointX = action.payload.startingPointX;
        nodeData.startingPointY = action.payload.startingPointY;
      }
    },
    addNode(state, action: PayloadAction<WorkflowNode>) {
      state.workflowGraph.nodes.push(action.payload);
    },
  },
});

export const { updateWorkflow, updateNodeStartingPoint, addNode } = workflowSlice.actions;

export const fetchWorkflow = () => (dispatch: any) => {
  // Simulating an API call here, you can replace this with actual API call
  dispatch(updateWorkflow(workflowMock));
};

export const addBlock = (workflowBlock: WorkflowBlock) => (dispatch: any, getState: any) => {
  const { workflow } = getState();
  const state: WorkflowState = workflow;

  // Logic for adding id and position
  let nodeId = 1;
  let startingPointY = 50;
  let startingPointX = 50;
  if (state.workflowGraph.nodes.length) {
    nodeId = Math.max(...state.workflowGraph.nodes.map(node => node.id)) + 1;
    startingPointY = Math.max(
      ...state.workflowGraph.nodes.map(node => node.data.startingPointY)
    );
    startingPointX = Math.max(
      ...state.workflowGraph.nodes
        .filter(node => node.data.startingPointY === startingPointY)
        .map(node => node.data.startingPointX)
    ) + 200;
  }
  if (startingPointX > 1000) {
    startingPointX = 50;
    startingPointY += 250;
  }

  dispatch(addNode({
    id: nodeId,
    data: { ...workflowBlock, startingPointX, startingPointY },
  }));
};

export default workflowSlice.reducer;
