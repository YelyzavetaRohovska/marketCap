"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
}

export const Toast = ({ message }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return;

  return (
    <div className="fixed bottom-5 left-5 w-1/2 bg-red-800 text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
};