// server.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');

// [WAFFLE] Media gateway
const mediaGateway = require('./media-gateway');

// Load environment variables from .env
require('dotenv').config();

const app = express();
const STRAPI_URL = process.env.STRAPI_URL || 'https://api.heartbeatacic.org';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || '.heartbeatacic.org';
const API_BASE_PATH = process.env.HB_STRAPI_API_BASE || '/api';
const REFRESH_COOKIE_NAME = process.env.HB_REFRESH_COOKIE || 'hb_refresh';
const PROXY_SECURE = process.env.STRAPI_PROXY_SECURE !== 'false';
const AUTH_DEBUG = process.env.HB_AUTH_DEBUG === 'true';

// HTTPS PORT
const PORT = parseInt(process.env.PORT, 10) || 3230;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

// === Load Local Development SSL Certificates ===
let sslOptions;
if (USE_HTTPS) {
    const DEFAULT_SSL_KEY_PATH = path.join(__dirname, 'key.pem');
    const DEFAULT_SSL_CERT_PATH = path.join(__dirname, 'cert.pem');
    const CERT_KEY_PATH = process.env.SSL_KEY_PATH || DEFAULT_SSL_KEY_PATH;
    const CERT_CERT_PATH = process.env.SSL_CERT_PATH || DEFAULT_SSL_CERT_PATH;

    if (fs.existsSync(CERT_KEY_PATH) && fs.existsSync(CERT_CERT_PATH)) {
        sslOptions = {
            key: fs.readFileSync(CERT_KEY_PATH),
            cert: fs.readFileSync(CERT_CERT_PATH),
        };
    } else {
        console.error('❌ SSL certificate files not found!');
        console.error(`- Key file expected at: ${CERT_KEY_PATH}`);
        console.error(`- Cert file expected at: ${CERT_CERT_PATH}`);
        console.error('💡 To run with HTTPS, please generate them or update SSL_KEY_PATH and SSL_CERT_PATH in your .env file.');
        process.exit(1);
    }
}

// --- Middleware ---
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            "style-src": [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net"
            ],
            "font-src": [
                "'self'",
                "https://fonts.gstatic.com",
                "https://cdnjs.cloudflare.com",
                "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/",
                "data:"
            ],
            "connect-src": [
                "'self'",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com",
                "https://images.unsplash.com",
                "https://upload.wikimedia.org",
                "https://en.wikipedia.org"
            ],
            "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://upload.wikimedia.org"],
            "frame-src": ["'self'", "https://maps.google.com", "https://www.google.com"],
        },
    })
);

app.use(cors());

// [WAFFLE] Mount wiki / Waffle media gateway BEFORE Strapi proxy
mediaGateway.mountWiki(app, { basePath: '/api/v2/wiki' });

const rewriteSetCookieDomain = (proxyRes) => {
    const cookies = proxyRes.headers['set-cookie'];
    if (!cookies || !COOKIE_DOMAIN) {
        return;
    }

    const updated = cookies.map((cookie) =>
        cookie.replace(/Domain=[^;]+/i, `Domain=${COOKIE_DOMAIN}`)
    );

    proxyRes.headers['set-cookie'] = updated;
};

const normalizedApiBase = API_BASE_PATH.endsWith('/') && API_BASE_PATH !== '/' ? API_BASE_PATH.slice(0, -1) : API_BASE_PATH;

app.get('/config.js', (req, res) => {
    const clientBase = normalizedApiBase || '/api';
    res.type('application/javascript');
    res.send(
        `window.__HB_STRAPI_URL__ = '${clientBase}';` +
        ` window.__HB_REFRESH_COOKIE__ = '${REFRESH_COOKIE_NAME}';` +
        ` window.__HB_AUTH_DEBUG__ = ${AUTH_DEBUG};`
    );
});

if (AUTH_DEBUG) {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`[auth-debug] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
        });
        next();
    });
}

const targetApiPrefix = '/api';

app.use(normalizedApiBase, createProxyMiddleware({
    target: STRAPI_URL,
    changeOrigin: true,
    secure: PROXY_SECURE,
    pathRewrite: (path) => {
        const patchedPath = path.startsWith('/') ? `${targetApiPrefix}${path}` : `${targetApiPrefix}/${path}`;
        return patchedPath.replace(/\/+/g, '/');
    },
    onProxyReq: (proxyReq, req) => {
        if (req.headers.cookie) {
            proxyReq.setHeader('cookie', req.headers.cookie);
        }
        if (AUTH_DEBUG) {
            console.log(`[auth-debug] proxy -> ${req.method} ${proxyReq.path}`);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        if (AUTH_DEBUG) {
            console.log(`[auth-debug] proxy <- ${req.method} ${req.originalUrl} ${proxyRes.statusCode}`);
        }
        rewriteSetCookieDomain(proxyRes);
    },
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/static', express.static(path.join(__dirname, 'frontend/static')));

// Catch-all route for SPA client-side routing
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

// Start HTTPS server
if (USE_HTTPS) {
    const server = https.createServer(sslOptions, app);
    server.on('error', (err) => {
        console.error('❌ Server failed to start:', err);
        process.exit(1);
    });
    server.listen(PORT, () => {
        console.log(`🔥 HTTPS Server running at https://dev.heartbeat.local:${PORT}`);
        console.log(`   Also available at: https://localhost:${PORT}`);
    })
} else {
    app.set('trust proxy', true);
    http.createServer(app).listen(PORT, () => {
        console.log(`⬢ HTTP Server running at http://localhost:${PORT}`);
    });
}
