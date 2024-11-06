import { useState, useEffect } from 'react';

function useMobileView() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if `window` is defined (i.e., code is running in the browser)
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      // Set the initial state
      handleResize();

      // Add resize event listener
      window.addEventListener('resize', handleResize);

      // Cleanup on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return isMobile;
}

export default useMobileView;
