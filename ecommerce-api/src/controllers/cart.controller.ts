import { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";
import { generalResponse, responseTypeEnum } from "../helper/common.helper";
import { CART_MESSAGES } from "../messages/cart.messages";
import mongoose from "mongoose";
import Product from "../models/Product";
import { HttpException } from "../exceptions/HttpException";
import { PRODUCT_MESSAGES } from "../messages/product.messages";


export const getAllCartItems = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cartItems = await Cart.aggregate([
            {
                $lookup: {
                    from: "products", // Ensure this matches the actual collection name in MongoDB
                    localField: "product_id", // This should match the field name in CartSchema
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$productDetails", // Flatten product details array
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    productName: "$productDetails.name",
                    product_id: "$productDetails._id",
                    quantity: 1, // Include quantity from the cart
                    price: "$productDetails.price"
                },
            },
        ]
        )
        return generalResponse(res, cartItems, CART_MESSAGES.GET_ALL_CARTS, responseTypeEnum.SUCCESS)
    } catch (error) {
        console.log(error)
        next(error);
    }
};


export const addOrUpdateProductIntoCart = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { product_id, quantity } = req.body
        const productWithCart = await Product.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(product_id) }, // Filter by product ID
            },
            {
                $lookup: {
                    from: "carts", // Ensure this matches your Cart collection name
                    localField: "_id", // The _id of the product
                    foreignField: "product_id", // The reference in the Cart collection
                    as: "cartItems",
                },
            },
            {
                $unwind: {
                    path: "$cartItems",
                    preserveNullAndEmptyArrays: true, // Keeps products even if they don't have carts
                },
            },
            {
                $project: {
                    cart_id: "$cartItems._id",
                },
            },
        ]);

        if (productWithCart.length === 0) {
            throw new HttpException(404, PRODUCT_MESSAGES.PRODUCT_NOT_FOUND);
        }
        if (productWithCart[0].cart_id) {
        const quantityFunc = quantity ? { $set: { quantity } } : { $inc: { quantity: 1 } }
            if (quantity !== undefined && quantity <= 0) {
                await Cart.deleteOne({ _id: productWithCart[0].cart_id });
            }
            else {
                await Cart.updateOne(
                    { _id: productWithCart[0].cart_id }, // Find cart by product_id
                    quantityFunc // Update quantity
                );
            }
        }
        else {
            await Cart.create({ product_id: new mongoose.Types.ObjectId(product_id as string), quantity: quantity ? quantity : 1 })
        }
        return generalResponse(res, productWithCart, CART_MESSAGES.ADDED_PRODUCTS_IN_CART, responseTypeEnum.SUCCESS, quantity === undefined)
    } catch (error) {
        next(error);
    }
};


export const removeProductFromCart = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { product_id } = req.params
        await Cart.deleteOne({ product_id });
        return generalResponse(res, null, CART_MESSAGES.REMOVED_PRODUCTS_FROM_CART, responseTypeEnum.SUCCESS, true)
    } catch (error) {
        next(error);
    }
};





