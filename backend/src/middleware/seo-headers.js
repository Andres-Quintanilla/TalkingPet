// src/middleware/seo-headers.js
import compression from 'compression';

export function seoHeaders() {
    return (req, res, next) => {
        // Sugerir canonical al front (el front igualmente lo pondrá con Helmet)
        const base = process.env.PUBLIC_BASE_URL || 'http://localhost:5173';
        const canonical = new URL(req.originalUrl, base).toString();
        res.setHeader('Link', `<${canonical}>; rel="canonical"`);

        // Caching suave para GETs públicos de catálogo
        if (req.method === 'GET' && /^\/api\/(products|services|courses)/.test(req.path)) {
            res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
        }

        next();
    };
}

export const gzipCompression = compression(); // úsalo en index.js
