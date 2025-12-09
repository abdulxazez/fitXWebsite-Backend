import { Double, Int32} from "mongodb";
import mongoose from "mongoose";

const productStructure=mongoose.Schema({

    productName: {
        type: String,
        required: true
    },
    productId: {
        type: Int32,
        required: true
    },
    quantity: {
        type: Int32,
        required: true
    },
    price: {
        type: Double,
        required: true
    },
    category: {
        type: String,
        required: true
    },
     image: {
    filename: {
      type: String,
      required: true
    },
    originalname: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    },
    }
 });

 const products = mongoose.model('products',productStructure);
 export default products;