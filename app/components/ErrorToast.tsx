"use client";

import { useEffect, useState } from "react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ErrorToast({ message, onClose, duration = 5000 }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-error text-on-error px-6 py-4 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-fade-in">
      <span className="material-symbols-outlined">error</span>
      <p className="font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 material-symbols-outlined hover:opacity-70"
      >
        close
      </button>
    </div>
  );
}
