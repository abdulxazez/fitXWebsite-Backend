import jwt from 'jsonwebtoken';

class JWTGenerator {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'your_fallback_secret_key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  // Generate JWT token
  generateToken(payload, options = {}) {
    const tokenOptions = {
      expiresIn: options.expiresIn || this.expiresIn,
      issuer: 'your-app-name',
      ...options
    };

    return jwt.sign(payload, this.secret, tokenOptions);
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  // Generate tokens specifically for customers
  generateCustomerTokens(customer) {
    const accessToken = this.generateToken(customer, { expiresIn: '15m' });
    const refreshToken = this.generateToken(
      { customerId: customer.customerId || customer._id }, 
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}

// Create and export singleton instance
export const jwtGenerator = new JWTGenerator();
export default jwtGenerator;