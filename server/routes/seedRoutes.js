const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');

const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const created = await Product.insertMany(sampleProducts);
    res.json({ message: 'Sample products seeded', count: created.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.post('/', seedProducts);
router.get('/', seedProducts);

module.exports = router;
