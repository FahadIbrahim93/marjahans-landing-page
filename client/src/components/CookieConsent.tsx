import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * GDPR Cookie Consent Banner
 * Complies with GDPR, ePrivacy Directive, and CCPA
 * Stores user preference in localStorage
 */
export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem("cookie-consent");
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      const saved = JSON.parse(savedConsent);
      setPreferences(saved);
      applyConsent(saved);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(minimal);
    saveConsent(minimal);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setIsVisible(false);
  };

  const saveConsent = (prefs: typeof preferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    applyConsent(prefs);
  };

  const applyConsent = (prefs: typeof preferences) => {
    // Load analytics if accepted
    if (prefs.analytics) {
      loadGoogleAnalytics();
    }

    // Load marketing pixels if accepted
    if (prefs.marketing) {
      loadFacebookPixel();
    }
  };

  const loadGoogleAnalytics = () => {
    if (window.gtag) return; // Already loaded

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"; // Replace with your GA ID
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      (window.dataLayer as unknown[]).push(arguments);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", "G-XXXXXXXXXX"); // Replace with your GA ID
  };

  const loadFacebookPixel = () => {
    if ((window as any).fbq) return; // Already loaded

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    (window as any).fbq = function () {
      (window as any).fbq.callMethod
        ? (window as any).fbq.callMethod.apply(
            (window as any).fbq,
            arguments as any
          )
        : (window as any).fbq.queue.push(arguments);
    };
    (window as any).fbq.push = (window as any).fbq;
    (window as any).fbq.loaded = true;
    (window as any).fbq.version = "2.0";
    (window as any).fbq.queue = [];
    (window as any).fbq("init", "1234567890"); // Replace with your Pixel ID
    (window as any).fbq("track", "PageView");
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-amber-500/30 shadow-2xl"
      role="region"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Main message */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-2">
                Cookie Preferences
              </h2>
              <p className="text-sm text-slate-300 mb-4">
                We use cookies to enhance your experience, analyze site traffic,
                and enable marketing features. Read our{" "}
                <a
                  href="/privacy-policy"
                  className="text-amber-400 hover:text-amber-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                to learn more.
              </p>

              {/* Cookie categories */}
              <div className="space-y-3">
                {/* Necessary cookies (always on) */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 cursor-not-allowed"
                    aria-label="Necessary cookies (always enabled)"
                  />
                  <span className="text-sm text-slate-300">
                    <span className="font-semibold text-white">Necessary</span>{" "}
                    - Required for site functionality
                  </span>
                </label>

                {/* Analytics cookies */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={e =>
                      setPreferences({
                        ...preferences,
                        analytics: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 cursor-pointer"
                    aria-label="Analytics cookies"
                  />
                  <span className="text-sm text-slate-300">
                    <span className="font-semibold text-white">Analytics</span>{" "}
                    - Help us understand how you use our site
                  </span>
                </label>

                {/* Marketing cookies */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={e =>
                      setPreferences({
                        ...preferences,
                        marketing: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 cursor-pointer"
                    aria-label="Marketing cookies"
                  />
                  <span className="text-sm text-slate-300">
                    <span className="font-semibold text-white">Marketing</span>{" "}
                    - Enable personalized ads and retargeting
                  </span>
                </label>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close cookie consent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectAll}
              className="border-slate-600 hover:border-slate-500"
            >
              Reject All
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePreferences}
              className="border-amber-500/30 hover:border-amber-500/60"
            >
              Save Preferences
            </Button>

            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Extend window types for analytics
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}
