import { Router } from "express";
import validationMiddleware from "../middlewares/validation.middleware";
import { addOrUpdateProductIntoCart, getAllCartItems, removeProductFromCart } from "../controllers/cart.controller";
import { addProductIntoCartSchema, deleteProductFromCartSchema } from "../validationSchema/cart.validation.schema";


const router = Router();

router.get("/", getAllCartItems);
router.post("/", validationMiddleware(addProductIntoCartSchema, 'body'), addOrUpdateProductIntoCart);
router.delete("/:product_id", validationMiddleware(deleteProductFromCartSchema, 'params'), removeProductFromCart);




export default router;
