/**
 * Smoke visual/HTTP: frontend Next.js + fluxo login
 */
const web = process.env.WEB_URL || 'http://localhost:3000';
const api = process.env.API_URL || 'http://localhost:3008';
const suffix = Date.now();
const username = `web_${suffix}`.slice(0, 20);
const email = `web+${suffix}@contaplus.app`;
const password = 'Senha@123456';

async function waitWeb(maxMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const r = await fetch(web);
      if (r.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  throw new Error(`Frontend não respondeu em ${web}`);
}

function extractCookie(setCookie) {
  if (!setCookie) return null;
  const parts = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const p of parts) {
    const m = p.match(/@nextauth\.token=([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
  }
  return null;
}

async function main() {
  await waitWeb();
  console.log('Frontend OK:', web);

  const publicPages = ['/', '/login', '/signup', '/signup/step1'];
  for (const path of publicPages) {
    const res = await fetch(`${web}${path}`);
    const html = await res.text();
    const ok = res.ok && html.length > 500;
    console.log(`${ok ? '✓' : '✗'} GET ${path} → ${res.status} (${html.length} bytes)`);
    if (!ok) process.exit(1);
  }

  console.log('\nCadastro via API backend...');
  const signup = await fetch(`${api}/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Usuário Teste Web',
      username,
      email,
      senha: password,
      acceptTerms: true,
    }),
  });
  if (!signup.ok) {
    console.error('Signup falhou', await signup.text());
    process.exit(1);
  }
  console.log('✓ Signup', username);

  console.log('\nLogin via API route Next.js...');
  const loginRes = await fetch(`${web}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const loginBody = await loginRes.json().catch(() => ({}));
  const cookieHeader = loginRes.headers.getSetCookie?.() ?? loginRes.headers.get('set-cookie');
  const token = extractCookie(cookieHeader);
  if (!loginRes.ok || !token) {
    console.error('Login web falhou', loginRes.status, loginBody, cookieHeader);
    process.exit(1);
  }
  console.log('✓ Login web, user id', loginBody.id);

  const authHeaders = { Cookie: `@nextauth.token=${encodeURIComponent(token)}` };
  const protectedPages = [
    '/dashboard',
    '/movimentacoes',
    '/metas',
    '/ai',
    '/planos',
    '/relatorios',
    '/perfil',
    '/mercado',
    '/importacao',
  ];

  console.log('\nPáginas autenticadas (SSR):');
  for (const path of protectedPages) {
    const res = await fetch(`${web}${path}`, { headers: authHeaders, redirect: 'manual' });
    const loc = res.headers.get('location') || '';
    const redirectedToLogin = res.status >= 300 && res.status < 400 && loc.includes('/login');
    const ok = res.status === 200 || (res.status >= 300 && !redirectedToLogin);
    console.log(`${ok ? '✓' : '✗'} GET ${path} → ${res.status}${loc ? ` → ${loc}` : ''}`);
    if (redirectedToLogin || res.status >= 500) process.exit(1);
  }

  console.log('\n✓ Smoke web completo');
  console.log('Acesse:', web);
  console.log('Credenciais:', { username, email, password });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
