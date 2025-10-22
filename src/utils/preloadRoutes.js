/**
 * Preload route components to improve perceived performance
 * This loads components in the background so they're ready when needed
 */

/**
 * Preload critical routes after initial page load
 * This improves navigation speed by loading components in advance
 */
export const preloadCriticalRoutes = (userType) => {
  // Use requestIdleCallback for better performance
  const preload = () => {
    if (userType === 'buyer') {
      // Preload buyer routes
      import('../pages/BrowseFish');
      import('../pages/MyOrders');
      import('../pages/ViewProduct');
    } else if (userType === 'seller') {
      // Preload seller routes
      import('../pages/SellerProducts');
      import('../pages/SellerOrders');
    }
  };

  // Use requestIdleCallback if available, otherwise setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preload);
  } else {
    setTimeout(preload, 1000);
  }
};

/**
 * Preload a specific route on hover (for link hover optimization)
 */
export const preloadRoute = (routePath) => {
  const routeMap = {
    '/buyer-dashboard/browse': () => import('../pages/BrowseFish'),
    '/buyer-dashboard/orders': () => import('../pages/MyOrders'),
    '/buyer-dashboard/settings': () => import('../pages/BuyerSettings'),
    '/seller-dashboard/products': () => import('../pages/SellerProducts'),
    '/seller-dashboard/orders': () => import('../pages/SellerOrders'),
    '/seller-dashboard/settings': () => import('../pages/SellerSettings'),
  };

  const loader = routeMap[routePath];
  if (loader) {
    loader();
  }
};
