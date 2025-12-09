import customers from "../models/customers.js";

export const addUser = async (req, res) => {
  console.log("posting....")
  console.log("Received data:", req.body)

  try {
    
    const newUser = new customers(req.body)
    const savedUser = await newUser.save()
    res.status(201).json({ // Always send status and response
      success: true, 
      message: "User created successfully",
      user: savedUser 
    })
  } catch (error) {
    console.log("Error saving user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating user",
      error: error.message 
    })
  }
}; 

