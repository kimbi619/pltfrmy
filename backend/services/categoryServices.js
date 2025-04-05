const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllCategories = async (userId) => {
  return prisma.category.findMany({
    where: {
      OR: [{ user_id: userId }, { user_id: null }],
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });
};

exports.getCategoryById = async (categoryId, userId) => {
  return prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [{ user_id: userId }, { user_id: null }],
    },
  });
};

exports.createCategory = async (categoryData, userId) => {
  const { name, description } = categoryData;

  return prisma.category.create({
    data: {
      name,
      description,
      user: {
        connect: { id: userId },
      },
    },
  });
};

exports.updateCategory = async (categoryId, categoryData) => {
  const { name, description } = categoryData;

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      name,
      description,
    },
  });
};

exports.deleteCategory = async (categoryId) => {
  return prisma.category.delete({
    where: { id: categoryId },
  });
};

exports.getTasksByCategory = async (categoryId, userId) => {
  return prisma.task.findMany({
    where: {
      user_id: userId,
      categories: {
        some: {
          id: categoryId,
        },
      },
    },
    include: {
      subtasks: true,
      tags: true,
    },
  });
};

exports.findOrCreateCategory = async (categoryName, userId) => {
  if (!categoryName) return null;

  let category = await prisma.category.findFirst({
    where: {
      name: categoryName,
      user_id: userId,
    },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
        description: `Category for ${categoryName}`,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  return category;
};
