import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    sku: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    fabricDetails: {
      type: String,
      default: 'Pure Raw Silk / Chiffon / Organza with hand-crafted zardozi, kora, dabka and resham threadwork.',
    },
    category: {
      type: String,
      required: true,
    },
    collectionName: {
      type: String,
      default: "Endless Summer '26",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    hoverImage: {
      type: String,
      default: '',
    },
    sizes: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    },
    heightOptions: {
      type: [String],
      default: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Petite (42-44 inches)', 'Custom Length'],
    },
    addons: [addonSchema],
    countInStock: {
      type: Number,
      required: true,
      default: 10,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isReadyToShip: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    deliveryTimeline: {
      type: String,
      default: 'Ready to Ship: 3-5 working days | Custom: 3-4 weeks',
    },
    careInstructions: {
      type: String,
      default: 'Dry clean only. Do not wash or bleach. Iron at low temperature.',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
