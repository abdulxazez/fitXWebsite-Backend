import Stripe from "stripe"
import express from "express";
import cors from "cors";
import { connectDB } from "./controller/db/connect.js";
import { addUser } from "./controller/customerController.js";
import { addProduct, deleteProduct, viewProducts, searchProduct, updateProduct } from "./controller/product.js";
import { adminLogin, login } from "./controller/loginCredentials.js";
import { authenticateToken, optionalAuth } from "./middleWare/authentications.js";
import multer  from "multer";
import path from "path"
import { checkOrderPayment } from "./controller/paymentController.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
console.log(stripe);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage
})
// ROUTES
app.post("/api/registration", addUser);
app.post("/Payments/", checkOrderPayment)
app.post("/Products/add", authenticateToken,upload.single('image'), addProduct);
app.get("/Products/view", authenticateToken, viewProducts);
app.post("/loginPage", login)
app.post("/admin/loginPage", adminLogin)
app.get("/", (req, res) => res.send("API Connected"));
app.delete('/Products/:productId',authenticateToken, deleteProduct)
app.get('/Products/search', authenticateToken, searchProduct);
app.post("/Products/:productId", authenticateToken, updateProduct)
// CONNECT DATABASE FIRST
await connectDB();

// START SERVER AFTER DB SUCCESS
app.listen(5000, () => {
  console.log("Server is  running on port 5000");
});
