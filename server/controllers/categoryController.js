
const Category = require('../models/Category');


const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};


const createCategory = async (req, res) => {
  try {
    const { name,categoryCode, description, icon, parent } = req.body;
    const category = new Category({ name,categoryCode, description, icon, parent: parent || null });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
};
