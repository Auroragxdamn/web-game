const defaultApiUrl =
  typeof window === "undefined"
    ? "http://localhost:3000"
    : `${window.location.protocol}//${window.location.hostname}:3000`;

export const apiBaseUrl = import.meta.env.VITE_API_URL || defaultApiUrl;
