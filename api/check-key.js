import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { key } = req.query;
    
    if (!key) {
        return res.status(400).json({ error: 'Key parameter required' });
    }
    
    try {
        const keyData = await kv.get(`key:${key}`);
        
        if (!keyData) {
            return res.json({ valid: false, message: 'Key not found' });
        }
        
        if (Date.now() > keyData.expiry) {
            await kv.del(`key:${key}`);
            return res.json({ valid: false, message: 'Key has expired' });
        }
        
        return res.json({
            valid: true,
            expiry: keyData.expiry,
            created: keyData.created,
            hwid_locked: keyData.hwid !== null
        });
    } catch (error) {
        console.error('Check error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
