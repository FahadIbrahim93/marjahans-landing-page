export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const FALLBACK_LOGIN_PATH = "/";

/**
 * Generate login URL at runtime so redirect URI reflects the current origin.
 * Falls back safely when OAuth env configuration is missing/invalid.
 */
export const getLoginUrl = () => {
  if (typeof window === "undefined") {
    return FALLBACK_LOGIN_PATH;
  }

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    console.warn(
      "[Auth] Missing VITE_OAUTH_PORTAL_URL or VITE_APP_ID. Falling back to home route."
    );
    return FALLBACK_LOGIN_PATH;
  }

  try {
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);

    const portalBaseUrl = new URL(oauthPortalUrl, window.location.origin);
    const url = new URL("/app-auth", portalBaseUrl);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.warn(
      "[Auth] Failed to construct login URL. Falling back to home route.",
      error
    );
    return FALLBACK_LOGIN_PATH;
  }
};
