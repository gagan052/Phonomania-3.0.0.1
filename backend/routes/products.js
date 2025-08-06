const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const uuid = require('uuid');

// Get all products with search functionality
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    // If search parameter exists, create a search query
    if (search) {
      // Search in name, description, brand fields using case-insensitive regex
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ]
      };
      
      // If category is specified and not 'All', add it to the query
      if (category && category !== 'All') {
        query.category = { $regex: category, $options: 'i' };
      }
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, images, category, brand, stock } = req.body;
    const product = new Product({
      productId: uuid.v4(),
      name,
      description,
      price,
      images,
      category,
      brand,
      stock
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, images, category, brand, stock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (images) product.images = images;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock) product.stock = stock;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;