// src/services/cartService.js
import apiService from '../utils/new-request';

export const getCart = async () => {
  try {
    const response = await apiService.getCart();
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1, price = null) => {
  try {
    const response = await apiService.addToCart(productId, quantity, price);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await apiService.updateCartItem(productId, quantity);
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await apiService.removeFromCart(productId);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};