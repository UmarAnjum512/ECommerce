import Collection from '../models/Collection.js';

export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({}).sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { name, description, bannerImage, tag } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const collection = new Collection({
      name,
      slug,
      description,
      bannerImage,
      tag,
    });

    const saved = await collection.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
