import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to={ROUTES.HOME} className="px-6 py-3 bg-primary-600 text-white rounded hover:bg-primary-700">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
