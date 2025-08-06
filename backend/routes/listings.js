const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get user's listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const listings = await Product.find({ seller: req.userId });
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all user listings (public)
router.get('/', async (req, res) => {
  try {
    // Only fetch products that have a seller (user listings)
    const listings = await Product.find({ seller: { $exists: true, $ne: null } })
      .populate('seller', 'name') // Populate seller info
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new listing
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, images, category, brand, stock, condition } = req.body;
    
    // Generate a unique productId
    const productId = `USR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const product = new Product({
      productId,
      name,
      description,
      price,
      images,
      category,
      brand,
      stock,
      condition,
      seller: req.userId
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update a listing
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Verify ownership
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }
    
    const { name, description, price, images, category, brand, stock, condition } = req.body;
    
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (images) product.images = images;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock) product.stock = stock;
    if (condition) product.condition = condition;
    
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Verify ownership
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }
    
    await product.remove();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;