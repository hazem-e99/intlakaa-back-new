import Page from '../models/Page.js';

// ─── GET /api/pages ──────────────────────────────────────────────────────────
export const getPages = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const pages = await Page.find(filter)
      .select('-blocks') // don't send blocks in list view
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: pages });
  } catch (err) {
    console.error('[Pages] getPages error:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الصفحات' });
  }
};

// ─── GET /api/pages/:slug ────────────────────────────────────────────────────
export const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, message: 'الصفحة غير موجودة' });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الصفحة' });
  }
};

// ─── GET /api/pages/id/:id ───────────────────────────────────────────────────
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'الصفحة غير موجودة' });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الصفحة' });
  }
};

// ─── POST /api/pages ─────────────────────────────────────────────────────────
export const createPage = async (req, res) => {
  try {
    const { title, slug, type, status, blocks, seoTitle, seoDescription, homeSettings } = req.body;

    // Check slug uniqueness
    if (slug) {
      const existing = await Page.findOne({ slug });
      if (existing) return res.status(400).json({ success: false, message: 'الـ slug مستخدم بالفعل' });
    }

    const page = await Page.create({
      title, slug, type, status, blocks, seoTitle, seoDescription, homeSettings,
    });

    res.status(201).json({ success: true, data: page, message: 'تم إنشاء الصفحة بنجاح' });
  } catch (err) {
    console.error('[Pages] createPage error:', err);
    res.status(500).json({ success: false, message: 'خطأ في إنشاء الصفحة' });
  }
};

// ─── PUT /api/pages/:id ──────────────────────────────────────────────────────
export const updatePage = async (req, res) => {
  try {
    const { title, slug, type, status, blocks, seoTitle, seoDescription, homeSettings } = req.body;

    // If slug changed, check uniqueness
    if (slug) {
      const existing = await Page.findOne({ slug, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ success: false, message: 'الـ slug مستخدم بالفعل' });
    }

    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { title, slug, type, status, blocks, seoTitle, seoDescription, homeSettings },
      { new: true, runValidators: true }
    );

    if (!page) return res.status(404).json({ success: false, message: 'الصفحة غير موجودة' });

    res.json({ success: true, data: page, message: 'تم تحديث الصفحة بنجاح' });
  } catch (err) {
    console.error('[Pages] updatePage error:', err);
    res.status(500).json({ success: false, message: 'خطأ في تحديث الصفحة' });
  }
};

// ─── DELETE /api/pages/:id ───────────────────────────────────────────────────
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'الصفحة غير موجودة' });
    if (page.type === 'home') return res.status(400).json({ success: false, message: 'لا يمكن حذف الصفحة الرئيسية' });

    await page.deleteOne();
    res.json({ success: true, message: 'تم حذف الصفحة بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حذف الصفحة' });
  }
};
