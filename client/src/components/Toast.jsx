import React from 'react';
import toast from 'react-hot-toast';

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export default function Toast() {
  return null;
}
