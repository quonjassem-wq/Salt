import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = 'SALTY-WAS-HEREWITHSUGAR_ezez.meow.ez.kidd_keno';

function generateRandomKey() {
    return 'SALT-' + Math.random().toString(36).substring(2, 15).toUpperCase();
}

export default async function handler(req, res) {
    // Enable CORS and set content type
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { password, duration, hwid_limit } = req.body;
    
    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Validate inputs
    if (!duration || duration < 1) {
        return res.status(400).json({ error: 'Invalid duration' });
    }
    
    try {
        const key = generateRandomKey();
        const expiry = Date.now() + (duration * 24 * 60 * 60 * 1000);
        
        const keyData = {
            key: key,
            created: Date.now(),
            expiry: expiry,
            duration: duration,
            hwid: null,
            hwid_limit: hwid_limit || 1
        };
        
        await kv.set(`key:${key}`, keyData);
        
        return res.json({
            success: true,
            key: key,
            expiry: new Date(expiry).toISOString(),
            duration: duration
        });
    } catch (error) {
        console.error('Generation error:', error);
        return res.status(500).json({ error: 'Failed to generate key' });
    }
}
