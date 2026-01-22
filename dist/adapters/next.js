import fs from 'fs';
import path from 'path';
/**
 * Grabby Sync Handler for Next.js (Pages Router)
 */
export function createGrabbyHandler() {
    return async (req, res) => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        try {
            const data = req.body;
            if (!data.tagName) {
                throw new Error('Invalid payload');
            }
            const filePath = path.resolve(process.cwd(), '.grabbed_element');
            fs.writeFileSync(filePath, JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
            }, null, 2));
            return res.status(200).json({ success: true });
        }
        catch (e) {
            return res.status(500).json({ error: `Sync Failed: ${e.message}` });
        }
    };
}
/**
 * Grabby Sync Handler for Next.js (App Router)
 */
export function createGrabbyAppHandler() {
    return async (req) => {
        if (req.method !== 'POST') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }
        try {
            const data = await req.json();
            if (!data.tagName) {
                throw new Error('Invalid payload');
            }
            const filePath = path.resolve(process.cwd(), '.grabbed_element');
            fs.writeFileSync(filePath, JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
            }, null, 2));
            return Response.json({ success: true });
        }
        catch (e) {
            return Response.json({ error: `Sync Failed: ${e.message}` }, { status: 500 });
        }
    };
}
// Default export for convenience (Pages Router)
export const POST = createGrabbyHandler();
