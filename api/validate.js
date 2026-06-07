import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'GET') return res.status(405).json({ valid: false, error: 'Method not allowed' });
    const { key, hwid } = req.query;
    if (!key || !hwid) return res.status(400).json({ valid: false, error: 'Missing parameters' });
    try {
        const keyData = await kv.get(`key:${key}`);
        if (!keyData) return res.json({ valid: false, message: 'Key not found' });
        if (Date.now() > keyData.expiry) { await kv.del(`key:${key}`); return res.json({ valid: false, message: 'Key expired' }); }
        if (keyData.hwid === null) { keyData.hwid = hwid; await kv.set(`key:${key}`, keyData); return res.json({ valid: true }); }
        if (keyData.hwid === hwid) return res.json({ valid: true });
        return res.json({ valid: false, message: 'HWID mismatch' });
    } catch (error) { return res.status(500).json({ valid: false, error: 'Internal error' }); }
}
