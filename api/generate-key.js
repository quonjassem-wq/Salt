import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = 'SALTY-WAS-HEREWITHSUGAR_ezez.meow.ez.kidd_keno';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { password, duration } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    const key = 'SALT-' + Math.random().toString(36).substring(2, 15).toUpperCase();
    const expiry = Date.now() + (duration * 24 * 60 * 60 * 1000);
    await kv.set(`key:${key}`, { key, created: Date.now(), expiry, duration, hwid: null });
    res.json({ success: true, key, expiry: new Date(expiry).toISOString(), duration });
}
