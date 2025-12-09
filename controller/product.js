import mongoose from "mongoose";
import products from "../models/productModel.js"
export const addProduct = async (req, res) => {
  console.log("posting....");
  console.log("Request body (text fields):", req.body);
  console.log("Request file (image):", req.file); // Multer puts the file here
  
  try {
    // Check if file was uploaded - USE req.file NOT req.body.image
    if (!req.file) {
      return res.status(400).json({ 
        errorMessage: "No image file provided. Make sure you're sending 'multipart/form-data' with an 'image' field." 
      });
    }
    
    // Create product object with file information FROM req.file
    const productData = {
      ...req.body,
      image: {
        filename: req.file.filename,        // The name multer gave it
        originalname: req.file.originalname, // Original uploaded name
        path: req.file.path,                 // Where it's saved
        mimetype: req.file.mimetype,         // Image type
        size: req.file.size                  // File size
      }
    };
    
    console.log("Creating product with data:", productData);
    
    const newProduct = new products(productData);
    const savedProduct = await newProduct.save();
    
    console.log("Product Saved with image:", savedProduct.image);
    return res.status(200).json(savedProduct);
    
  } catch (error) {
    console.log("Product Not Added - Error:", error);
    return res.status(500).json({ errorMessage: error.message });
  }
};
export const viewProducts = async (req, res) => {
  try {
      const product = await products.find(); 
      console.log(product); // Fetch from MongoDB Atlas
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  };
export const deleteProduct = async (req, res) => {
  try {
    // Get productId from URL parameters
    console.log(req.params.productId)
    const productId  = req.params.productId;
    
    console.log("Deleting product with productId:", productId);

    // Find and delete by custom productId field
    const deleted = await products.findOneAndDelete({ productId: productId });
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found with the given productId"
      });
    }
    
    res.json({
      success: true,
      message: "Product deleted successfully",
      data: {
        productId: deleted.productId,
        name: deleted.name
      }
    });
    
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};




export const searchProduct = async (req, res) => {
  try {
    console.log('=== SEARCH CONTROLLER ===');
    const { searchingProd } = req.query;
    console.log("Search query:", searchingProd);
    
    if (!searchingProd) {
      // RETURN response
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        exists: false
      });
    }
    
    // Find product in database
    const product = await products.findOne({ productId: searchingProd });
    console.log("Database result:", product);
    
    if (product) {
      // RETURN success response
      return res.json({
        success: true,
        message: 'Product found',
        exists: true,
        data: {
          _id: product._id,
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity, // For compatibility
      

        }
      });
    } else {
      // RETURN not found response
      return res.json({
        success: false,
        message: 'Product not found',
        exists: false,
        data: null
      });
    }
    
  } catch (error) {
    console.error("Search error:", error);
    // RETURN error response
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      exists: false
    });
  }
};

// Update Product Controller (assuming product exists from previous search)
export const updateProduct = async (req, res) => {
  try {
    console.log('=== UPDATE CONTROLLER ===');
    
    // Get product ID and update data
    const { ...updateData } = req.body;
    const productId = req.params.productId;
    

    console.log("Product ID to update:", productId);
    console.log("Update data received:", updateData);
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        updated: false
      });
    }
    
    
    // Prepare update object - map frontend fields to database fields
    const updates = {};
    
    // Map quantity to stock if needed
    if (updateData.quantity !== undefined) {
      updates.stock = parseInt(updateData.quantity);
    }
    
    // Map other fields directly
    if (updateData.productName !== undefined) {
      updates.name = updateData.productName;
    }
    
    if (updateData.price !== undefined) {
      updates.price = parseFloat(updateData.price);
    }
    
    if (updateData.category !== undefined) {
      updates.category = updateData.category;
    }
    
    if (updateData.description !== undefined) {
      updates.description = updateData.description;
    }
    
    console.log("Fields to update:", updates);
    
    // Perform the update
    const updatedProduct = await products.findOneAndUpdate(
      { productId: productId },
      { $set: updates },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    console.log("Updated product result:", updatedProduct);
    
    if (updatedProduct) {
      return res.json({
        success: true,
        message: 'Product updated successfully',
        updated: true,
        data: {
          _id: updatedProduct._id,
          productId: updatedProduct.productId,
          name: updatedProduct.name,
          price: updatedProduct.price,
          quantity: updatedProduct.quantity, // Map back for frontend
          category: updatedProduct.category,
          
        }
      });
    } else {
      // This should rarely happen if product was found in search
      return res.status(404).json({
        success: false,
        message: 'Product not found during update',
        updated: false
      });
    }
    
  } catch (error) {
    console.error("Update error:", error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
        updated: false
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error during update',
      error: error.message,
      updated: false
    });
  }
};