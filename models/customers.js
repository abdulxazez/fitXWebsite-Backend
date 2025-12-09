import { Double, Int32} from "mongodb";
import mongoose from "mongoose";

const customerStructure=mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
 
    
 });

 const customers = mongoose.model('customers',customerStructure);
 export default customers;