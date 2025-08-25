import Category from "../models/Category.js";
import { BadRequestsException } from "../exceptions/bad_requests.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      throw new BadRequestsException("Category already exists", ErrorCode.PRODUCT_ALREADY_EXISTS);
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).lean();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) throw new NotFoundException("Category not found", ErrorCode.PRODUCT_NOT_FOUND);

    category.name = name ?? category.name;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) throw new NotFoundException("Category not found", ErrorCode.PRODUCT_NOT_FOUND);

    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
