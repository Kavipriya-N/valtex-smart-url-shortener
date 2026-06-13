import { format } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
};

export const truncateUrl = (url, length = 40) => {
  if (!url) return '';
  if (url.length <= length) return url;
  return url.substring(0, length) + '...';
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
