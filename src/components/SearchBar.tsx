import React, { useState, useMemo } from 'react';
import { WorkflowBlock } from '../types/dataTypes';

interface SearchBarProps {
  flowBlockList: WorkflowBlock[];
  onAddBlock: (block: WorkflowBlock) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ flowBlockList, onAddBlock }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addBlock = (block: WorkflowBlock) => {
    setSearchQuery('');
    onAddBlock(block);
  };

  const searchNodes = useMemo(() => {
    if (searchQuery) {
      const regExpQuery = new RegExp(searchQuery, 'i');
      return flowBlockList.filter(
        (node) => regExpQuery.test(node.name) || regExpQuery.test(node.name)
      );
    }
    return flowBlockList;
  }, [searchQuery, flowBlockList]);

  return (
    <div className="search-bar w-full bg-white flex justify-center p-4">
      <div className="relative w-full max-w-sm" data-testid="search-bar--wrapper">
        <input
          className="text-base h-10 w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
          data-testid="search-bar--input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Add new node..."
        />
        <ul className={`absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10 ${searchQuery ? 'block' : 'hidden'}`}>
          {searchNodes.map((node) => (
            <li
              className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer bg-white"
              data-testid="search-bar--list-item"
              key={node.name}
              onMouseDown={() => addBlock(node)}
            >
              <span>{node.name}</span>
              <img src={node.image} alt={node.name} className="h-10 w-10" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
