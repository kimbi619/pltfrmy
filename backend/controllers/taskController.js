const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const taskService = require('../services/taskServices');
const tagService = require('../services/tagServices');
const categoryService = require('../services/categoryServices');
// const googleCalendarHelper = require('../../../utils/googleCalendarHelper');
// const apiResponse = require('../../../utils/apiResponse');

exports.getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if(!userId) {
      return apiResponse.unauthorized(res, 'User not authenticated');
    }
    const tasks = await taskService.getAllTasks(userId);
    return res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      tasks: tasks
    });
    // return apiResponse.success(res, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const task = await taskService.getTaskById(parseInt(id), userId);

    if (!task) {
      return apiResponse.notFound(res, 'Task not found');
    }
    
    // return apiResponse.success(res, 'Task retrieved successfully', task);
    return res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      task: task
    });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const taskData = req.body;
    const userId = req.user.id;
    
    let tagIds = [];
    if (taskData.tags && Array.isArray(taskData.tags)) {
      const createdTags = await tagService.findOrCreateTags(taskData.tags);
      tagIds = createdTags.map(tag => tag.id);
      
      taskData.tags = tagIds;
    }
    
    let categoryIds = [];
    if (taskData.category) {
      const category = await categoryService.findOrCreateCategory(taskData.category, userId);
      if (category) {
        categoryIds.push(category.id);
      }
      
      // Update taskData with category IDs
      taskData.categories = categoryIds;
      delete taskData.category; // Remove the original category string
    }
    
    // Handle parent task if specified (for subtasks)
    let task;
    if (taskData.parent) {
      const parentId = parseInt(taskData.parent);
      // Verify parent task exists
      const parentTask = await taskService.getTaskById(parentId, userId);
      
      if (!parentTask) {
        return apiResponse.notFound(res, 'Parent task not found');
      }
      
      // Create subtask
      task = await prisma.subtask.create({
        data: {
          title: taskData.title,
          description: taskData.description || '',
          status: taskData.status || 'active',
          priority: taskData.priority || 'Medium',
          due_date: taskData.due_date ? new Date(taskData.due_date) : new Date(),
          start_date: taskData.start_date ? new Date(taskData.start_date) : new Date(),
          task: {
            connect: { id: parentId }
          }
        }
      });
      
      return res.status(201).json({
        success: true,
        message: 'Subtask created successfully',
        subtask: task
      });
    } else {
      // Create regular task
      task = await taskService.createTask(taskData, userId);
    }
    
    // Google Calendar integration
    if (req.user.connect_google_calendar && req.user.google_refresh_token) {
      try {
        const eventId = await googleCalendarHelper.createEvent(
          req.user, 
          task.title, 
          task.description, 
          task.start_date, 
          task.due_date
        );
        
        if (eventId) {
          await taskService.updateGoogleCalendarEventId(task.id, eventId);
          task.google_calendar_event = eventId;
        }
      } catch (calendarError) {
        console.error('Google Calendar integration error:', calendarError);
      }
    }
    
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: task,
      createdTags: taskData.tags ? await tagService.findOrCreateTags(taskData.tags) : [],
      createdCategories: taskData.category ? await categoryService.findOrCreateCategory(taskData.category, userId) : null
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    const userId = req.user.id;
    
    const existingTask = await taskService.getTaskById(parseInt(id), userId);
    
    if (!existingTask) {
      return apiResponse.notFound(res, 'Task not found');
    }
    
    const updatedTask = await taskService.updateTask(parseInt(id), taskData);
    
    if (req.user.connect_google_calendar && 
        updatedTask.google_calendar_event && 
        req.user.google_refresh_token) {
      try {
        await googleCalendarHelper.updateEvent(
          req.user,
          updatedTask.google_calendar_event,
          updatedTask.title,
          updatedTask.description,
          updatedTask.start_date,
          updatedTask.due_date
        );
      } catch (calendarError) {
        console.error('Google Calendar update error:', calendarError);
      }
    }
    
    return apiResponse.success(res, 'Task updated successfully', updatedTask);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingTask = await taskService.getTaskById(parseInt(id), userId);
    
    if (!existingTask) {
      // return apiResponse.notFound(res, 'Task not found');
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Delete Google Calendar event if it exists
    if (req.user.connect_google_calendar && 
        existingTask.google_calendar_event && 
        req.user.google_refresh_token) {
      try {
        await googleCalendarHelper.deleteEvent(
          req.user,
          existingTask.google_calendar_event
        );
      } catch (calendarError) {
        console.error('Google Calendar delete error:', calendarError);
      }
    }
    
    // Delete task from database
    await taskService.deleteTask(parseInt(id));
    
    // return apiResponse.success(res, 'Task deleted successfully');
    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


