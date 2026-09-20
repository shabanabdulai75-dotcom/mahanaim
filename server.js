const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const storage = require('./storage');
const notifications = require('./notifications');

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const sessions = new Map();
const demoPassword = process.env.DEMO_ADMIN_PASSWORD || 'Mahanaim@2026';

function hashPassword(password, salt='mahanaim-salt') { return crypto.scryptSync(password, salt, 32).toString('hex'); }
async function readData() { return storage.read(); }
async function writeData(data) { return storage.write(data); }
function send(res, status, body, type='application/json', extra={}) {
  res.writeHead(status, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials':'true', 'Cache-Control': 'no-store', ...extra });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
function parseCookies(req) { return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(item => { const [k,...v]=item.trim().split('='); return [k, decodeURIComponent(v.join('='))]; })); }
function readBody(req) { return new Promise((resolve,reject) => { let raw=''; req.on('data',chunk=>raw+=chunk); req.on('end',()=>{ try { resolve(JSON.parse(raw||'{}')); } catch (e) { reject(e); } }); req.on('error',reject); }); }
function mime(file) { return { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.json':'application/json' }[path.extname(file)] || 'application/octet-stream'; }
function publicUser(user) { const { passwordHash, ...safe } = user; return safe; }
function currentUser(req) { const token=parseCookies(req).mahanaim_session; return token ? sessions.get(token) : null; }
async function allUsers() {
  const data = await readData();
  const stored = Array.isArray(data.users) ? data.users : [];
  const demo = { id:'USR-001', name:'Administrator', email:'admin@mahanaim.edu.gh', role:'Administrator', status:'Active', passwordHash:hashPassword(demoPassword) };
  return [demo, ...stored.filter(u => (u.email || '').toLowerCase() !== demo.email)];
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Credentials':'true', 'Access-Control-Allow-Methods':'GET,PUT,POST,OPTIONS', 'Access-Control-Allow-Headers':'Content-Type' }); return res.end(); }
    if (req.url === '/api/health') return send(res, 200, { ok:true, school:'Mahanaim Academy', storage:storage.mode(), authentication:'session cookie' });
    if (req.url === '/api/data' && req.method === 'GET') return send(res, 200, await readData());
    if (req.url === '/api/data' && req.method === 'PUT') { if(!currentUser(req)) return send(res,401,{ok:false,error:'Sign-in required'}); const body=await readBody(req); await writeData(body); return send(res,200,{ok:true,savedAt:new Date().toISOString(),storage:storage.mode()}); }
    if (req.url === '/api/notifications/test' && req.method === 'POST') { const actor=currentUser(req); if(!actor || actor.role!=='Administrator') return send(res,403,{ok:false,error:'Administrator access required'}); const body=await readBody(req); const channel=String(body.channel||'email'); const result=await notifications.send(channel,body); return send(res,result.ok?200:503,result); }
    if (req.url === '/api/auth/login' && req.method === 'POST') { const body=await readBody(req); const identity=String(body.identity||'').toLowerCase(); const password=String(body.password||''); const user=(await allUsers()).find(u=>(u.email||'').toLowerCase()===identity || (u.name||'').toLowerCase()===identity); if(!user || hashPassword(password)!==user.passwordHash) return send(res,401,{ok:false,error:'Invalid sign-in details'}); const token=crypto.randomBytes(24).toString('hex'); sessions.set(token,publicUser(user)); return send(res,200,{ok:true,user:publicUser(user)},'application/json',{'Set-Cookie':`mahanaim_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`}); }
    if (req.url === '/api/auth/users' && (req.method === 'GET' || req.method === 'POST')) { const actor=currentUser(req); if(!actor || actor.role!=='Administrator') return send(res,403,{ok:false,error:'Administrator access required'}); if(req.method==='GET') return send(res,200,{ok:true,users:(await allUsers()).map(publicUser)}); const body=await readBody(req); const name=String(body.name||'').trim(),email=String(body.email||'').trim().toLowerCase(),role=String(body.role||'Teacher').trim(),password=String(body.password||''),linkedStudentId=String(body.linkedStudentId||'').trim(); if(!name||!email||password.length<8) return send(res,400,{ok:false,error:'Name, email and a password of at least 8 characters are required'}); const data=await readData(); const users=Array.isArray(data.users)?data.users:[]; if(users.some(u=>(u.email||'').toLowerCase()===email) || email==='admin@mahanaim.edu.gh') return send(res,409,{ok:false,error:'A user with that email already exists'}); const user={id:`USR-${String(100+users.length+1).padStart(3,'0')}`,name,email,role,status:'Active',linkedStudentId,passwordHash:hashPassword(password)}; users.push(user); data.users=users; await writeData(data); return send(res,201,{ok:true,user:publicUser(user)}); }
    if (req.url === '/api/auth/me' && req.method === 'GET') { const user=currentUser(req); return user ? send(res,200,{ok:true,user}) : send(res,401,{ok:false}); }
    if (req.url === '/api/auth/logout' && req.method === 'POST') { const token=parseCookies(req).mahanaim_session; if(token)sessions.delete(token); return send(res,200,{ok:true},'application/json',{'Set-Cookie':'mahanaim_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'}); }
    const requested = decodeURIComponent((req.url || '/').split('?')[0]);
    const file = path.normalize(path.join(ROOT, requested === '/' ? 'index.html' : requested));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res,404,'Not found','text/plain');
    res.writeHead(200, {'Content-Type':mime(file),'Cache-Control':'no-store'}); fs.createReadStream(file).pipe(res);
  } catch (error) { console.error(error); return send(res,500,{ok:false,error:'Internal server error'}); }
});

(async () => { await storage.init(); server.listen(PORT,'0.0.0.0',()=>console.log(`Mahanaim Academy server listening on ${PORT} using ${storage.mode()} storage`)); })().catch(error=>{ console.error('Storage initialization failed:',error); process.exit(1); });
