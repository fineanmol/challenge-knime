import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Workflow from '../components/Workflow';
import SearchBar from '../components/SearchBar';
import { WorkflowBlock } from '../types/dataTypes';
import { workflowBlocksMock } from '../dataMock';
import { addBlock } from '../store/workflow';

const HomeView: React.FC = () => {
  const [workflowBlocks, setWorkflowBlocks] = useState<WorkflowBlock[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setWorkflowBlocks(workflowBlocksMock);
  }, []);

  const addBlockHandler = (block: WorkflowBlock) => {
    dispatch(addBlock(block));
  };

  return (
    <main className="pt-0 pr-4 pb-4 pl-4 w-full mx-auto">
      <SearchBar flowBlockList={workflowBlocks} onAddBlock={addBlockHandler} />
      <Workflow />
    </main>
  );
};

export default HomeView;
