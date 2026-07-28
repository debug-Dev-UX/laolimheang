// Error Handler Functions
export const handleError = (error) => {
  console.error('Error:', error);

  let message = 'An unexpected error occurred';

  if (error.code === 'auth/user-not-found') {
    message = 'User not found. Please check your email.';
  } else if (error.code === 'auth/wrong-password') {
    message = 'Incorrect password. Please try again.';
  } else if (error.code === 'auth/email-already-in-use') {
    message = 'Email already in use. Please use a different email.';
  } else if (error.code === 'auth/weak-password') {
    message = 'Password is too weak. Please use a stronger password.';
  } else if (error.code === 'auth/invalid-email') {
    message = 'Invalid email address.';
  } else if (error.message) {
    message = error.message;
  }

  return message;
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error && error.message) return error.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return (
    error &&
    (error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error' ||
      !navigator.onLine)
  );
};

export const isTimeoutError = (error) => {
  return error && (error.code === 'ECONNABORTED' || error.message === 'timeout');
};

export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    context,
    message: error.message,
    code: error.code,
    stack: error.stack,
  };

  console.error('Error Log:', errorLog);

  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (e.g., Sentry, LogRocket)
  }
};

export const createErrorResponse = (message, code = 'ERROR', data = null) => {
  return {
    success: false,
    message,
    code,
    data,
  };
};

export const createSuccessResponse = (message, data = null) => {
  return {
    success: true,
    message,
    data,
  };
};
