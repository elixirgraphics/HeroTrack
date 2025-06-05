import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { isValidImageUrl, enhanceGoogleAvatarUrl } from '../utils/avatar';

function Avatar({
  src,
  alt = 'User avatar',
  size = 'md',
  className = '',
  fallbackIcon = true
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [enhancedSrc, setEnhancedSrc] = useState(src);

  // Enhance the image URL when src changes
  useEffect(() => {
    if (src && isValidImageUrl(src)) {
      const enhanced = enhanceGoogleAvatarUrl(src);
      setEnhancedSrc(enhanced);
      setImageError(false);
      setImageLoading(true);
    } else {
      setEnhancedSrc(null);
      setImageError(true);
      setImageLoading(false);
    }
  }, [src]);

  // Size classes mapping
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8', 
    xl: 'w-10 h-10'
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // If no src provided or image failed to load, show fallback
  if (!enhancedSrc || imageError) {
    return (
      <div 
        className={`${sizeClasses[size]} ${className} bg-gray-200 rounded-full flex items-center justify-center`}
        title={alt}
      >
        {fallbackIcon && (
          <User className={`${iconSizeClasses[size]} text-gray-500`} />
        )}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Loading state */}
      {imageLoading && (
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse absolute inset-0`} />
      )}
      
      {/* Actual image */}
      <img
        src={enhancedSrc}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default Avatar;
