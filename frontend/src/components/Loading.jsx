import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
