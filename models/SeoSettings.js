import mongoose from 'mongoose';

const seoSettingsSchema = new mongoose.Schema({
    // We use a singleton document identified by this key
    key: {
        type: String,
        default: 'main',
        unique: true,
    },

    // ── General ──────────────────────────────────────────────
    siteTitle: {
        type: String,
        default: 'انطلاقة | وكالة تسويق',
        trim: true,
    },
    metaDescription: {
        type: String,
        default: 'بنساعدك تخلي نموك أسرع وحملاتك أذكى مع استراتيجيات تسويقية قائمة على النتائج',
        trim: true,
    },
    keywords: {
        type: String,
        default: 'تسويق, نمو, انطلاقة, أعمال, استراتيجية تسويقية',
        trim: true,
    },

    // ── Social / Open Graph ───────────────────────────────────
    ogTitle: {
        type: String,
        default: 'انطلاقة | وكالة تسويق رائدة',
        trim: true,
    },
    ogDescription: {
        type: String,
        default: 'بنساعدك تخلي نموك أسرع وحملاتك أذكى مع استراتيجيات تسويقية قائمة على النتائج',
        trim: true,
    },
    ogImage: {
        type: String,
        default: '/logo.png',
        trim: true,
    },
    ogUrl: {
        type: String,
        default: 'https://intlakaa.com',
        trim: true,
    },

    // ── Search / Webmaster ────────────────────────────────────
    googleConsole: {
        type: String,
        default: '',
        trim: true,
    },
    robotsTxt: {
        type: String,
        default: 'User-agent: *\nAllow: /',
    },
    sitemap: {
        type: String,
        default: 'https://intlakaa.com/sitemap.xml',
        trim: true,
    },

    // ── Analytics / Tracking ──────────────────────────────────
    gtmId: {
        type: String,
        default: 'GTM-P2WMX4TV',
        trim: true,
    },
    gaId: {
        type: String,
        default: '',
        trim: true,
    },
    fbPixel: {
        type: String,
        default: '',
        trim: true,
    },
    tiktokPixel: {
        type: String,
        default: '',
        trim: true,
    },

    // ── Social Media Links (dynamic array) ────────────────────
    socialLinks: {
        type: [{
            icon:  { type: String, default: 'globe', trim: true },
            url:   { type: String, default: '',     trim: true },
            label: { type: String, default: '',     trim: true },
        }],
        default: [
            { icon: 'tiktok',   url: 'https://www.tiktok.com/@qualified.leads.ksa',  label: 'TikTok'   },
            { icon: 'facebook', url: 'https://www.facebook.com/share/1Vv4xzKZyu',    label: 'Facebook' },
            { icon: 'linkedin', url: 'https://www.linkedin.com/company/intlakaa/',    label: 'LinkedIn' },
        ],
    },
}, {
    timestamps: true,
});

const SeoSettings = mongoose.model('SeoSettings', seoSettingsSchema);

export default SeoSettings;
