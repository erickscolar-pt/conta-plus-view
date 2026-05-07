import type { NextApiRequest, NextApiResponse } from 'next';

const AUTH_COOKIE = '@nextauth.token';

function serializeExpiredAuthCookie() {
  const parts = [
    `${AUTH_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  res.setHeader(
    'Set-Cookie',
    serializeExpiredAuthCookie(),
  );

  res.status(204).end();
}
