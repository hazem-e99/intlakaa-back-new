import dotenv from 'dotenv';
import connectDB from './config/database.js';
import SeoSettings from './models/SeoSettings.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');
const INDEX_HTML_PATH = path.join(FRONTEND_DIR, 'index.html');

dotenv.config();

function extractBlock(html, block) {
    const open = `<!-- SEO:${block} -->`;
    const close = `<!-- /SEO:${block} -->`;
    const start = html.indexOf(open);
    const end = html.indexOf(close);
    if (start === -1 || end === -1) return '';
    return html.slice(start + open.length, end).trim();
}

function replaceBlock(html, block, newContent) {
    const open = `<!-- SEO:${block} -->`;
    const close = `<!-- /SEO:${block} -->`;
    const start = html.indexOf(open);
    const end = html.indexOf(close);
    if (start === -1 || end === -1) return html;
    const lineStart = html.lastIndexOf('\n', end) + 1;
    const indent = html.slice(lineStart, end).match(/^(\s*)/)[1];
    return html.slice(0, start + open.length) + '\n' + newContent + '\n' + indent + html.slice(end);
}

async function run() {
    await connectDB();
    const settings = await SeoSettings.findOne({ key: 'main' });
    if (!settings) return console.log('No settings found');

    let html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

    html = replaceBlock(html, 'title', `  <title>${settings.siteTitle}</title>`);
    html = replaceBlock(
        html, 'meta',
        [
            `  <meta name="description" content="${settings.metaDescription}" />`,
            `  <meta name="keywords"    content="${settings.keywords}" />`,
            `  <meta name="author"      content="انطلاقة" />`,
        ].join('\n')
    );
    html = replaceBlock(
        html, 'og',
        [
            `  <!-- Open Graph / Social Media Tags -->`,
            `  <meta property="og:title"       content="${settings.ogTitle}" />`,
            `  <meta property="og:description" content="${settings.ogDescription}" />`,
            `  <meta property="og:type"        content="website" />`,
            `  <meta property="og:image"       content="${settings.ogImage}" />`,
            settings.ogUrl ? `  <meta property="og:url"         content="${settings.ogUrl}" />` : '',
            `  <meta name="twitter:card"        content="summary_large_image" />`,
            `  <meta name="twitter:title"       content="${settings.ogTitle}" />`,
            `  <meta name="twitter:description" content="${settings.ogDescription}" />`,
        ].filter(Boolean).join('\n')
    );

    html = replaceBlock(
        html, 'googleConsole',
        settings.googleConsole
            ? `  <meta name="google-site-verification" content="${settings.googleConsole}" />`
            : `  <!-- No Google Console configured -->`
    );

    let chunks = [];
    if (settings.gtmId) {
        chunks.push(
            `  <!-- Google Tag Manager -->`,
            `  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
            `  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`,
            `  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`,
            `  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
            `  })(window,document,'script','dataLayer','${settings.gtmId}');</script>`,
            `  <!-- End Google Tag Manager -->`
        );
    }
    if (settings.gaId) {
        chunks.push(
            `  <!-- Google Analytics -->`,
            `  <script async src="https://www.googletagmanager.com/gtag/js?id=${settings.gaId}"></script>`,
            `  <script>`,
            `    window.dataLayer = window.dataLayer || [];`,
            `    function gtag(){dataLayer.push(arguments);}`,
            `    gtag('js', new Date());`,
            `    gtag('config', '${settings.gaId}');`,
            `  </script>`
        );
    }
    if (settings.fbPixel) {
        chunks.push(
            `  <!-- Facebook Pixel -->`,
            `  <script>`,
            `    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`,
            `    fbq('init', '${settings.fbPixel}');`,
            `    fbq('track', 'PageView');`,
            `  </script>`,
            `  <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${settings.fbPixel}&ev=PageView&noscript=1"/></noscript>`,
            `  <!-- End Facebook Pixel -->`
        );
    }
    if (settings.tiktokPixel) {
        chunks.push(
            `  <!-- TikTok Pixel -->`,
            `  <script>`,
            `    !function (w, d, t) {`,
            `      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};`,
            `      ttq.load('${settings.tiktokPixel}');`,
            `      ttq.page();`,
            `    }(window, document, 'ttq');`,
            `  </script>`
        );
    }
    if (chunks.length === 0) {
        chunks.push('  <!-- No analytics configured -->');
    }
    html = replaceBlock(html, 'analytics', chunks.join('\n'));

    const gtmBodyContent = settings.gtmId
        ? [
            `  <!-- Google Tag Manager (noscript) -->`,
            `  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtmId}"`,
            `  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
            `  <!-- End Google Tag Manager (noscript) -->`,
        ].join('\n')
        : `  <!-- No GTM configured -->`;
    html = replaceBlock(html, 'gtm-body', gtmBodyContent);

    fs.writeFileSync(INDEX_HTML_PATH, html, 'utf-8');
    console.log('Successfully updated local index.html with live DB data.');
    process.exit(0);
}
run();
