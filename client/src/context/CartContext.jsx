import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('fk_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('fk_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const generateCartItemId = (productId, size, height, addons = []) => {
    const sortedAddonNames = addons.map((a) => a.name).sort().join('-');
    return `${productId}_${size || 'std'}_${height || 'std'}_${sortedAddonNames}`;
  };

  const addToCart = (product, size = 'M', heightOption = 'Standard (45-48 inches)', selectedAddons = [], quantity = 1) => {
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const unitPrice = Number(product.price) + addonsTotal;
    const itemId = generateCartItemId(product._id, size, heightOption, selectedAddons);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].itemTotal = updated[existingIndex].quantity * unitPrice;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: itemId,
            product: {
              _id: product._id,
              title: product.title,
              slug: product.slug,
              sku: product.sku,
            },
            title: product.title,
            image: product.images && product.images[0] ? product.images[0] : '',
            size,
            heightOption,
            selectedAddons,
            basePrice: Number(product.price),
            addonsTotal,
            unitPrice,
            quantity,
            itemTotal: unitPrice * quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: item.unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'MIRHA10') {
      setDiscountPercent(10);
      setCouponCode(cleaned);
      setCouponMessage('Coupon MIRHA10 applied! 10% discount.');
      return { success: true, message: '10% discount applied!' };
    } else if (cleaned === 'LUXURY20') {
      setDiscountPercent(20);
      setCouponCode(cleaned);
      setCouponMessage('Coupon LUXURY20 applied! 20% discount.');
      return { success: true, message: '20% discount applied!' };
    } else {
      setCouponMessage('Invalid coupon code.');
      return { success: false, message: 'Invalid coupon code.' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setCouponMessage('');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const total = subtotal - discountAmount + shippingFee;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discountAmount,
        discountPercent,
        shippingFee,
        total,
        totalItems,
        couponCode,
        couponMessage,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
