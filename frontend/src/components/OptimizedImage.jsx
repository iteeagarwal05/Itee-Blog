import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className = '', fallbackSrc }) => {
  const [error, setError] = useState(false);

  return (
    <img
      loading="lazy"
      src={error ? fallbackSrc || '/fallback.jpg' : src}
      alt={alt}
      onError={() => setError(true)}
      className={`object-cover ${className}`}
    />
  );
};

export default OptimizedImage;
