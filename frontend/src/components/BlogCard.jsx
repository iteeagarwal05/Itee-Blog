import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';

const BlogCard = ({
  id,
  title,
  excerpt,
  image,
  author,
  date,
  avatar,
  slug,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-white p-4 shadow transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <Link to={`/blog/${slug}`} className="absolute inset-0 z-10" />

      <OptimizedImage
        src={image}
        alt={title}
        className="mb-4 h-48 w-full rounded-xl"
        fallbackSrc="/fallback.jpg"
      />

      <h2 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600">
        {title}
      </h2>

      <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
        {excerpt}
      </p>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <OptimizedImage
            src={avatar}
            alt={author}
            className="h-8 w-8 rounded-full"
            fallbackSrc="/avatar-placeholder.png"
          />
          <span>{author}</span>
        </div>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default BlogCard;
