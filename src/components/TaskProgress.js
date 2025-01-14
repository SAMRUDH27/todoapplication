import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Notification = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'from-green-500 to-green-600'
    : type === 'add' 
    ? 'from-blue-500 to-blue-600'
    : 'from-purple-500 to-purple-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 bg-gradient-to-r ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}
    >
      <p className="font-medium">{message}</p>
    </motion.div>
  );
};

const ProgressTracker = ({ tasks, completedTasksCount, recentAction }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ['#FF69B4', '#4C3575', '#9370DB', '#8A2BE2'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    if (recentAction) {
      setNotificationType(recentAction.type);
      setNotificationMessage(
        recentAction.type === 'add' 
          ? 'Task added successfully! 📝' 
          : recentAction.type === 'complete' 
          ? 'Task completed! 🎉' 
          : ''
      );
      setShowNotification(true);
    }
  }, [recentAction]);

  useEffect(() => {
    if (totalTasks > 0 && completedTasksCount === totalTasks) {
      setShowCelebration(true);
      triggerConfetti();
    }
  }, [completedTasksCount, totalTasks]);

  return (
    <>
      <div className="mt-8 px-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <motion.h3 
              className="text-lg font-medium text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Progress
            </motion.h3>
            <motion.div 
              className="flex items-center justify-between mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-2xl font-bold text-purple-600">
                {completedTasksCount}/{totalTasks}
              </p>
              <span className="text-sm font-semibold text-gray-500">
                tasks completed
              </span>
            </motion.div>
          </div>
          
          <div className="relative pt-1">
            <motion.div 
              className="flex mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                {progressPercentage.toFixed(0)}% Complete
              </span>
            </motion.div>
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-purple-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ 
                  duration: 1,
                  ease: "easeOut"
                }}
                className="relative"
              >
                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-purple-700 rounded-full h-full transition-all duration-300 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-white opacity-20"
                    animate={{
                      x: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      width: "50%",
                      skewX: -20
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {showNotification && (
          <Notification
            message={notificationMessage}
            type={notificationType}
            isVisible={showNotification}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCelebration(false)} />
            
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-xl shadow-2xl p-8 m-4 max-w-sm w-full text-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 1.5, repeat: Infinity }
                }}
              >
                <span className="text-6xl mb-4">🎉</span>
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-purple-600 mb-4"
              >
                Congratulations!
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-600 mb-6"
              >
                You've completed all your tasks! Time to celebrate!
              </motion.p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCelebration(false)}
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressTracker;