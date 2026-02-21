import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SeoSettings from '../models/SeoSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Path to frontend index.html ──────────────────────────────────────────────
// Works for both local dev (sibling dirs) and production (same server).
const INDEX_HTML_PATH = path.resolve(__dirname, '../../frontend/index.html');

// ─── HTML block helpers ───────────────────────────────────────────────────────

/** Extract raw content between <!-- SEO:block --> and <!-- /SEO:block --> */
function extractBlock(html, block) {
    const open = `<!-- SEO:${block} -->`;
    const close = `<!-- /SEO:${block} -->`;
    const start = html.indexOf(open);
    const end = html.indexOf(close);
    if (start === -1 || end === -1) return '';
    return html.slice(start + open.length, end).trim();
}

/**
 * Replace everything between <!-- SEO:block --> and <!-- /SEO:block --> with
 * newContent, preserving the markers themselves and leading indentation.
 */
function replaceBlock(html, block, newContent) {
    const open = `<!-- SEO:${block} -->`;
    const close = `<!-- /SEO:${block} -->`;
    const start = html.indexOf(open);
    const end = html.indexOf(close);
    if (start === -1 || end === -1) return html;

    // Detect leading whitespace of the closing tag (for consistent indentation)
    const lineStart = html.lastIndexOf('\n', end) + 1;
    const indent = html.slice(lineStart, end).match(/^(\s*)/)[1];

    return (
        html.slice(0, start + open.length) +
        '\n' +
        newContent +
        '\n' + indent +
        html.slice(end)
    );
}

// ─── Write index.html from settings ──────────────────────────────────────────

async function updateIndexHtml(settings) {
    if (!existsSync(INDEX_HTML_PATH)) {
        console.warn('[SEO] index.html not found at', INDEX_HTML_PATH, '— skipping');
        return;
    }

    let html = await readFile(INDEX_HTML_PATH, 'utf-8');

    // ── <title> ────────────────────────────────────────────────────────────────
    html = replaceBlock(
        html, 'title',
        `    <title>${settings.siteTitle}</title>`
    );

    // ── Meta description + keywords ────────────────────────────────────────────
    html = replaceBlock(
        html, 'meta',
        [
            `    <meta name="description" content="${settings.metaDescription}" />`,
            `    <meta name="keywords"    content="${settings.keywords}" />`,
            `    <meta name="author"      content="انطلاقة" />`,
        ].join('\n')
    );

    // ── Open Graph / Twitter ───────────────────────────────────────────────────
    html = replaceBlock(
        html, 'og',
        [
            `    <!-- Open Graph / Social Media Tags -->`,
            `    <meta property="og:title"       content="${settings.ogTitle}" />`,
            `    <meta property="og:description" content="${settings.ogDescription}" />`,
            `    <meta property="og:type"        content="website" />`,
            `    <meta property="og:image"       content="${settings.ogImage}" />`,
            `    <meta name="twitter:card"        content="summary_large_image" />`,
            `    <meta name="twitter:title"       content="${settings.ogTitle}" />`,
            `    <meta name="twitter:description" content="${settings.ogDescription}" />`,
        ].join('\n')
    );

    // ── Analytics / Tracking ───────────────────────────────────────────────────
    const chunks = [];

    if (settings.gtmId) {
        chunks.push(
            `    <!-- Google Tag Manager -->`,
            `    <script async src="https://www.googletagmanager.com/gtag/js?id=${settings.gtmId}"></script>`,
            `    <script>`,
            `      window.dataLayer = window.dataLayer || [];`,
            `      function gtag(){dataLayer.push(arguments);}`,
            `      gtag('js', new Date());`,
            `      gtag('config', '${settings.gtmId}');`,
            `    </script>`
        );
    }

    if (settings.gaId) {
        chunks.push(
            `    <!-- Google Analytics GA4 -->`,
            `    <script async src="https://www.googletagmanager.com/gtag/js?id=${settings.gaId}"></script>`,
            `    <script>`,
            `      window.dataLayer = window.dataLayer || [];`,
            `      function gtag(){dataLayer.push(arguments);}`,
            `      gtag('js', new Date());`,
            `      gtag('config', '${settings.gaId}');`,
            `    </script>`
        );
    }

    if (settings.fbPixel) {
        chunks.push(
            `    <!-- Facebook Pixel -->`,
            `    <script>`,
            `      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`,
            `      fbq('init', '${settings.fbPixel}');`,
            `      fbq('track', 'PageView');`,
            `    </script>`
        );
    }

    if (settings.tiktokPixel) {
        chunks.push(
            `    <!-- TikTok Pixel -->`,
            `    <script>`,
            `      !function (w, d, t) {`,
            `        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._r=ttq._r||{},n&&(ttq._r[e]=n);var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)},ttq.load('${settings.tiktokPixel}'),ttq.page();`,
            `      }(window, document, 'ttq');`,
            `    </script>`
        );
    }

    if (chunks.length === 0) {
        chunks.push('    <!-- No analytics configured -->');
    }

    html = replaceBlock(html, 'analytics', chunks.join('\n'));

    await writeFile(INDEX_HTML_PATH, html, 'utf-8');
    console.log('[SEO] index.html updated successfully.');
}

// ─── Read index.html → extract current SEO values ────────────────────────────

async function readSeoFromHtml() {
    if (!existsSync(INDEX_HTML_PATH)) return {};

    const html = await readFile(INDEX_HTML_PATH, 'utf-8');

    // title
    const titleBlock = extractBlock(html, 'title');
    const titleM = titleBlock.match(/<title>([\s\S]*?)<\/title>/i);
    const siteTitle = titleM ? titleM[1].trim() : '';

    // meta
    const metaBlock = extractBlock(html, 'meta');
    const descM = metaBlock.match(/name=["']description["']\s+content=["']([^"']*)["']/i);
    const kwM = metaBlock.match(/name=["']keywords["']\s+content=["']([^"']*)["']/i);
    const metaDescription = descM ? descM[1] : '';
    const keywords = kwM ? kwM[1] : '';

    // og
    const ogBlock = extractBlock(html, 'og');
    const ogTM = ogBlock.match(/property=["']og:title["']\s+content=["']([^"']*)["']/i);
    const ogDM = ogBlock.match(/property=["']og:description["']\s+content=["']([^"']*)["']/i);
    const ogIM = ogBlock.match(/property=["']og:image["']\s+content=["']([^"']*)["']/i);
    const ogTitle = ogTM ? ogTM[1] : '';
    const ogDescription = ogDM ? ogDM[1] : '';
    const ogImage = ogIM ? ogIM[1] : '/logo.png';

    // analytics
    const analyticsBlock = extractBlock(html, 'analytics');

    // GTM / GA ID from gtag.js?id=
    const allGtagIds = [...analyticsBlock.matchAll(/gtag\.js\?id=([\w-]+)/gi)].map(m => m[1]);
    const gtmId = allGtagIds[0] || '';

    // GA4 — second distinct config call
    const allConfigs = [...analyticsBlock.matchAll(/gtag\(['"]config['"],\s*['"]([^'"]+)['"]\)/gi)].map(m => m[1]);
    const gaId = allConfigs.find(id => id !== gtmId) || '';

    // Facebook pixel
    const fbM = analyticsBlock.match(/fbq\(['"]init['"],\s*['"]([^'"]+)['"]\)/i);
    const fbPixel = fbM ? fbM[1] : '';

    // TikTok pixel
    const ttqM = analyticsBlock.match(/ttq\.load\(['"]([^'"]+)['"]\)/i);
    const tiktokPixel = ttqM ? ttqM[1] : '';

    return {
        siteTitle, metaDescription, keywords,
        ogTitle, ogDescription, ogImage,
        gtmId, gaId, fbPixel, tiktokPixel,
    };
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /api/seo
 * Returns the singleton SEO document.
 * Creates it by reading index.html if it doesn't exist yet.
 */
export const getSeoSettings = async (req, res) => {
    try {
        let settings = await SeoSettings.findOne({ key: 'main' });

        if (!settings) {
            const htmlValues = await readSeoFromHtml();
            settings = await SeoSettings.create({ key: 'main', ...htmlValues });
            console.log('[SEO] Bootstrapped DB from index.html.');
        }

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error('[SEO] getSeoSettings error:', error);
        res.status(500).json({ success: false, message: 'خطأ في جلب إعدادات SEO' });
    }
};

/**
 * PUT /api/seo
 * Saves to DB and rewrites index.html atomically.
 */
export const updateSeoSettings = async (req, res) => {
    try {
        const ALLOWED = [
            'siteTitle', 'metaDescription', 'keywords',
            'ogTitle', 'ogDescription', 'ogImage',
            'googleConsole', 'robotsTxt', 'sitemap',
            'gtmId', 'gaId', 'fbPixel', 'tiktokPixel',
        ];

        const update = {};
        ALLOWED.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

        const settings = await SeoSettings.findOneAndUpdate(
            { key: 'main' },
            { $set: update },
            { new: true, upsert: true, runValidators: true }
        );

        await updateIndexHtml(settings);

        res.status(200).json({
            success: true,
            message: 'تم تحديث إعدادات SEO بنجاح',
            data: settings,
        });
    } catch (error) {
        console.error('[SEO] updateSeoSettings error:', error);
        res.status(500).json({ success: false, message: 'خطأ في تحديث إعدادات SEO' });
    }
};

/**
 * POST /api/seo/sync
 * Re-reads index.html and overwrites the DB — useful one-time import.
 */
export const syncSeoFromHtml = async (req, res) => {
    try {
        const htmlValues = await readSeoFromHtml();

        const settings = await SeoSettings.findOneAndUpdate(
            { key: 'main' },
            { $set: htmlValues },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'تمت مزامنة إعدادات SEO من ملف index.html بنجاح',
            data: settings,
        });
    } catch (error) {
        console.error('[SEO] syncSeoFromHtml error:', error);
        res.status(500).json({ success: false, message: 'خطأ في مزامنة إعدادات SEO' });
    }
};
