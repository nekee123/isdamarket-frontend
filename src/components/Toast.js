import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { colors, shadows, borderRadius } from '../styles/theme';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      background: colors.success,
      icon: <FiCheckCircle size={20} />,
    },
    error: {
      background: colors.error,
      icon: <FiAlertCircle size={20} />,
    },
    info: {
      background: colors.info,
      icon: <FiInfo size={20} />,
    },
    warning: {
      background: colors.warning,
      icon: <FiAlertCircle size={20} />,
    },
  };

  const currentType = typeStyles[type] || typeStyles.success;

  const styles = {
    container: {
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      background: currentType.background,
      color: colors.neutral.white,
      padding: '1rem 1.5rem',
      borderRadius: borderRadius.lg,
      boxShadow: shadows.xl,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '300px',
      maxWidth: '500px',
      zIndex: 10000,
      animation: 'slideIn 0.3s ease-out',
    },
    content: {
      flex: 1,
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    closeBtn: {
      background: 'transparent',
      border: 'none',
      color: colors.neutral.white,
      cursor: 'pointer',
      padding: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: '0.2s',
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={styles.container}>
        {currentType.icon}
        <div style={styles.content}>{message}</div>
        <button style={styles.closeBtn} onClick={onClose}>
          <FiX size={18} />
        </button>
      </div>
    </>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};

export default Toast;
