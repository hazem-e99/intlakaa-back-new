import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SeoSettings from '../models/SeoSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Path to frontend files ──────────────────────────────────────────────────────
const FRONTEND_DIR = path.resolve(__dirname, '../../frontend');
const INDEX_HTML_PATH = path.join(FRONTEND_DIR, 'index.html');
const DIST_DIR = path.join(FRONTEND_DIR, 'dist');
const DIST_HTML_PATH = path.join(DIST_DIR, 'index.html');
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public');

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
        html, 'googleConsole',
        settings.googleConsole
            ? `    <meta name="google-site-verification" content="${settings.googleConsole}" />`
            : `    <!-- No Google Console configured -->`
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
            settings.ogUrl ? `    <meta property="og:url"         content="${settings.ogUrl}" />` : '',
            `    <meta name="twitter:card"        content="summary_large_image" />`,
            `    <meta name="twitter:title"       content="${settings.ogTitle}" />`,
            `    <meta name="twitter:description" content="${settings.ogDescription}" />`,
        ].filter(Boolean).join('\n')
    );

    // ── Analytics / Tracking ───────────────────────────────────────────────────
    const chunks = [];

    if (settings.gtmId) {
        chunks.push(
            `    <!-- Google Tag Manager -->`,
            `    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
            `    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`,
            `    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`,
            `    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
            `    })(window,document,'script','dataLayer','${settings.gtmId}');</script>`,
            `    <!-- End Google Tag Manager -->`
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
            `    </script>`,
            `    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${settings.fbPixel}&ev=PageView&noscript=1"/></noscript>`,
            `    <!-- End Facebook Pixel -->`
        );
    }

    if (settings.tiktokPixel) {
        chunks.push(
            `    <!-- TikTok Pixel -->`,
            `    <script>`,
            `      !function (w, d, t) {`,
            `        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};`,
            `        ttq.load('${settings.tiktokPixel}');`,
            `        ttq.page();`,
            `      }(window, document, 'ttq');`,
            `    </script>`
        );
    }

    if (chunks.length === 0) {
        chunks.push('    <!-- No analytics configured -->');
    }

    html = replaceBlock(html, 'analytics', chunks.join('\n'));

    // ── GTM noscript in <body> ──────────────────────────────────────────────
    const gtmBodyContent = settings.gtmId
        ? [
            `  <!-- Google Tag Manager (noscript) -->`,
            `  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtmId}"`,
            `  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
            `  <!-- End Google Tag Manager (noscript) -->`,
        ].join('\n')
        : `  <!-- No GTM configured -->`;

    html = replaceBlock(html, 'gtm-body', gtmBodyContent);

    await writeFile(INDEX_HTML_PATH, html, 'utf-8');
    console.log('[SEO] index.html updated successfully.');

    // Also update dist/index.html if it exists so live builds reflect the change immediately
    if (existsSync(DIST_HTML_PATH)) {
        try {
            let distHtml = await readFile(DIST_HTML_PATH, 'utf-8');

            // Re-apply replacements for dist html
            distHtml = replaceBlock(distHtml, 'title', `    <title>${settings.siteTitle}</title>`);

            distHtml = replaceBlock(
                distHtml, 'meta',
                [
                    `    <meta name="description" content="${settings.metaDescription}" />`,
                    `    <meta name="keywords"    content="${settings.keywords}" />`,
                    `    <meta name="author"      content="انطلاقة" />`,
                ].join('\n')
            );

            distHtml = replaceBlock(
                distHtml, 'og',
                [
                    `    <!-- Open Graph / Social Media Tags -->`,
                    `    <meta property="og:title"       content="${settings.ogTitle}" />`,
                    `    <meta property="og:description" content="${settings.ogDescription}" />`,
                    `    <meta property="og:type"        content="website" />`,
                    `    <meta property="og:image"       content="${settings.ogImage}" />`,
                    settings.ogUrl ? `    <meta property="og:url"         content="${settings.ogUrl}" />` : '',
                    `    <meta name="twitter:card"        content="summary_large_image" />`,
                    `    <meta name="twitter:title"       content="${settings.ogTitle}" />`,
                    `    <meta name="twitter:description" content="${settings.ogDescription}" />`,
                ].filter(Boolean).join('\n')
            );

            distHtml = replaceBlock(
                distHtml, 'googleConsole',
                settings.googleConsole
                    ? `    <meta name="google-site-verification" content="${settings.googleConsole}" />`
                    : `    <!-- No Google Console configured -->`
            );

            distHtml = replaceBlock(distHtml, 'analytics', chunks.join('\n'));

            // GTM noscript in body
            const distGtmBodyContent = settings.gtmId
                ? [
                    `  <!-- Google Tag Manager (noscript) -->`,
                    `  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtmId}"`,
                    `  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
                    `  <!-- End Google Tag Manager (noscript) -->`,
                ].join('\n')
                : `  <!-- No GTM configured -->`;
            distHtml = replaceBlock(distHtml, 'gtm-body', distGtmBodyContent);

            await writeFile(DIST_HTML_PATH, distHtml, 'utf-8');
            console.log('[SEO] dist/index.html updated successfully.');
        } catch (err) {
            console.error('[SEO] Failed to update dist/index.html:', err);
        }
    }

    // ── robots.txt — write content + append Sitemap: directive if provided ────
    async function updateFileSafe(filepath, content) {
        if (!content) return;
        try {
            await writeFile(filepath, content, 'utf-8');
            console.log(`[SEO] Updated ${filepath} successfully.`);
        } catch (err) {
            console.error(`[SEO] Failed to update ${filepath}:`, err);
        }
    }

    if (settings.robotsTxt) {
        // Append Sitemap directive if a sitemap URL is configured and not already present
        let robotsContent = settings.robotsTxt.trim();
        if (settings.sitemap && !robotsContent.includes('Sitemap:')) {
            robotsContent += `\nSitemap: ${settings.sitemap}`;
        }
        await updateFileSafe(path.join(PUBLIC_DIR, 'robots.txt'), robotsContent);
        if (existsSync(DIST_DIR)) {
            await updateFileSafe(path.join(DIST_DIR, 'robots.txt'), robotsContent);
        }
    }

    // Note: settings.sitemap is a URL (e.g. https://domain.com/sitemap.xml).
    // It is included in robots.txt (above) — we do NOT overwrite the sitemap.xml file with it.
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
    const ogUM = ogBlock.match(/property=["']og:url["']\s+content=["']([^"']*)["']/i);
    const ogTitle = ogTM ? ogTM[1] : '';
    const ogDescription = ogDM ? ogDM[1] : '';
    const ogImage = ogIM ? ogIM[1] : '/logo.png';
    const ogUrl = ogUM ? ogUM[1] : '';

    // googleConsole
    const gcBlock = extractBlock(html, 'googleConsole');
    const gcM = gcBlock.match(/name=["']google-site-verification["']\s+content=["']([^"']*)["']/i);
    const googleConsole = gcM ? gcM[1] : '';

    // analytics
    const analyticsBlock = extractBlock(html, 'analytics');

    // GTM ID — from proper GTM snippet: gtm.js?id=GTM-XXXXX
    const gtmM = analyticsBlock.match(/gtm\.js\?id=([\w-]+)/i);
    const gtmId = gtmM ? gtmM[1] : '';

    // GA4 ID — from gtag.js?id=G-XXXXX
    const gaM = analyticsBlock.match(/gtag\.js\?id=(G-[\w]+)/i);
    const gaId = gaM ? gaM[1] : '';

    // Facebook pixel
    const fbM = analyticsBlock.match(/fbq\(['"]init['"],\s*['"]([^'"]+)['"]\)/i);
    const fbPixel = fbM ? fbM[1] : '';

    // TikTok pixel
    const ttqM = analyticsBlock.match(/ttq\.load\(['"]([^'"]+)['"]\)/i);
    const tiktokPixel = ttqM ? ttqM[1] : '';

    return {
        siteTitle, metaDescription, keywords,
        ogTitle, ogDescription, ogImage, ogUrl, googleConsole,
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
            'ogTitle', 'ogDescription', 'ogImage', 'ogUrl',
            'googleConsole', 'robotsTxt', 'sitemap',
            'gtmId', 'gaId', 'fbPixel', 'tiktokPixel',
            'socialLinks',
        ];

        const update = {};
        ALLOWED.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

        // For socialLinks array, use direct $set to replace entire array
        if (update.socialLinks !== undefined && !Array.isArray(update.socialLinks)) {
            delete update.socialLinks;
        }

        const settings = await SeoSettings.findOneAndUpdate(
            { key: 'main' },
            { $set: update },
            { new: true, upsert: true, runValidators: true }
        );

        // await updateIndexHtml(settings); // Disabled because Frontend is dynamically injecting SEO from Vercel

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
