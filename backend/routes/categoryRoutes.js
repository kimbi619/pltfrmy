const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoriesById,
    getTasksByCategories
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');


router.get('/',protect, getAllCategories);
router.get('/:id', protect, getCategoriesById);
router.get('/:id/tasks', protect, getTasksByCategories);
// router.post('/', validateCategory, createCategory);
// router.put('/:id', validateCategory, updateCategory);
// router.delete('/:id', deleteCategory);

module.exports = router;