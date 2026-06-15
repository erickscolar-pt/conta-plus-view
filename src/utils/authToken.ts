import { jwtDecode } from 'jwt-decode';

export const AUTH_COOKIE = '@nextauth.token';

export function normalizeAuthToken(raw: string | undefined | null): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

export function isAuthTokenValid(token: string | undefined | null): boolean {
  const normalized = normalizeAuthToken(token);
  if (!normalized) return false;

  try {
    const decoded = jwtDecode<{ exp?: number }>(normalized);
    if (typeof decoded.exp !== 'number') return true;
    return decoded.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function decodeAuthToken(token: string | undefined | null): { exp?: number; role?: string } | null {
  const normalized = normalizeAuthToken(token);
  if (!normalized) return null;
  try {
    return jwtDecode<{ exp?: number; role?: string }>(normalized);
  } catch {
    return null;
  }
}
