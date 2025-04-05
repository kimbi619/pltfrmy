const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTags = async () => {
  return prisma.tag.findMany({
    include: {
      _count: {
        select: {
          tasks: true
        }
      }
    }
  });
};

exports.getTagById = async (tagId) => {
  return prisma.tag.findUnique({
    where: { id: tagId }
  });
};

exports.createTag = async (tagData) => {
  const { name, description } = tagData;
  
  return prisma.tag.create({
    data: {
      name,
      description
    }
  });
};


exports.updateTag = async (tagId, tagData) => {
  const { name, description } = tagData;
  
  return prisma.tag.update({
    where: { id: tagId },
    data: {
      name,
      description
    }
  });
};


exports.findOrCreateTags = async (tagNames) => {
  if (!tagNames || !Array.isArray(tagNames) || tagNames.length === 0) {
    return [];
  }

  const results = [];
  
  for (const tagName of tagNames) {
    const tagNameString = String(tagName);
    let tag = await prisma.tag.findFirst({
      where: { name: tagNameString }
    });
    console.log(`Processing tag: ${tag}`);
    
    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagNameString,
          description: `Tag for ${tagNameString}`
        }
      });
    }
    
    results.push(tag);
  }
  
  return results;
};