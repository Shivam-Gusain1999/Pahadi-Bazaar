import {v2 as cloudinary} from "cloudinary"
import Product from "../models/Product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    // 1. Parse product data (string ko object banaya)
    let productData = JSON.parse(req.body.productData);

    // 2. Get all uploaded files (multer ke through)
    const images = req.files;

    // 3. Upload all images to Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url; // Cloudinary ka URL return karega
      })
    );

    // 4. Save product in MongoDB with images URL
    await Product.create({
      ...productData,
      image: imagesUrl,
    });

    return res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// get all products //

export const productList = async (req, res) => {
  try {
    const products = await Product.find({})
    return res.json({success: true, products})
  } catch (error) {
    console.log(error.message)
     res.json({ success: false, message: error.message });
  }
}

// get single product // 

export const productById = async (req, res) => {
  try {
      const {id} = req.body
      const product = await Product.findById(id)
      res.json({success: true, product})
    
  } catch (error) {
    console.log(error.message)
     res.json({ success: false, message: error.message });
  }

}


// change product in stock // 

export const changeStock = async (req, res)=>{
  try {
    const {id, inStock} = req.body
    await Product.findByIdAndUpdate(id, {inStock})
       return res.json({success: true, message: 'stock updated' })
    
  } catch (error) {
    console.log(error.message)
     res.json({ success: false, message: error.message });
  }
}