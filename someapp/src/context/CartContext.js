// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import * as cartService from "../services/cartService"; // <-- the service we made

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await cartService.addToCart(productId, quantity);
    setCart(data);
  };

  const updateItem = async (productId, quantity) => {
    const data = await cartService.updateCartItem(productId, quantity);
    setCart(data);
  };

  const removeItem = async (productId) => {
    const data = await cartService.removeFromCart(productId);
    setCart(data);
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart({ items: [] });
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
