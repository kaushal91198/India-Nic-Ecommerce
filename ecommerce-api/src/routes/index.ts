import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";

import { Routes } from "../interfaces/route.interface";


const routes: Routes[] = [
    {
        path: 'product',
        route: productRoutes
    },
    {
        path: 'cart',
        route: cartRoutes
    },
]


export default routes