import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store';
import { logout } from './features/authSlice';

// Components
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';
import Login from './components/Login';

// App Layout Component
const AppLayout = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const currentUser = useSelector(state => state.auth.currentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Welcome, {currentUser}!</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
            <TaskInput />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">My Tasks</h2>
              <div className="text-sm text-purple-600">
                <span className="font-medium">
                  {currentUser}'s Tasks
                </span>
              </div>
            </div>
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  );
};

// Root App Component with Provider
const App = () => {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
};

export default App;