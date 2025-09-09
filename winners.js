// netlify/functions/winners.js
// Jednoduché API pro denní žebříček: GET = načti, POST = ulož (TOP 300 nejrychlejších).
// Běží na /api/winners (Netlify Functions).

import { getStore } from '@netlify/blobs';

const store = getStore('winners-v1'); // jméno "kolekce" v Blobs

const json = (status, data) => ({
  statusCode: status,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  try {
    const url = new URL(event.rawUrl || `https://x${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
    const dateParam = url.searchParams.get('date'); // volitelně ?date=YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);
    const key = dateParam || today;

    if (event.httpMethod === 'GET') {
      // načti pole záznamů pro daný den
      const raw = await store.get(key);
      const list = raw ? JSON.parse(raw) : [];
      // vrať seřazené (nejrychlejší první)
      list.sort((a, b) => (a.msDuration || 0) - (b.msDuration || 0));
      return json(200, { date: key, items: list });
    }

    if (event.httpMethod === 'POST') {
      if (!event.body) return json(400, { error: 'Missing body' });
      const { nick, time, duration, category, msDuration } = JSON.parse(event.body || '{}');

      if (!nick || !time || !duration || !category) {
        return json(400, { error: 'Missing fields (nick, time, duration, category required)' });
      }

      // načti aktuální list
      const raw = await store.get(key);
      const list = raw ? JSON.parse(raw) : [];

      // přidej nový záznam
      list.push({
        nick: String(nick).trim() || 'Anon',
        time,
        duration,
        category,
        msDuration: Number(msDuration) || null,
        ts: Date.now(),
      });

      // seřaď podle nejrychlejších (msDuration; fallback: podle ts)
      list.sort((a, b) => {
        const am = a.msDuration ?? Number.MAX_SAFE_INTEGER;
        const bm = b.msDuration ?? Number.MAX_SAFE_INTEGER;
        if (am !== bm) return am - bm;
        return (a.ts || 0) - (b.ts || 0);
      });

      // nech jen TOP 300
      const trimmed = list.slice(0, 300);

      // ulož zpět
      await store.set(key, JSON.stringify(trimmed));

      return json(200, { ok: true, date: key, count: trimmed.length });
    }

    return json(405, { error: 'Method Not Allowed' });
  } catch (err) {
    return json(500, { error: String(err?.message || err) });
  }
}
