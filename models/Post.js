import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['heading','paragraph','image','video','html','quote','divider','cta','columns','list','stats','cards','testimonials','team','faq','banner','embed','gallery','alert','spacer','table','steps'],
    required: true,
  },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 },
}, { _id: false });

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  excerpt: { type: String, trim: true, default: '' },
  coverImage: { type: String, trim: true, default: '' },
  blocks: [blockSchema],
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft',
  },
  publishedAt: { type: Date, default: null },
  // SEO
  seoTitle: { type: String, trim: true, default: '' },
  seoDescription: { type: String, trim: true, default: '' },
  author: { type: String, trim: true, default: '' },
  tags: [{ type: String, trim: true }],
}, { timestamps: true });

// Auto slug
postSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-أ-ي]/g, '');
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
