const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('./authToken');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  });
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function verifyPassword(email, password) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) return null;
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function generateTokens(user) {
  const accessToken = jwt.generateAccessToken(user.id);
  const refreshToken = jwt.generateRefreshToken(user.id);
  
  return {
    accessToken,
    refreshToken
  };
}

module.exports = {
  createUser,
  verifyPassword,
  generateTokens
};