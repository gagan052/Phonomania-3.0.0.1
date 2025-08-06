const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');


// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    let product;
    let productPrice = price; // Use the price from the request

    try {
      // Try to find the product by ID
      product = await Product.findById(productId);
      if (product) {
        productPrice = product.price; // Use product price from database if found
      }
    } catch (err) {
      // If product ID is not a valid ObjectId, we'll use the price from the request
      console.log('Using price from request for product:', productId);
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => 
      item.product && 
      (item.product.toString() === productId || 
       (typeof item.product === 'string' && item.product === productId)));
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = productPrice;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: productPrice
      });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const { productId } = req.params;

    let product;
    let productPrice = price; // Use the price from the request if provided

    try {
      // Try to find the product by ID
      product = await Product.findById(productId);
      if (product) {
        productPrice = product.price; // Use product price from database if found
        
        // Check stock if product exists in database
        if (product.stock < quantity) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
      }
    } catch (err) {
      // If product ID is not a valid ObjectId, we'll use the price from the request
      console.log('Using price from request for product update:', productId);
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => 
      item.product && 
      (item.product.toString() === productId || 
       (typeof item.product === 'string' && item.product === productId)));
       
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    if (productPrice) cartItem.price = productPrice;

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => 
        item.product && 
        item.product.toString() !== productId && 
        (typeof item.product !== 'string' || item.product !== productId));
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Handle both MongoDB ObjectId and string product IDs
    cart.items = cart.items.filter(item => 
      item.product && 
      item.product.toString() !== req.params.productId && 
      (typeof item.product !== 'string' || item.product !== req.params.productId)
    );
    
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;