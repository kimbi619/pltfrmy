const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTasks = async (userId) => {
  return prisma.task.findMany({
    where: { user_id: userId },
    include: {
      subtasks: true,
      categories: true,
      tags: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true
            }
          }
        }
      }
    }
  });
};

exports.getTaskById = async (taskId, userId) => {
  return prisma.task.findFirst({
    where: { 
      id: taskId,
      user_id: userId
    },
    include: {
      subtasks: true,
      categories: true,
      tags: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true
            }
          }
        }
      }
    }
  });
};

exports.createTask = async (taskData, userId) => {
  const { title, description, status, priority, due_date, start_date, categories = [], tags = [] } = taskData;
  
  return prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      due_date: new Date(due_date),
      start_date: new Date(start_date),
      user: {
        connect: { id: userId }
      },
      categories: {
        connect: categories.map(categoryId => ({ id: categoryId }))
      },
      tags: {
        connect: tags.map(tagId => ({ id: tagId }))
      }
    },
    include: {
      subtasks: true,
      categories: true,
      tags: true
    }
  });
};

exports.updateTask = async (taskId, taskData) => {
  const { 
    title, description, status, priority, due_date, start_date, categories, tags } = taskData;
  
  let updateData = { title, description, status, priority };
  
  if (due_date) updateData.due_date = new Date(due_date);
  if (start_date) updateData.start_date = new Date(start_date);
  
  if (categories) {
    updateData.categories = {
      set: [],
      connect: categories.map(categoryId => ({ id: categoryId }))
    };
  }
  
  if (tags) {
    updateData.tags = {
      set: [],
      connect: tags.map(tagId => ({ id: tagId }))
    };
  }
  
  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      subtasks: true,
      categories: true,
      tags: true
    }
  });
};

exports.updateGoogleCalendarEventId = async (taskId, eventId) => {
  return prisma.task.update({
    where: { id: taskId },
    data: { google_calendar_event: eventId }
  });
};

exports.deleteTask = async (taskId) => {
  return prisma.task.delete({
    where: { id: taskId }
  });
};