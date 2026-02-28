import Post from '../models/Post.js';

// ─── GET /api/posts (public + admin) ────────────────────────────────────────
export const getPosts = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .select('-blocks')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, data: posts, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المقالات' });
  }
};

// ─── GET /api/posts/:slug ────────────────────────────────────────────────────
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ success: false, message: 'المقال غير موجود' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المقال' });
  }
};

// ─── GET /api/posts/id/:id ───────────────────────────────────────────────────
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'المقال غير موجود' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المقال' });
  }
};

// ─── POST /api/posts ─────────────────────────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    const { title, slug, excerpt, coverImage, blocks, status, seoTitle, seoDescription, author, tags } = req.body;

    if (slug) {
      const existing = await Post.findOne({ slug });
      if (existing) return res.status(400).json({ success: false, message: 'الـ slug مستخدم بالفعل' });
    }

    const post = await Post.create({
      title, slug, excerpt, coverImage, blocks, status, seoTitle, seoDescription, author, tags,
    });

    res.status(201).json({ success: true, data: post, message: 'تم إنشاء المقال بنجاح' });
  } catch (err) {
    console.error('[Posts] createPost error:', err);
    res.status(500).json({ success: false, message: 'خطأ في إنشاء المقال' });
  }
};

// ─── PUT /api/posts/:id ──────────────────────────────────────────────────────
export const updatePost = async (req, res) => {
  try {
    const { title, slug, excerpt, coverImage, blocks, status, seoTitle, seoDescription, author, tags } = req.body;

    if (slug) {
      const existing = await Post.findOne({ slug, _id: { $ne: req.params.id } });
      if (existing) return res.status(400).json({ success: false, message: 'الـ slug مستخدم بالفعل' });
    }

    const updateData = { title, slug, excerpt, coverImage, blocks, status, seoTitle, seoDescription, author, tags };
    if (status === 'published') {
      const existing = await Post.findById(req.params.id);
      if (existing && !existing.publishedAt) updateData.publishedAt = new Date();
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'المقال غير موجود' });

    res.json({ success: true, data: post, message: 'تم تحديث المقال بنجاح' });
  } catch (err) {
    console.error('[Posts] updatePost error:', err);
    res.status(500).json({ success: false, message: 'خطأ في تحديث المقال' });
  }
};

// ─── DELETE /api/posts/:id ───────────────────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'المقال غير موجود' });
    res.json({ success: true, message: 'تم حذف المقال بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في حذف المقال' });
  }
};
