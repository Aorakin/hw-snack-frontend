// Runtime config - can be set via window object
declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

export const API_URL = window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
