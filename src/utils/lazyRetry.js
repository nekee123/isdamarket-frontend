/**
 * Retry lazy loading with exponential backoff
 * Fixes white screen issues when chunks fail to load on page refresh
 */
export const lazyRetry = (componentImport, retries = 3, interval = 1000) => {
  return new Promise((resolve, reject) => {
    componentImport()
      .then(resolve)
      .catch((error) => {
        // If we've exhausted retries, reject
        if (retries === 0) {
          reject(error);
          return;
        }

        // Retry after interval
        setTimeout(() => {
          console.log(`Retrying lazy load... (${retries} attempts left)`);
          lazyRetry(componentImport, retries - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};
