import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { key, hwid } = req.query;
    
    if (!key || !hwid) {
        return res.status(400).json({ valid: false, error: 'Missing parameters' });
    }
    
    try {
        // Get key data from KV store
        const keyData = await kv.get(`key:${key}`);
        
        if (!keyData) {
            return res.json({ valid: false, message: 'Key not found' });
        }
        
        // Check if key is expired
        if (Date.now() > keyData.expiry) {
            await kv.del(`key:${key}`);
            return res.json({ valid: false, message: 'Key expired' });
        }
        
        // Check HWID
        if (keyData.hwid === null) {
            // First time using this key - lock it to this HWID
            keyData.hwid = hwid;
            await kv.set(`key:${key}`, keyData);
            return res.json({ valid: true });
        } else if (keyData.hwid === hwid) {
            // HWID matches
            return res.json({ valid: true });
        } else {
            // HWID mismatch
            return res.json({ valid: false, message: 'Invalid HWID' });
        }
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(500).json({ valid: false, error: 'Internal server error' });
    }
}
