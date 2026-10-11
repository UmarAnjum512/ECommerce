import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      orderItems,
      currency,
      exchangeRate,
      paymentMethod,
      notes,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Calculate subtotal
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.itemTotal, 0);
    // Shipping logic: Free shipping over $200, else $15 international / standard
    const shippingPrice = itemsPrice >= 200 ? 0 : 15;
    const totalPrice = itemsPrice + shippingPrice;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FK-${new Date().getFullYear()}-${randomSuffix}`;

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : null,
      customerInfo,
      shippingAddress,
      orderItems,
      currency: currency || 'USD',
      exchangeRate: exchangeRate || 1,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentMethod: paymentMethod || 'COD',
      notes: notes || '',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:identifier
export const getOrderById = async (req, res) => {
  try {
    const { identifier } = req.params;

    let order;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier).populate('user', 'name email');
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: identifier }).populate('user', 'name email');
    }

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (orderStatus) order.orderStatus = orderStatus;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/orders/admin/stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(6);

    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
