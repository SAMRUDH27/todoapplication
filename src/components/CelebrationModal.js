import React from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const CelebrationModal = ({ isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
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
                transition: { duration: 1, repeat: Infinity }
              }}
            >
              <span className="text-6xl mb-4">🎉</span>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-purple-600 mb-4">
              Congratulations!
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              You've completed all your tasks! Time to celebrate!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Continue
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationModal;