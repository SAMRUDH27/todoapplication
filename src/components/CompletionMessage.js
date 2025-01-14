import React, { useState, useEffect } from 'react';

const CompletionMessage = ({ isVisible, onClose }) => {
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
    <div className="fixed bottom-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up">
  <p className="font-medium">Task completed! 🎉</p>
</div>
  );
};

export default CompletionMessage;