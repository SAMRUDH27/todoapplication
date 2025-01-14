import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { setFilter } from '../features/todoSlice';
import {
  CalendarIcon,
  StarIcon,
  InboxIcon,
  UserIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ProgressTracker from './TaskProgress';

const Sidebar = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector(state => state.todo.filter);
  const currentUser = useSelector(state => state.auth.currentUser);
  const tasks = useSelector(state => state.todo.tasks);
  const completedTasks = useSelector(state => state.todo.completedTasks);
  const completedTasksCount = completedTasks.length;

  const getMenuItemClass = (filterName) => {
    return `flex items-center space-x-3 p-3 rounded-lg ${
      currentFilter === filterName 
        ? 'bg-[#4C3575] text-white' 
        : 'hover:bg-gray-50 cursor-pointer'
    }`;
  };

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-semibold text-[#4C3575]">Hey, {currentUser}!</h2>
            <button
              onClick={() => dispatch(logout())}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li 
              className={getMenuItemClass('all')}
              onClick={() => dispatch(setFilter('all'))}
            >
              <InboxIcon className="w-5 h-5" />
              <span>All Tasks</span>
            </li>
            <li 
              className={getMenuItemClass('today')}
              onClick={() => dispatch(setFilter('today'))}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Today</span>
            </li>
            <li 
              className={getMenuItemClass('important')}
              onClick={() => dispatch(setFilter('important'))}
            >
              <StarIcon className="w-5 h-5" />
              <span>Important</span>
            </li>
            <li 
              className={getMenuItemClass('completed')}
              onClick={() => dispatch(setFilter('completed'))}
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span>Completed ({completedTasksCount})</span>
            </li>
            <li 
              className={getMenuItemClass('assigned')}
              onClick={() => dispatch(setFilter('assigned'))}
            >
              <UserIcon className="w-5 h-5" />
              <span>Assigned to me</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker 
        tasks={[...tasks, ...completedTasks]} 
        completedTasksCount={completedTasksCount}
      />
    </div>
  );
};

export default Sidebar;