import { ContactUs, AboutUs } from "../config/lazyComponents.jsx";

// Smart loader detection
export const shouldShowLoader = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const navigation = window.performance.getEntriesByType('navigation')[0];
    const isReload = navigation?.type === 'reload';
    return isReload;
  } catch (error) {
    return false;
  }
};

// Preload critical components
export const preloadCriticalComponents = () => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      ContactUs.preload?.();
      AboutUs.preload?.();
    });
  }
};