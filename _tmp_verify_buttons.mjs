// Script verifikasi sementara: cek warna tombol project (normal & hover) via Chrome DevTools Protocol
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;
const PAGE_URL = 'file:///D:/Portofolio_Fadli/index.html';
const OUT = 'd:\\Portofolio_Fadli';

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(process.env.TEMP, 'chrome-cdp-verify')}`,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1280,900',
  'about:blank',
], { stdio: 'ignore' });

let wsUrl = null;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    wsUrl = (await res.json()).webSocketDebuggerUrl;
  } catch { /* belum siap */ }
  if (!wsUrl) await sleep(300);
}
if (!wsUrl) { chrome.kill(); throw new Error('DevTools tidak siap'); }

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

let msgId = 0;
const pending = new Map();
const seen = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.method + ' ' + JSON.stringify(msg.error))) : resolve(msg.result);
  } else if (msg.method) {
    seen.push(msg.method);
  }
});

function send(method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
  });
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (method, params) => send(method, params, sessionId);

await S('Page.enable');
await S('Runtime.enable');
await S('Page.navigate', { url: PAGE_URL });
for (let i = 0; i < 120 && !seen.includes('Page.loadEventFired'); i++) await sleep(100);
await sleep(1200); // tunggu animasi/font

async function evaluate(expression) {
  const r = await S('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}

// Geser halaman ke section Project (tanpa animasi smooth)
await evaluate(`(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  const el = document.querySelector('#project');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
  return true;
})()`);
await sleep(600);

const readStyle = (selector) => evaluate(`(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    text: el.textContent.trim(),
    background: cs.backgroundColor,
    textColor: cs.color,
    borderWidth: cs.borderTopWidth,
    borderStyle: cs.borderTopStyle,
    borderColor: cs.borderTopColor,
    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
  };
})()`);

const HERO_SEL = '.hero-buttons .btn';
const DEMO_SEL = '#project .project-card:nth-child(1) .btn-primary';
const REPO_SEL = '#project .project-card:nth-child(1) .btn-github';

const card = await evaluate(`(() => {
  const r = document.querySelector('#project .project-card:nth-child(1)').getBoundingClientRect();
  return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
})()`);

async function shot(file, clip) {
  const res = await S('Page.captureScreenshot', {
    format: 'png',
    clip: { x: clip.x, y: clip.y, width: clip.w, height: clip.h, scale: 1 },
    captureBeyondViewport: true,
  });
  writeFileSync(path.join(OUT, file), Buffer.from(res.data, 'base64'));
}

async function hover(selector) {
  const before = await readStyle(selector);
  const cx = before.rect.x + before.rect.w / 2;
  const cy = before.rect.y + before.rect.h / 2;
  await S('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cx, y: cy, buttons: 0 });
  await sleep(700); // tunggu transition 0.3s selesai
  const after = await readStyle(selector);
  return { selector, normal: before, hover: after };
}

const hero = await readStyle(HERO_SEL);
const tag = await readStyle('#project .project-card:nth-child(1) .tech-tag');
console.log('=== TECH TAG (kategori) ===');
console.log(JSON.stringify(tag, null, 1));
await shot('_tmp_normal.png', card);
const demo = await hover(DEMO_SEL);
await shot('_tmp_hover_demo.png', card);
const repo = await hover(REPO_SEL);
await shot('_tmp_hover_repo.png', card);

console.log('=== HERO BUTTON (acuan border) ===');
console.log(JSON.stringify(hero, null, 1));
console.log('=== LIVE DEMO (.btn-primary) ===');
console.log(JSON.stringify(demo, null, 1));
console.log('=== REPOSITORY (.btn-github) ===');
console.log(JSON.stringify(repo, null, 1));

ws.close();
chrome.kill();
