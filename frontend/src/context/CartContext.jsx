import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      setCart(cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map((item) =>
      item._id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate total
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.pricePerKg || 0) * (item.quantity || 0), 0);
  }, [cart]);

  // Alias for compatibility
  const items = cart;

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
