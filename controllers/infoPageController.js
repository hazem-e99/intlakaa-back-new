import InfoPage from '../models/InfoPage.js';

const DEFAULT_LINKS = [
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    url: 'https://wa.me/966568787605',
    image:
      'https://ugc.production.linktr.ee/3590d048-d96a-4606-8338-dac76d1a48d3_533761570-4297957723824509-3194316454661584700-n.jpeg?io=true&size=thumbnail-stack_v1_0',
    order: 0,
  },
  {
    id: 'website',
    title: 'انطلاقة | وكالة تسويق',
    url: 'http://www.intlakaa.com/',
    image: '',
    order: 1,
  },
  {
    id: 'tiktok-link',
    title: 'TikTok',
    url: 'https://www.tiktok.com/@intlakaa.agency',
    image:
      'https://ugc.production.linktr.ee/82da1d40-ed29-45e3-a163-cc2607c1c82f_1dc8a86b72b5d680dcde2374ad4a6dcd-tplv-tiktokx-cropcenter-1080-1080.jpeg?io=true&size=thumbnail-stack_v1_0',
    order: 2,
  },
  {
    id: 'instagram-link',
    title: 'Instagram',
    url: 'https://www.instagram.com/intlakaa',
    image:
      'https://ugc.production.linktr.ee/2d8650fd-3302-4ba7-81be-f6a06d482d63_504052853-17846473359492437-7154992245610807407-n.jpeg?io=true&size=thumbnail-stack_v1_0',
    order: 3,
  },
  { id: 'x-link', title: 'X', url: 'https://x.com/intlakaagency', image: '', order: 4 },
  {
    id: 'youtube-link',
    title: 'YouTube',
    url: 'https://www.youtube.com/@Intlakaa',
    image:
      'https://ugc.production.linktr.ee/7746f6a4-dadb-404b-a7a9-3dafa8889ce0_HFxc4PUm-p-4-Sm1C4IVeM4t6fEG-r7ddFT25J6THCoN2klbK8uespwwfAudmgNd3Ie-lF9H-s900-c-k-c0x00ffffff-no-rj.jpeg?io=true&size=thumbnail-stack_v1_0',
    order: 5,
  },
  {
    id: 'facebook-link',
    title: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61576778474038',
    image:
      'https://ugc.production.linktr.ee/3db1e027-89c2-4251-a59f-e49afedd96bb_503497365-734414275733658-3166475898612342096-n.jpeg?io=true&size=thumbnail-stack_v1_0',
    order: 6,
  },
  {
    id: 'snapchat-link',
    title: 'Snapchat',
    url: 'https://www.snapchat.com/add/intlakaagency',
    image:
      'https://ugc.production.linktr.ee/978c9167-490f-47b5-84a6-80ab22a25ca7_square.jpeg?io=true&size=thumbnail-stack_v1_0',
    order: 7,
  },
];

const DEFAULT_SOCIALS = [
  { id: 'tiktok', label: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/@intlakaa.agency', order: 0 },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/966568787605', order: 1 },
  { id: 'instagram', label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/intlakaa', order: 2 },
  { id: 'x', label: 'X', icon: 'x', url: 'https://x.com/intlakaagency', order: 3 },
  { id: 'youtube', label: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/@Intlakaa', order: 4 },
  { id: 'facebook', label: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/profile.php?id=61576778474038', order: 5 },
  { id: 'snapchat', label: 'Snapchat', icon: 'snapchat', url: 'https://www.snapchat.com/add/intlakaagency', order: 6 },
];

const DEFAULT_DOC = {
  key: 'main',
  profile: {
    name: 'Intlakaa',
    description:
      'انطلاقة | وكالة إعلانات وتسويق رقمي 📍السعودية نحوّل فكرتك لعلامة تجارية تنافس بالسوق  إدارة حسابات • إعلانات ممولة • تصميم • هوية',
    avatar:
      'https://ugc.production.linktr.ee/391ac9ba-4898-49fe-9782-2ea12248914c_1dc8a86b72b5d680dcde2374ad4a6dcd-tplv-tiktokx-cropcenter-1080-1080.jpeg?io=true&size=avatar-v3_0',
  },
  theme: {
    profileBg: '#eceef1',
    desktopFrame: '#cfd1d4',
    buttonBg: '#ffffff',
    buttonText: '#000000',
    titleText: '#000000',
    descriptionText: '#000000',
  },
  links: DEFAULT_LINKS,
  socials: DEFAULT_SOCIALS,
  seoTitle: 'روابط انطلاقة',
  seoDescription:
    'انطلاقة | وكالة إعلانات وتسويق رقمي — روابطنا على واتساب، تيك توك، انستغرام، يوتيوب، فيسبوك، وسناب شات.',
  isActive: true,
};

const sortByOrder = (arr = []) =>
  [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

// GET /api/info-page  (public)
export const getInfoPage = async (req, res) => {
  try {
    let doc = await InfoPage.findOne({ key: 'main' });
    if (!doc) {
      doc = await InfoPage.create(DEFAULT_DOC);
    }
    const data = doc.toObject();
    data.links = sortByOrder(data.links);
    data.socials = sortByOrder(data.socials);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[InfoPage] getInfoPage error:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب صفحة المعلومات' });
  }
};

// PUT /api/info-page  (protected)
export const updateInfoPage = async (req, res) => {
  try {
    const ALLOWED = ['profile', 'theme', 'links', 'socials', 'seoTitle', 'seoDescription', 'isActive'];
    const update = {};
    ALLOWED.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });

    if (update.links !== undefined && !Array.isArray(update.links)) delete update.links;
    if (update.socials !== undefined && !Array.isArray(update.socials)) delete update.socials;

    if (Array.isArray(update.links)) {
      update.links = update.links.map((l, i) => ({
        id: l.id || `link-${Date.now()}-${i}`,
        title: l.title || '',
        url: l.url || '',
        image: l.image || '',
        order: typeof l.order === 'number' ? l.order : i,
      }));
    }
    if (Array.isArray(update.socials)) {
      update.socials = update.socials.map((s, i) => ({
        id: s.id || `social-${Date.now()}-${i}`,
        label: s.label || '',
        icon: s.icon || '',
        url: s.url || '',
        order: typeof s.order === 'number' ? s.order : i,
      }));
    }

    const doc = await InfoPage.findOneAndUpdate(
      { key: 'main' },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );

    const data = doc.toObject();
    data.links = sortByOrder(data.links);
    data.socials = sortByOrder(data.socials);

    res.json({ success: true, message: 'تم تحديث صفحة المعلومات بنجاح', data });
  } catch (err) {
    console.error('[InfoPage] updateInfoPage error:', err);
    res.status(500).json({ success: false, message: 'خطأ في تحديث صفحة المعلومات' });
  }
};

// POST /api/info-page/reset  (protected) — reset to defaults
export const resetInfoPage = async (req, res) => {
  try {
    const doc = await InfoPage.findOneAndUpdate(
      { key: 'main' },
      { $set: DEFAULT_DOC },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'تم استعادة القيم الافتراضية', data: doc });
  } catch (err) {
    console.error('[InfoPage] resetInfoPage error:', err);
    res.status(500).json({ success: false, message: 'خطأ في استعادة القيم الافتراضية' });
  }
};
