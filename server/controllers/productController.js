import Product from '../models/Product.js';

// Helper to generate slug from title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Fetch all products with filtering & sorting
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, collection, readyToShip, featured, newArrival, sort } = req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { sku: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (collection && collection !== 'All') {
      query.collectionName = { $regex: collection, $options: 'i' };
    }

    if (readyToShip === 'true') {
      query.isReadyToShip = true;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (newArrival === 'true') {
      query.isNewArrival = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'title-asc') {
      sortOption = { title: 1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by id or slug
// @route   GET /api/products/:identifier
export const getProductByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;

    let product;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier.toLowerCase() });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      fabricDetails,
      category,
      collectionName,
      price,
      originalPrice,
      images,
      hoverImage,
      sizes,
      heightOptions,
      addons,
      countInStock,
      isFeatured,
      isReadyToShip,
      isNewArrival,
      sku,
      deliveryTimeline,
      careInstructions,
    } = req.body;

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = new Product({
      title,
      slug,
      sku: sku || `FK-${Date.now().toString().slice(-4)}`,
      description,
      fabricDetails: fabricDetails || 'Pure Silk / Organza with hand embellishments',
      category,
      collectionName: collectionName || "Endless Summer '26",
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      images: images && images.length ? images : ['https://www.fatimakhanofficial.com/images/thumbs/0010448_midnight-kaftan_1000.jpeg'],
      hoverImage: hoverImage || (images && images[1] ? images[1] : ''),
      sizes: sizes || ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
      heightOptions: heightOptions || ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Length'],
      addons: addons || [],
      countInStock: Number(countInStock) || 10,
      isFeatured: Boolean(isFeatured),
      isReadyToShip: Boolean(isReadyToShip),
      isNewArrival: Boolean(isNewArrival),
      deliveryTimeline: deliveryTimeline || 'Ready to Ship: 3-5 working days',
      careInstructions: careInstructions || 'Dry clean only',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      if (req.body.title && req.body.title !== product.title) {
        product.slug = slugify(req.body.title);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
