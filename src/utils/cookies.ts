import type { GetServerSidePropsContext } from 'next';

const AUTH_COOKIE = '@nextauth.token';

function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  const cookies = cookieHeader?.split(';') ?? [];

  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.split('=');
    const key = rawKey?.trim();
    if (!key) continue;
    parsed[key] = decodeURIComponent(rawValue.join('='));
  }

  return parsed;
}

export function parseRequestCookies(ctx?: GetServerSidePropsContext) {
  if (ctx) {
    return parseCookieHeader(ctx.req.headers.cookie);
  }

  if (typeof document !== 'undefined') {
    return parseCookieHeader(document.cookie);
  }

  return {};
}

export function clearAuthCookie(ctx: GetServerSidePropsContext) {
  const expiredCookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`;
  const currentHeader = ctx.res.getHeader('Set-Cookie');
  const cookies = Array.isArray(currentHeader)
    ? currentHeader
    : currentHeader
      ? [String(currentHeader)]
      : [];

  ctx.res.setHeader('Set-Cookie', [...cookies, expiredCookie]);
}
