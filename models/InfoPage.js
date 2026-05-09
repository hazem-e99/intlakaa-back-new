import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: '', trim: true },
    url: { type: String, default: '', trim: true },
    image: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const socialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: '', trim: true },
    icon: { type: String, default: '', trim: true },
    url: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const infoPageSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },

    profile: {
      name: { type: String, default: 'Intlakaa', trim: true },
      description: { type: String, default: '', trim: true },
      avatar: { type: String, default: '', trim: true },
    },

    theme: {
      profileBg: { type: String, default: '#eceef1', trim: true },
      desktopFrame: { type: String, default: '#cfd1d4', trim: true },
      buttonBg: { type: String, default: '#ffffff', trim: true },
      buttonText: { type: String, default: '#000000', trim: true },
      titleText: { type: String, default: '#000000', trim: true },
      descriptionText: { type: String, default: '#000000', trim: true },
    },

    links: { type: [linkSchema], default: [] },
    socials: { type: [socialSchema], default: [] },

    seoTitle: { type: String, default: '', trim: true },
    seoDescription: { type: String, default: '', trim: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const InfoPage = mongoose.model('InfoPage', infoPageSchema);
export default InfoPage;
