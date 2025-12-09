import customers from '../models/customers.js';
import { jwtGenerator } from '../middleWare/jwtGenerator.js';
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Customer login attempt for username:', username);

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Check in customers collection for customer
    const customer = await customers.findOne({ 
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!customer) {
      console.log("Customer not found:", username);
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    console.log("Customer found:", customer.username);
    console.log("Stored password:", customer.password);
    console.log("Provided password:", password);

    // For plain text passwords - use direct comparison
    const isPasswordValid = customer.password === password;
    
    if (!isPasswordValid) {
      console.log("Invalid password for customer:", username);
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    console.log("Customer logged in successfully:", username);

    // Generate JWT tokens
    const tokenPayload = {
      customerId: customer._id,
      username: customer.username,
      email: customer.email,
      firstName: customer.firstName,
      secondName: customer.secondName,
      role: 'customer'
    };

    const { accessToken, refreshToken } = jwtGenerator.generateCustomerTokens(tokenPayload);

    // Update refresh token in database (if you're storing it)
    if (customer.refreshToken !== undefined) {
      customer.refreshToken = refreshToken;
      await customer.save();
    }

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        customer: {
          id: customer._id,
          firstName: customer.firstName,
          secondName: customer.secondName,
          username: customer.username,
          email: customer.email,
          fullName: `${customer.firstName} ${customer.secondName}`
        },
        accessToken,
        expiresIn: '15 minutes'
      }
    });

  } catch (error) {
    console.error("Customer login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: error.message
    });
  }
};


export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body; // Extract only what you need

    // Add your authentication logic here
    // const admin = await validateAdminCredentials(email, password);
    // if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    // Create a proper payload with only necessary data
    const payload = { // or admin._id if from DB
      username: username,
      role: 'admin'
    };

    // Use the JWTGenerator class
    const token = jwtGenerator.generateToken(payload, { 
      expiresIn: '24h' // Shorter expiry for admin tokens
    });

    console.log("Token Granted");
    
    return res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};



