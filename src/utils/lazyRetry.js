import { lazy } from 'react';

/**
 * Retry function for dynamic imports with exponential backoff
 * 
 * @param {Function} componentImport - The dynamic import function
 * @param {number} retriesLeft - Number of retry attempts left
 * @param {number} interval - Current retry interval in ms
 * @returns {Promise} - Promise that resolves to the loaded component
 */
const retryImport = (componentImport, retriesLeft = 2, interval = 300) => {
  return componentImport().catch((error) => {
    // If no retries left, reject
    if (retriesLeft === 0) {
      console.error('❌ Failed to load component after all retries:', error);
      throw error;
    }

    // Log retry attempt
    console.warn(`⚠️ Chunk load failed. Retrying... (${retriesLeft} attempts left)`);
    
    // Wait and retry with shorter intervals for faster loading
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(retryImport(componentImport, retriesLeft - 1, interval * 2));
      }, interval);
    });
  });
};

/**
 * Wraps React.lazy with automatic retry logic for chunk loading failures
 * Fixes white screen issues when lazy-loaded chunks fail to load on page refresh
 * 
 * @param {Function} componentImport - The dynamic import function (e.g., () => import('./Component'))
 * @returns {React.LazyExoticComponent} - Lazy component with retry logic
 */
export const lazyWithRetry = (componentImport) => {
  return lazy(() => retryImport(componentImport));
};

// Legacy export for backward compatibility
export const lazyRetry = retryImport;
