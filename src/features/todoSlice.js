// features/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice';

const initialState = {
  tasks: [],
  completedTasks: [], // New array to store completed tasks
  filter: 'all',
  loading: false,
  error: null
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        ...action.payload,
        completed: false,
        createdAt: new Date().toISOString()
      });
    },
    deleteTask: (state, action) => {
      // Remove from both arrays
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      state.completedTasks = state.completedTasks.filter(task => task.id !== action.payload);
    },
    toggleCompleted: (state, action) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload);
      if (taskIndex !== -1) {
        const task = state.tasks[taskIndex];
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        
        if (task.completed) {
          // Move to completed tasks
          state.completedTasks.push({...task});
          // Remove from active tasks
          state.tasks.splice(taskIndex, 1);
        }
      } else {
        // Check in completed tasks
        const completedTaskIndex = state.completedTasks.findIndex(task => task.id === action.payload);
        if (completedTaskIndex !== -1) {
          const task = state.completedTasks[completedTaskIndex];
          task.completed = !task.completed;
          task.completedAt = null;
          
          // Move back to active tasks
          state.tasks.push({...task});
          // Remove from completed tasks
          state.completedTasks.splice(completedTaskIndex, 1);
        }
      }
    },
    toggleImportant: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload) || 
                   state.completedTasks.find(task => task.id === action.payload);
      if (task) {
        task.important = !task.important;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.completedTasks = [];
      state.filter = 'all';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.tasks = [];
      state.completedTasks = [];
      state.filter = 'all';
      state.loading = false;
      state.error = null;
    });
  }
});

export const {
  addTask,
  deleteTask,
  toggleCompleted,
  toggleImportant,
  setFilter,
  clearTasks
} = todoSlice.actions;

// Updated selectors
export const selectAllTasks = (state) => state.todo.tasks;
export const selectCompletedTasks = (state) => state.todo.completedTasks;

export const selectFilteredTasks = (state) => {
  const tasks = state.todo.tasks;
  const completedTasks = state.todo.completedTasks;
  const filter = state.todo.filter;

  switch (filter) {
    case 'completed':
      return completedTasks;
    case 'active':
      return tasks;
    case 'today': {
      const today = new Date();
      const todayTasks = [...tasks, ...completedTasks].filter(task => {
        const taskDate = new Date(task.date);
        return (
          taskDate.getDate() === today.getDate() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
      });
      return todayTasks;
    }
    case 'important':
      return [...tasks, ...completedTasks].filter(task => task.important);
    case 'assigned':
      return [...tasks, ...completedTasks].filter(task => task.assignedToMe);
    default:
      return [...tasks, ...completedTasks];
  }
};

export const selectTasksStats = (state) => {
  const tasks = [...state.todo.tasks, ...state.todo.completedTasks];
  return {
    total: tasks.length,
    completed: state.todo.completedTasks.length,
    active: state.todo.tasks.length,
    important: tasks.filter(task => task.important).length
  };
};

export default todoSlice.reducer;
