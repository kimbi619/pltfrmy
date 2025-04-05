
exports.getAllTags = async (req, res, next) => {
    try {
      const tags = await tagService.getAllTags();
      return apiResponse.success(res, 'Tags retrieved successfully', tags);
    } catch (error) {
      next(error);
    }
  };
  
  exports.getTagById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const tag = await tagService.getTagById(parseInt(id));
      
      if (!tag) {
        return apiResponse.notFound(res, 'Tag not found');
      }
      
      return apiResponse.success(res, 'Tag retrieved successfully', tag);
    } catch (error) {
      next(error);
    }
  };
  
  exports.createTag = async (req, res, next) => {
    try {
      const tagData = req.body;
      
      const tag = await tagService.createTag(tagData);
      return apiResponse.created(res, 'Tag created successfully', tag);
    } catch (error) {
      next(error);
    }
  };
  


  
  exports.getTasksByTag = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const existingTag = await tagService.getTagById(parseInt(id));
      
      if (!existingTag) {
        return apiResponse.notFound(res, 'Tag not found');
      }
      
      const tasks = await tagService.getTasksByTag(parseInt(id), userId);
      return apiResponse.success(res, 'Tasks retrieved successfully', tasks);
    } catch (error) {
      next(error);
    }
  };