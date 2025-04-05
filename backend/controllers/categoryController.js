const categoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categories = await categoryService.getAllCategories(userId);
    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      categories: categories
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const category = await categoryService.getCategoryById(parseInt(id), userId);
    
    if (!category) {
      return apiResponse.notFound(res, 'Category not found');
    }
    
    return apiResponse.success(res, 'Category retrieved successfully', category);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    const userId = req.user.id;
    
    const category = await categoryService.createCategory(categoryData, userId);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: category
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const userId = req.user.id;
    
    const existingCategory = await categoryService.getCategoryById(parseInt(id), userId);
    
    if (!existingCategory) {
      return apiResponse.notFound(res, 'Category not found');
    }
    
    const updatedCategory = await categoryService.updateCategory(parseInt(id), categoryData);
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingCategory = await categoryService.getCategoryById(parseInt(id), userId);
    
    if (!existingCategory) {
      return apiResponse.notFound(res, 'Category not found');
    }
    
    await categoryService.deleteCategory(parseInt(id));
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getTasksByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingCategory = await categoryService.getCategoryById(parseInt(id), userId);
    
    if (!existingCategory) {
      return apiResponse.notFound(res, 'Category not found');
    }
    
    const tasks = await categoryService.getTasksByCategory(parseInt(id), userId);
    return apiResponse.success(res, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};
