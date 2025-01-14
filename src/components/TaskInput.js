import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../features/todoSlice';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TaskInput = () => {
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [assignedToMe, setAssignedToMe] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    dispatch(addTask({
      id: Date.now(),
      text: taskText,
      priority,
      completed: false,
      important: false,
      date: dueDate.toISOString(),
      location: isOutdoor ? location : null,
      isOutdoor,
      assignedToMe,
    }));

    setTaskText('');
    setLocation('');
    setIsOutdoor(false);
    setAssignedToMe(false);
    setDueDate(new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Add a Task"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
             type="submit"
             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
           >
           <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={assignedToMe}
              onChange={(e) => setAssignedToMe(e.target.checked)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"            />
            <span>Assign to me</span>
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isOutdoor}
              onChange={(e) => setIsOutdoor(e.target.checked)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"            />
            <span>Outdoor Activity</span>
          </label>
          {isOutdoor && (
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"            />
          )}
        </div>
      </div>
    </form>
  );
};

export default TaskInput;