import { useContext, useState, useCallback } from 'react';
import ToastContext from '../services/ToastContext';

export const ToastProvider = ({ children }) => {
  const typeClassMap = {
    info: 'alert-info',
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
  };

  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast wrapper - positioned top-right */}
      <div className="toast toast-top toast-right z-50 space-y-2 p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert ${typeClassMap[toast.type] || 'alert-info'} alert-soft shadow-lg w-96 flex items-center justify-between`}
          >
            <span>{toast.message}</span>
            <button
              className="btn btn-sm btn-circle btn-ghost ml-4"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close toast"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
