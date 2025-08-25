import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Color from "../models/Color.js";
import cloudinary from "cloudinary";
import { BadRequestsException } from "../exceptions/bad_requests.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE PRODUCT
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, volume, price, stock, categoryId, colorIds, finish, coverage, dryingTime, coats, productImage } = req.body;

    let imageUrl = null;
    if (productImage) {
      const upload = await cloudinary.v2.uploader.upload(productImage, { folder: "products" });
      imageUrl = upload.secure_url;
    }

    const exists = await Product.findOne({ name });
    if (exists) throw new BadRequestsException("Product already exists", ErrorCode.PRODUCT_ALREADY_EXISTS);

    if (categoryId && !(await Category.findById(categoryId)))
      throw new BadRequestsException("Category not found", ErrorCode.PRODUCT_NOT_FOUND);

    if (colorIds && colorIds.length > 0) {
      const count = await Color.countDocuments({ _id: { $in: colorIds }, isActive: true });
      if (count !== colorIds.length) throw new BadRequestsException("Invalid color IDs", ErrorCode.PRODUCT_NOT_FOUND);
    }

    const product = await Product.create({
      name,
      description,
      volume,
      price,
      stock,
      category: categoryId,
      colors: colorIds,
      finish,
      coverage,
      dryingTime,
      coats,
      productImage: imageUrl,
    });

    res.status(201).json(await product.populate("category colors"));
  } catch (err) {
    next(err);
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);

    if (updates.productImage && updates.productImage !== product.productImage) {
      const upload = await cloudinary.v2.uploader.upload(updates.productImage, { folder: "products" });
      updates.productImage = upload.secure_url;
    }

    if (updates.categoryId && !(await Category.findById(updates.categoryId))) {
      throw new BadRequestsException("Category not found", ErrorCode.PRODUCT_NOT_FOUND);
    }

    if (updates.colorIds && updates.colorIds.length > 0) {
      const count = await Color.countDocuments({ _id: { $in: updates.colorIds }, isActive: true });
      if (count !== updates.colorIds.length) throw new BadRequestsException("Invalid color IDs", ErrorCode.PRODUCT_NOT_FOUND);
    }

    Object.assign(product, updates);
    await product.save();

    res.json(await product.populate("category colors"));
  } catch (err) {
    next(err);
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// LIST PRODUCTS
export const listProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).populate("category colors");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category colors");
    if (!product) throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// SEARCH PRODUCTS
export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).populate("category colors");

    res.json(products);
  } catch (err) {
    next(err);
  }
};
