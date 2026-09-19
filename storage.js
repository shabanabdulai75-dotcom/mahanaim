const fs = require('fs');
const path = require('path');

const EMPTY_DATA = { students: [], staff: [], results: [], parents: [], users: [], feeStructures: [], timetableSlots: [], communications: [], operations: [] };
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || ROOT;
const DATA_FILE = path.join(DATA_DIR, 'data.json');
let pool = null;

function jsonRead() {
  try { return { ...EMPTY_DATA, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }; }
  catch { return { ...EMPTY_DATA }; }
}
function jsonWrite(data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ ...EMPTY_DATA, ...data }, null, 2));
}
async function init() {
  if (!process.env.DATABASE_URL) {
    if (!fs.existsSync(DATA_FILE)) jsonWrite(EMPTY_DATA);
    return;
  }
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false } });
  await pool.query(`CREATE TABLE IF NOT EXISTS school_state (id INTEGER PRIMARY KEY, payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  const result = await pool.query('SELECT payload FROM school_state WHERE id = 1');
  if (!result.rows.length) await pool.query('INSERT INTO school_state (id, payload) VALUES (1, $1::jsonb)', [JSON.stringify(jsonRead())]);
}
async function read() {
  if (!pool) return jsonRead();
  const result = await pool.query('SELECT payload FROM school_state WHERE id = 1');
  return result.rows.length ? { ...EMPTY_DATA, ...result.rows[0].payload } : { ...EMPTY_DATA };
}
async function write(data) {
  const payload = { ...EMPTY_DATA, ...data };
  if (!pool) return jsonWrite(payload);
  await pool.query(`INSERT INTO school_state (id, payload, updated_at) VALUES (1, $1::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`, [JSON.stringify(payload)]);
}
function mode() { return pool ? 'postgresql' : 'json'; }
async function close() { if (pool) await pool.end(); }
module.exports = { init, read, write, mode, close, EMPTY_DATA };
