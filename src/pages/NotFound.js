import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-white text-neutral-900 px-4">
      <div className="max-w-md w-full text-center space-y-6 border-2 border-black p-8 sm:p-12 bg-neutral-50 shadow-xl">
        <span className="text-[11px] font-black tracking-[0.25em] uppercase text-neutral-500 block">
          ERROR 404 • PAGE NOT FOUND
        </span>
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-black">
          404
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-medium uppercase tracking-wider leading-relaxed">
          The requested system route or catalog page does not exist or has been relocated.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to={ROUTES.HOME}
            className="flex-1 py-3.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
          >
            RETURN HOME
          </Link>
          <Link
            to={ROUTES.PORTFOLIO}
            className="flex-1 py-3.5 bg-white text-black border border-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-100 transition-colors"
          >
            VIEW CATALOG
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
