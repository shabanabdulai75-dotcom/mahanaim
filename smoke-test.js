const assert = require('node:assert/strict');

(async () => {
  const base = process.env.APP_URL || `http://127.0.0.1:${process.env.PORT || 4173}`;
  const page = await fetch(`${base}/`);
  assert.equal(page.status, 200, 'dashboard should load');
  const html = await page.text();
  assert.match(html, /Mahanaim Academy/);
  assert.match(html, /Import CSV/);

  const logo = await fetch(`${base}/logo.png`);
  assert.equal(logo.status, 200, 'school logo should be served');
  assert.match(logo.headers.get('content-type') || '', /image\/png/);

  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200, 'health endpoint should respond');
  const healthBody = await health.json();
  assert.equal(healthBody.school, 'Mahanaim Academy');

  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: 'admin@mahanaim.edu.gh', password: process.env.DEMO_ADMIN_PASSWORD || 'Mahanaim@2026' })
  });
  assert.equal(login.status, 200, 'demo administrator should be able to sign in');
  const loginBody = await login.json();
  assert.equal(loginBody.user.role, 'Administrator');
  console.log('Mahanaim Academy smoke test passed.');
})().catch(error => { console.error(`Smoke test failed: ${error.message}`); process.exit(1); });
