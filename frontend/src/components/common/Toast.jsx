import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) {
  // Help linters detect motion usage and allow JSX-friendly component
  const MotionDiv = motion.div;
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColors = {
    success: "bg-salmon_pink-600",
    error: "bg-raspberry_rose-600",
    warning: "bg-light_orange-600",
    info: "bg-blush-600",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        className={`fixed top-4 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${bgColors[type]} text-white min-w-[300px] max-w-md`}
      >
        <div className="text-xl font-bold">{icons[type]}</div>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white/90 hover:text-white transition-colors font-bold text-lg"
        >
          ✕
        </button>
      </MotionDiv>
    </AnimatePresence>
  );
}
