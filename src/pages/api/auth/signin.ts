import type { NextApiRequest, NextApiResponse } from 'next';

const AUTH_COOKIE = '@nextauth.token';

function getApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required.');
  }
  return url.replace(/\/+$/, '');
}

function cookieDomain(): string | undefined {
  if (process.env.NODE_ENV !== 'production') return undefined;
  return process.env.AUTH_COOKIE_DOMAIN || '.contaplus.app.br';
}

function serializeAuthCookie(token: string) {
  const parts = [
    `${AUTH_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${60 * 60 * 24}`,
  ];

  const domain = cookieDomain();
  if (domain) parts.push(`Domain=${domain}`);

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      res.status(response.status).json(data ?? { message: 'Erro ao acessar.' });
      return;
    }

    const { token, ...user } = data;
    if (!token) {
      res.status(502).json({ message: 'Token não retornado pela API.' });
      return;
    }

    res.setHeader(
      'Set-Cookie',
      serializeAuthCookie(token),
    );

    res.status(200).json(user);
  } catch {
    res.status(502).json({ message: 'Não foi possível conectar à API.' });
  }
}
