import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * Grabby Sync Plugin for Vite
 * Handles POST requests to /__grabby_sync and writes element data to .grabbed_element
 */
export const grabbySyncPlugin = (): Plugin => ({
    name: 'grabby-sync-plugin',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url === '/__grabby_sync' && req.method === 'POST') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);

                        if (!data.tagName) throw new Error('Invalid payload');

                        const filePath = path.resolve(process.cwd(), '.grabbed_element');

                        fs.writeFileSync(
                            filePath,
                            JSON.stringify(
                                {
                                    ...data,
                                    timestamp: new Date().toISOString(),
                                },
                                null,
                                2
                            )
                        );

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: true }));
                    } catch (e: any) {
                        res.statusCode = 500;
                        res.end(`Sync Failed: ${e.message}`);
                    }
                });
            } else {
                next();
            }
        });
    },
});
