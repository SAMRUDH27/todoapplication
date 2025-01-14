import React from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const SortOptions = ({ sortBy, onSortChange }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <ArrowUpIcon className="h-5 w-5 text-gray-400" />
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
      >
        <option value="date">Due Date</option>
        <option value="priority">Priority</option>
        <option value="status">Status</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
};

export default SortOptions;
