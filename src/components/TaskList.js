import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { StarIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { toggleCompleted, toggleImportant, deleteTask } from '../features/todoSlice';
import WeatherWidget from '../features/WeatherWidget';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      <p className="font-medium">{message}</p>
    </motion.div>
  );
};

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('list');
  const [showNotification, setShowNotification] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState(null);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.todo.tasks);
  const completedTasks = useSelector((state) => state.todo.completedTasks);
  const filter = useSelector((state) => state.todo.filter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-200';
    }
  };

  const handleToggleComplete = (taskId) => {
    dispatch(toggleCompleted(taskId));
    setCompletedTaskId(taskId);
    setShowNotification(true);
  };

  const handleToggleImportant = (taskId) => {
    dispatch(toggleImportant(taskId));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const filteredAndSortedTasks = useMemo(() => {
    if (filter === 'completed') {
      return completedTasks;
    }

    let filteredTasks = [...tasks];

    filteredTasks = filteredTasks.filter((task) => {
      const taskDate = new Date(task.date);
      const today = new Date();

      switch (filter) {
        case 'today':
          return (
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear()
          );
        case 'important':
          return task.important;
        case 'assigned':
          return task.assignedToMe;
        default:
          return true;
      }
    });

    if (searchTerm) {
      filteredTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'priority': {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'status':
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        case 'name':
          return a.text.localeCompare(b.text);
        default:
          return 0;
      }
    });
  }, [tasks, completedTasks, filter, searchTerm, sortBy]);

  const showControls = filter !== 'completed';

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="name">Sort by Name</option>
              </select>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded ${
                    viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 rounded ${
                    viewMode === 'calendar' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === 'completed' 
              ? 'No completed tasks yet.'
              : 'No tasks found. Add some tasks to get started!'}
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-col p-4 bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(
                task.priority
              )} hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="focus:outline-none"
                >
                  <CheckCircleIcon
                    className={`w-6 h-6 ${
                      task.completed ? 'text-green-500' : 'text-gray-300'
                    } hover:text-green-600`}
                  />
                </button>
                <div className="flex-1">
                  <span
                    className={`${
                      task.completed ? 'line-through text-gray-500' : ''
                    } text-sm md:text-base`}
                  >
                    {task.text}
                  </span>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">
                    Due: {format(new Date(task.date), 'MMM dd, yyyy')}
                    {task.location && <span className="ml-2">📍 {task.location}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleImportant(task.id)}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                  >
                    <StarIcon
                      className={`w-5 h-5 ${
                        task.important ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
              {task.isOutdoor && task.location && (
                <div className="mt-3">
                  <WeatherWidget location={task.location} taskId={task.id} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showNotification && (
          <Notification
            message="Task completed! 🎉"
            isVisible={showNotification}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;