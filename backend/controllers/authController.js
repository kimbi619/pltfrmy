const { PrismaClient } = require('@prisma/client');
const auth = require('../config/authenticate');
const auth_token = require('../config/authToken');

const prisma = new PrismaClient();

exports.register = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = await auth.createUser(payload);
    
    const tokens = await auth.generateTokens(user);
    
    return res.status(201).json({
      success: true,
      user,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const user = await auth.verifyPassword(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const tokens = await auth.generateTokens(user);

    return res.status(200).json({
      success: true,
      user,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};



exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = auth_token.verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const user = { id: decoded.id };
    const tokens = await auth.generateTokens(user);

    return res.status(200).json({
      success: true,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};


exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};