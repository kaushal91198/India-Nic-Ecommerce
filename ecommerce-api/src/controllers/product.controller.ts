import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
import { generalResponse, responseTypeEnum } from "../helper/common.helper";
import { PRODUCT_MESSAGES } from "../messages/product.messages";


export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find({})
    return generalResponse(res, products, PRODUCT_MESSAGES.GET_ALL_MESSAGES, responseTypeEnum.SUCCESS)
  } catch (error) {
    next(error);
  }
};


export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, price } = req.body;
    const images: string[] = [];
    if (Array.isArray(req.files) && req.files.length) {
      (req.files as Express.Multer.File[]).forEach((file) => {
        images.push(file.filename);
      });
    }
    else {
      return generalResponse(res, null, PRODUCT_MESSAGES.PRODUCT_IMAGE_NOT_ADDED, responseTypeEnum.ERROR, true, 400);
    }
    await Product.create({ name, price, images })
    return generalResponse(res, "name", PRODUCT_MESSAGES.PRODUCT_ADDED, responseTypeEnum.SUCCESS)
  } catch (error) {
    next(error);
  }
};

