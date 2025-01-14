import { configureStore, combineReducers } from '@reduxjs/toolkit';
import todoReducer from '../features/todoSlice';
import authReducer from '../features/authSlice';
import weatherReducer from '../features/weatherSlice';
import {thunk} from 'redux-thunk';


const rootReducer = combineReducers({
  todo: todoReducer,
  auth: authReducer,
  weather: weatherReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});

// Selectors
export const selectTasks = (state) => state.todo.tasks;
export const selectWeather = (state) => state.weather;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserTasks = (state) => state.todo.tasks;
export const selectFilter = (state) => state.todo.filter;