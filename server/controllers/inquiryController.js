import Inquiry from '../models/Inquiry.js';

export const submitInquiry = async (req, res) => {
  try {
    const { email, name, phone, message, type } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const inquiry = new Inquiry({
      email,
      name: name || '',
      phone: phone || '',
      message: message || '',
      type: type || 'newsletter',
    });

    await inquiry.save();
    res.status(201).json({ message: 'Thank you! We have received your submission.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
