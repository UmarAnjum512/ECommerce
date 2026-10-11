import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['newsletter', 'contact', 'custom_order'],
      default: 'newsletter',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
