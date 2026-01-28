(function (window) {
  window.ENV = window.ENV || {};
  // Runtime API URL used by the frontend (includes /api prefix)
  window.ENV.VITE_API_URL = window.ENV.VITE_API_URL || 'http://localhost:5000/api';
})(window);
