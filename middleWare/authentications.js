import { jwtGenerator } from '../middleWare/jwtGenerator.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    console.log(req.body);
  const authHeader = req.headers.authorization || req.headers.Authorization;;  
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log("Token: ", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwtGenerator.verifyToken(token);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwtGenerator.verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    next(); // Continue without user data
  }
};