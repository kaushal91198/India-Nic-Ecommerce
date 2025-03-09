import { Router } from "express";
import { addProduct, getAllProducts } from "../controllers/product.controller";
import { uploadFileImage } from "../middlewares/multer.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import { productSchema } from "../validationSchema/product.validation.schema";


const router = Router();

router.get("/", getAllProducts);
router.post("/", uploadFileImage.any(), validationMiddleware(productSchema, 'body'), addProduct);


export default router;
