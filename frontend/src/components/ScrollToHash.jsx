import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToHash handles smooth scrolling to anchor targets across route changes
 * and hash navigation (e.g. /#sample-report, /#faq) from any page.
 *
 * It polls for up to 1 second (every 50ms) to ensure the target DOM node exists,
 * even if rendering is slightly delayed, and smoothly scrolls to it.
 * If no hash is present on route change, it resets scroll position to the top.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      let attempts = 0;
      const maxAttempts = 20; // 20 * 50ms = 1000ms

      const tryScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (tryScroll()) {
        return;
      }

      // Retry every 50ms for up to 1 second
      const timer = setInterval(() => {
        attempts += 1;
        if (tryScroll() || attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    } else {
      // With no hash, scroll to top on route change
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
