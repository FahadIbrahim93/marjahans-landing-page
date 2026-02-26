import { useEffect } from 'react';

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint (ms)
  fid?: number; // First Input Delay (ms)
  cls?: number; // Cumulative Layout Shift (0-1)
  fcp?: number; // First Contentful Paint (ms)
  ttfb?: number; // Time to First Byte (ms)
}

/**
 * Performance Monitor component for Core Web Vitals
 * Tracks and logs:
 * - LCP (Largest Contentful Paint): <2.5s ✓
 * - FID (First Input Delay): <100ms ✓
 * - CLS (Cumulative Layout Shift): <0.1 ✓
 * - FCP (First Contentful Paint): <1.8s ✓
 * - TTFB (Time to First Byte): <600ms ✓
 */
export function PerformanceMonitor() {
  useEffect(() => {
    const metrics: PerformanceMetrics = {};

    // Measure LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
          if (metrics.lcp) logMetrics('LCP', metrics.lcp, 2500);
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cleanup LCP observer after page load
        window.addEventListener('load', () => {
          lcpObserver.disconnect();
        });
      } catch (e) {
        console.warn('[Performance] LCP observer not supported', e);
      }

      // Measure FID (First Input Delay) / INP (Interaction to Next Paint)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            metrics.fid = (entry as any).processingDuration;
            if (metrics.fid) logMetrics('FID', metrics.fid, 100);
          });
        });

        fidObserver.observe({
          entryTypes: ['first-input', 'event'],
        });
      } catch (e) {
        console.warn('[Performance] FID observer not supported', e);
      }

      // Measure CLS (Cumulative Layout Shift)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let clsValue = 0;
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          metrics.cls = clsValue;
          logMetrics('CLS', metrics.cls, 0.1);
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('[Performance] CLS observer not supported', e);
      }

      // Measure FCP (First Contentful Paint)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
          if (fcp) {
            metrics.fcp = fcp.startTime;
            logMetrics('FCP', metrics.fcp, 1800);
          }
        });

        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('[Performance] FCP observer not supported', e);
      }
    }

    // Measure TTFB (Time to First Byte)
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.fetchStart;
        logMetrics('TTFB', metrics.ttfb, 600);
      }

      // Log all metrics
      console.log('[Performance] Core Web Vitals:', metrics);

      // Send to analytics (if available)
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          lcp: metrics.lcp,
          fid: metrics.fid,
          cls: metrics.cls,
          fcp: metrics.fcp,
          ttfb: metrics.ttfb,
        });
      }
    });

    return () => {
      // Cleanup handled by browser
    };
  }, []);

  return null; // This component only monitors performance
}

/**
 * Log metric with pass/fail status
 */
function logMetrics(name: string, value: number, threshold: number) {
  const status = value <= threshold ? '✓ PASS' : '✗ FAIL';
  const color = value <= threshold ? 'color: green' : 'color: red';
  console.log(
    `%c[Performance] ${name}: ${value.toFixed(2)}ms (threshold: ${threshold}ms) ${status}`,
    color
  );
}

/**
 * Extend window types for analytics
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
