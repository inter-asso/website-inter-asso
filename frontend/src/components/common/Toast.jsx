import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -50, x: '-50%' }}
        className={`fixed top-4 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${bgColors[type]} text-white min-w-[300px] max-w-md`}
      >
        <div className="text-xl font-bold">{icons[type]}</div>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors font-bold text-lg"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
