// Avatar utility functions

/**
 * Validates if a URL is likely to be a valid image
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL appears to be a valid image URL
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    
    // Check for common image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    // Check for known image hosting domains
    const imageHosts = [
      'googleusercontent.com',
      'gravatar.com',
      'unsplash.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'githubusercontent.com'
    ];
    const isImageHost = imageHosts.some(host => 
      urlObj.hostname.includes(host)
    );
    
    return hasImageExtension || isImageHost;
  } catch (error) {
    console.warn('Invalid URL provided to avatar validator:', url);
    return false;
  }
}

/**
 * Enhances Google avatar URLs for better quality
 * @param {string} originalUrl - The original Google avatar URL
 * @returns {string} - Enhanced URL with better size parameters
 */
export function enhanceGoogleAvatarUrl(originalUrl) {
  if (!originalUrl) return null;
  
  // Google profile pictures can be enhanced by modifying the size parameter
  if (originalUrl.includes('googleusercontent.com')) {
    // Remove existing size parameters and add our preferred size
    const baseUrl = originalUrl.split('=')[0];
    return `${baseUrl}=s200-c`; // 200px square, cropped
  }
  
  return originalUrl;
}

/**
 * Gets a fallback avatar URL based on user information
 * @param {Object} user - User object with name, email, etc.
 * @returns {string} - Fallback avatar URL
 */
export function getFallbackAvatarUrl(user) {
  if (!user) return null;
  
  // Try to generate a Gravatar URL if email is available
  if (user.email) {
    return generateGravatarUrl(user.email);
  }
  
  // Use initials-based avatar service
  if (user.name) {
    const initials = getInitials(user.name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=200&background=6366f1&color=ffffff`;
  }
  
  return null;
}

/**
 * Generates a Gravatar URL from an email address
 * @param {string} email - Email address
 * @returns {string} - Gravatar URL
 */
function generateGravatarUrl(email) {
  // Simple hash function for demo purposes
  // In production, you'd want to use a proper MD5 hash
  const hash = btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
}

/**
 * Extracts initials from a full name
 * @param {string} name - Full name
 * @returns {string} - Initials (max 2 characters)
 */
function getInitials(name) {
  if (!name) return 'U';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Preloads an image to check if it's accessible
 * @param {string} url - Image URL to preload
 * @returns {Promise<boolean>} - Promise that resolves to true if image loads successfully
 */
export function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}

/**
 * Gets the best available avatar URL for a user
 * @param {Object} user - User object
 * @returns {Promise<string>} - Promise that resolves to the best available avatar URL
 */
export async function getBestAvatarUrl(user) {
  if (!user) return null;
  
  // Try the user's picture first
  if (user.picture && isValidImageUrl(user.picture)) {
    const enhanced = enhanceGoogleAvatarUrl(user.picture);
    const isAccessible = await preloadImage(enhanced);
    if (isAccessible) {
      return enhanced;
    }
  }
  
  // Try fallback options
  const fallback = getFallbackAvatarUrl(user);
  if (fallback) {
    const isAccessible = await preloadImage(fallback);
    if (isAccessible) {
      return fallback;
    }
  }
  
  return null;
}
