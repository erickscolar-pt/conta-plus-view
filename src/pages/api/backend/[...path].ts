import type { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';
import https from 'https';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const AUTH_COOKIE = '@nextauth.token';
const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function getApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required.');
  }
  return url.replace(/\/+$/, '');
}

function getTargetUrl(req: NextApiRequest) {
  const path = req.query.path;
  const joinedPath = Array.isArray(path) ? path.join('/') : path;
  const queryIndex = req.url?.indexOf('?') ?? -1;
  const query = queryIndex >= 0 ? req.url?.slice(queryIndex) : '';
  return new URL(`${getApiBaseUrl()}/${joinedPath ?? ''}${query ?? ''}`);
}

function getCookieValue(cookieHeader: string | undefined, name: string) {
  const cookies = cookieHeader?.split(';') ?? [];
  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.split('=');
    if (rawKey?.trim() === name) {
      return decodeURIComponent(rawValue.join('='));
    }
  }
  return undefined;
}

function buildHeaders(req: NextApiRequest) {
  const headers: http.OutgoingHttpHeaders = {};

  for (const [key, value] of Object.entries(req.headers)) {
    const lowerKey = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lowerKey) || lowerKey === 'cookie') continue;
    headers[key] = value;
  }

  const token = getCookieValue(req.headers.cookie, AUTH_COOKIE);
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return headers;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const targetUrl = getTargetUrl(req);
  const transport = targetUrl.protocol === 'https:' ? https : http;

  const proxyReq = transport.request(
    targetUrl,
    {
      method: req.method,
      headers: buildHeaders(req),
    },
    (proxyRes) => {
      res.statusCode = proxyRes.statusCode ?? 502;

      for (const [key, value] of Object.entries(proxyRes.headers)) {
        if (value !== undefined && !HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      }

      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', () => {
    if (!res.headersSent) {
      res.status(502).json({ message: 'Não foi possível conectar à API.' });
    } else {
      res.end();
    }
  });

  req.pipe(proxyReq);
}
