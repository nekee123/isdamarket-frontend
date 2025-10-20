/**
 * Retry lazy loading with exponential backoff
 * Fixes white screen issues when chunks fail to load on page refresh
 * 
 * @param {Function} componentImport - The dynamic import function
 * @param {number} retries - Number of retry attempts (default: 5)
 * @param {number} interval - Initial retry interval in ms (default: 1000)
 * @returns {Promise} - Promise that resolves to the loaded component
 */
export const lazyRetry = (componentImport, retries = 5, interval = 1000) => {
  return new Promise((resolve, reject) => {
    componentImport()
      .then(resolve)
      .catch((error) => {
        // If we've exhausted retries, force a full page reload as last resort
        if (retries === 0) {
          console.error('Failed to load component after multiple retries:', error);
          
          // Check if it's a chunk loading error
          if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
            console.warn('Chunk load failed - reloading page...');
            window.location.reload();
            return;
          }
          
          reject(error);
          return;
        }

        // Log retry attempt
        console.log(`Retrying lazy load... (${retries} attempts left)`);
        
        // Retry after interval with exponential backoff
        setTimeout(() => {
          lazyRetry(componentImport, retries - 1, interval * 1.5).then(resolve, reject);
        }, interval);
      });
  });
};
