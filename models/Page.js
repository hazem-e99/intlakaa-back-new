import mongoose from 'mongoose';

// Block schema - the building block of all pages
const blockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['heading', 'paragraph', 'image', 'video', 'html', 'quote', 'divider', 'cta', 'columns'],
    required: true,
  },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  // content examples per type:
  // heading:   { text, level (h1-h6), align }
  // paragraph: { text, align }
  // image:     { url, alt, caption, width }
  // video:     { embed, caption }  (youtube/vimeo embed URL)
  // html:      { code }
  // quote:     { text, author }
  // divider:   {}
  // cta:       { text, buttonText, buttonUrl, align }
  // columns:   { columns: [ [blocks], [blocks] ] }
  order: { type: Number, default: 0 },
}, { _id: false });

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ['page', 'blog', 'home'],
    default: 'page',
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft',
  },
  blocks: [blockSchema],
  // SEO
  seoTitle: { type: String, trim: true, default: '' },
  seoDescription: { type: String, trim: true, default: '' },
  // Home page specific - section visibility
  homeSettings: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
}, { timestamps: true });

// Auto-generate slug from title if not provided
pageSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-أ-ي]/g, '');
  }
  next();
});

const Page = mongoose.model('Page', pageSchema);
export default Page;
