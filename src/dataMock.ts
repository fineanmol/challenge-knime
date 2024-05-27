export const workflowMock = {
  nodes: [
    {
      id: 1,
      data: {
        name: "Data generator",
        description: "Source",
        image: "./assets/data_generator.jpg",
        inputs: [],
        outputs: [1, 3],
        startingPointX: 50,
        startingPointY: 50,
      },
    },
    {
      id: 2,
      data: {
        name: "CASE Switch Data (Start)",
        description: "Manipulator",
        image: "assets/case_switch.jpg",
        inputs: [2],
        outputs: [1],
        startingPointX: 250,
        startingPointY: 50,
      },
    },
    {
      id: 3,
      data: {
        name: "Cluster Assigner",
        description: "Predictor",
        image: "assets/cluster_assigner.jpg",
        inputs: [1, 3],
        outputs: [2],
        startingPointX: 450,
        startingPointY: 50,
      },
    },
  ],
  edges: [
    {
      fromNodeId: 1,
      fromInputNumber: 1,
      toNodeId: 2,
      toInputNumber: 2,
    },
    {
      fromNodeId: 2,
      fromInputNumber: 1,
      toNodeId: 3,
      toInputNumber: 3,
    },
  ],
};

export const workflowBlocksMock = [
  {
    name: "Data generator",
    description: "Source",
    image: "assets/data_generator.jpg",
    inputs: [],
    outputs: [1, 3],
  },
  {
    name: "CASE Switch Data (Start)",
    description: "Manipulator",
    image: "assets/case_switch.jpg",
    inputs: [2],
    outputs: [1],
  },
  {
    name: "Cluster Assigner",
    description: "Predictor",
    image: "assets/cluster_assigner.jpg",
    inputs: [1, 3],
    outputs: [2],
  },
];
