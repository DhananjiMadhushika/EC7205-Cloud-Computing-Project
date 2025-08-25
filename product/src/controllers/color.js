import Color from "../models/Color.js";
import { BadRequestsException } from "../exceptions/bad_requests.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";

export const createColor = async (req, res, next) => {
  try {
    const { name, hexCode } = req.body;

    const exists = await Color.findOne({ name });
    if (exists) throw new BadRequestsException("Color already exists", ErrorCode.PRODUCT_ALREADY_EXISTS);

    const color = await Color.create({ name, hexCode });
    res.status(201).json(color);
  } catch (err) {
    next(err);
  }
};

export const getColors = async (req, res, next) => {
  try {
    const colors = await Color.find({ isActive: true }).lean();
    res.json(colors);
  } catch (err) {
    next(err);
  }
};

export const updateColor = async (req, res, next) => {
  try {
    const { name, hexCode, isActive } = req.body;
    const color = await Color.findById(req.params.id);

    if (!color) throw new NotFoundException("Color not found", ErrorCode.PRODUCT_NOT_FOUND);

    color.name = name ?? color.name;
    color.hexCode = hexCode ?? color.hexCode;
    if (isActive !== undefined) color.isActive = isActive;

    await color.save();
    res.json(color);
  } catch (err) {
    next(err);
  }
};

export const deleteColor = async (req, res, next) => {
  try {
    const deleted = await Color.findByIdAndDelete(req.params.id);
    if (!deleted) throw new NotFoundException("Color not found", ErrorCode.PRODUCT_NOT_FOUND);

    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
