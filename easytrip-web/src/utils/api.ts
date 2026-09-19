/**
 * EasyTrip API Client Utility
 * Resolves API endpoints against VITE_API_URL environment variable.
 * If VITE_API_URL is empty (default in local dev), requests use relative /api/...
 * which are proxied by Vite to the local backend.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function apiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}
