import { useState, useCallback } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    setNotification({
      message,
      type,
      duration,
      id: Date.now() // Para asegurar que cada notificación sea única
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showSuccess = useCallback((message, duration = 3000) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message, duration = 5000) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError
  };
};

export default useNotification;
