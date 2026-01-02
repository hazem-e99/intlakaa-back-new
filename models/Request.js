import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    trim: true
  },
  storeUrl: {
    type: String,
    required: [true, 'رابط المتجر مطلوب'],
    trim: true
  },
  monthlySales: {
    type: String,
    required: [true, 'المبيعات الشهرية مطلوبة'],
    trim: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: null
  },
  phoneCountry: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster searches
requestSchema.index({ name: 'text', phone: 'text' });
requestSchema.index({ createdAt: -1 }); // For sorting by date

const Request = mongoose.model('Request', requestSchema);

export default Request;
