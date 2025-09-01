import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-green-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out transform translate-x-0`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className={`inline-flex ${getTextColor()} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
