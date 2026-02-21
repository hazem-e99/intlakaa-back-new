import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SeoSettings from '../models/SeoSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to frontend index.html  — adjust if your deploy structure differs
const INDEX_HTML_PATH = path.resolve(__dirname, '../../frontend/index.html');

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Replace the content between <!-- SEO:block --> and <!-- /SEO:block --> markers.
 */
function replaceBlock(html, block, newContent) {
    const open = `<!-- SEO:${block} -->`;
    const close = `<!-- /SEO:${block} -->`;
    const start = html.indexOf(open);
    const end = html.indexOf(close);
    if (start === -1 || end === -1) return html;
    return (
        html.slice(0, start + open.length) +
        '\n' +
        newContent +
        '\n    ' +
        html.slice(end)
    );
}

/**
 * Rewrite the SEO sections of index.html based on the settings document.
 */
async function updateIndexHtml(settings) {
    if (!existsSync(INDEX_HTML_PATH)) {
        console.warn('index.html not found at', INDEX_HTML_PATH, '— skipping HTML update');
        return;
    }

    let html = await readFile(INDEX_HTML_PATH, 'utf-8');

    // ── title ──────────────────────────────────────────────
    html = replaceBlock(
        html,
        'title',
        `    <title>${settings.siteTitle}</title>`
    );

    // ── meta description + keywords ───────────────────────
    html = replaceBlock(
        html,
        'meta',
        `    <meta name="description" content="${settings.metaDescription}" />\n` +
        `    <meta name="keywords" content="${settings.keywords}" />\n` +
        `    <meta name="author" content="انطلاقة" />`
    );

    // ── Open Graph ────────────────────────────────────────
    html = replaceBlock(
        html,
        'og',
        `    <!-- Open Graph / Social Media Tags -->\n` +
        `    <meta property="og:title" content="${settings.ogTitle}" />\n` +
        `    <meta property="og:description" content="${settings.ogDescription}" />\n` +
        `    <meta property="og:type" content="website" />\n` +
        `    <meta property="og:image" content="${settings.ogImage}" />\n` +
        `    <meta name="twitter:card" content="summary_large_image" />\n` +
        `    <meta name="twitter:title" content="${settings.ogTitle}" />\n` +
        `    <meta name="twitter:description" content="${settings.ogDescription}" />`
    );

    // ── Analytics / Tracking ──────────────────────────────
    let analyticsBlock = '';

    if (settings.gtmId) {
        analyticsBlock +=
            `    <!-- Google Tag Manager -->\n` +
            `    <script async src="https://www.googletagmanager.com/gtag/js?id=${settings.gtmId}"></script>\n` +
            `    <script>\n` +
            `      window.dataLayer = window.dataLayer || [];\n` +
            `      function gtag(){dataLayer.push(arguments);}\n` +
            `      gtag('js', new Date());\n` +
            `      gtag('config', '${settings.gtmId}');\n` +
            `    </script>\n`;
    }

    if (settings.gaId) {
        analyticsBlock +=
            `    <!-- Google Analytics GA4 -->\n` +
            `    <script async src="https://www.googletagmanager.com/gtag/js?id=${settings.gaId}"></script>\n` +
            `    <script>\n` +
            `      window.dataLayer = window.dataLayer || [];\n` +
            `      function gtag(){dataLayer.push(arguments);}\n` +
            `      gtag('js', new Date());\n` +
            `      gtag('config', '${settings.gaId}');\n` +
            `    </script>\n`;
    }

    if (settings.fbPixel) {
        analyticsBlock +=
            `    <!-- Facebook Pixel -->\n` +
            `    <script>\n` +
            `      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');\n` +
            `      fbq('init', '${settings.fbPixel}');\n` +
            `      fbq('track', 'PageView');\n` +
            `    </script>\n`;
    }

    if (settings.tiktokPixel) {
        analyticsBlock +=
            `    <!-- TikTok Pixel -->\n` +
            `    <script>\n` +
            `      !function (w, d, t) {\n` +
            `        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._r=ttq._r||{},n&&(ttq._r[e]=n);var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)},ttq.load('${settings.tiktokPixel}'),ttq.page();\n` +
            `      }(window, document, 'ttq');\n` +
            `    </script>\n`;
    }

    if (!analyticsBlock) {
        analyticsBlock = '    <!-- No analytics configured -->';
    }

    html = replaceBlock(html, 'analytics', analyticsBlock.trimEnd());

    await writeFile(INDEX_HTML_PATH, html, 'utf-8');
}

// ─── controllers ─────────────────────────────────────────────────────────────

/**
 * GET /api/seo
 * Returns the single SEO settings document (creates it if it doesn't exist).
 */
export const getSeoSettings = async (req, res) => {
    try {
        let settings = await SeoSettings.findOne({ key: 'main' });

        if (!settings) {
            settings = await SeoSettings.create({ key: 'main' });
        }

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error('getSeoSettings error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب إعدادات SEO',
        });
    }
};

/**
 * PUT /api/seo
 * Updates (or creates) the SEO settings document and rewrites index.html.
 */
export const updateSeoSettings = async (req, res) => {
    try {
        const allowedFields = [
            'siteTitle', 'metaDescription', 'keywords',
            'ogTitle', 'ogDescription', 'ogImage',
            'googleConsole', 'robotsTxt', 'sitemap',
            'gtmId', 'gaId', 'fbPixel', 'tiktokPixel',
        ];

        const update = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                update[field] = req.body[field];
            }
        });

        const settings = await SeoSettings.findOneAndUpdate(
            { key: 'main' },
            { $set: update },
            { new: true, upsert: true, runValidators: true }
        );

        // Reflect the changes in index.html
        await updateIndexHtml(settings);

        res.status(200).json({
            success: true,
            message: 'تم تحديث إعدادات SEO بنجاح',
            data: settings,
        });
    } catch (error) {
        console.error('updateSeoSettings error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث إعدادات SEO',
        });
    }
};
