import React from 'react';

const BlogCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 h-48 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />

      <div className="mb-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-600" />
      <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-600" />
      <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-600" />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-600" />
        </div>
        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
