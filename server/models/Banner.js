import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '/shop',
    },
    desktopImage: {
      type: String,
      required: true,
    },
    mobileImage: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['hero', 'promo_bar', 'spotlight'],
      default: 'hero',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
