import { Fragment, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { getProducts } from '../redux/slices/productslice';
import { addOrRemoveQuantityFromCart, getCarts } from '../redux/slices/cartslice';
import CartSidebar from './CartSidebar';


interface Product {
    name: string;
    price: number;
    images: string[];
    _id: string;
}

const ProductList = () => {
    const [cartOpen, setCartOpen] = useState(false)
    const [addToCartLoader, setAddToCartLoader] = useState(false)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getProducts())
    }, [])
    const products = useAppSelector(state => state.products.data)

    const addToCart = async (product_id: string) => {
        try {
            await dispatch(addOrRemoveQuantityFromCart({ product_id }))
            if (cartOpen) {
                dispatch(getCarts())
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setAddToCartLoader(false)
        }
    }
    return (
        <Fragment>
            <div className="relative min-h-screen bg-gray-100 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
                    <h1 className="text-xl font-bold">Product Store</h1>
                    {/* Cart Button */}
                    <button
                        className="bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer"
                        onClick={() => setCartOpen(true)}
                    >
                        Go To Cart
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4 p-4 pt-20">
                    {products.map((product: Product) => (
                        <div key={product._id} className="border rounded shadow p-4 flex flex-col items-center">
                            <img src={`http://localhost:3000/images/${product.images[0]}`} alt={product.name} className="mb-2" />
                            <h3 className="font-semibold mb-1">{product.name}</h3>
                            <p className="mb-2">${product.price}</p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                                onClick={() => addToCart(product._id)}
                                disabled={addToCartLoader}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
                <CartSidebar cartOpen={cartOpen} setCartOpen={setCartOpen} />
            </div>
        </Fragment>
    );
};
export default ProductList