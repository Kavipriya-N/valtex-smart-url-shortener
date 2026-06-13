import { toast } from 'react-hot-toast';

export const useToast = () => {
  const success = (msg) => {
    toast.success(msg, {
      duration: 3000,
      icon: '🚀',
    });
  };

  const error = (msg) => {
    toast.error(msg, {
      duration: 4000,
      icon: '❌',
    });
  };

  const info = (msg) => {
    toast(msg, {
      duration: 3000,
      icon: 'ℹ️',
    });
  };

  return { success, error, info };
};

export default useToast;
