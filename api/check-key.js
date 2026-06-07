import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'Key required' });
    const keyData = await kv.get(`key:${key}`);
    if (!keyData) return res.json({ valid: false, message: 'Key not found' });
    if (Date.now() > keyData.expiry) { await kv.del(`key:${key}`); return res.json({ valid: false, message: 'Key expired' }); }
    res.json({ valid: true, expiry: keyData.expiry, created: keyData.created });
}
