import { Fragment, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { addOrRemoveQuantityFromCart, getCarts, removeProduct } from '../redux/slices/cartslice';

interface CartSidebarProps {
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
}

interface CartItem {
    quantity: number;
    productName: string;
    product_id: string;
    price: number;
}

const CartSidebar = ({ cartOpen, setCartOpen }: CartSidebarProps) => {
    const dispatch = useAppDispatch()
    const carts = useAppSelector(state => state.carts.data)
    const [addRemoveCartLoader, setAddRemoveCartLoader] = useState(false)
    useEffect(() => {
        if (cartOpen) {
            dispatch(getCarts())
        }
    }, [cartOpen])


    const addRemoveQty = async (product_id: string, quantity: number) => {
        try {
            setAddRemoveCartLoader(true)
            await dispatch(addOrRemoveQuantityFromCart({ product_id, quantity }))
            await dispatch(getCarts())
        } catch (error) {
            console.log(error)
        }
        finally {
            setAddRemoveCartLoader(false)
        }
    }

    const removeProductFromCart = async (product_id: string) => {
        try {
            setAddRemoveCartLoader(true)
            await dispatch(removeProduct(product_id))
            await dispatch(getCarts())
        } catch (error) {
            console.log(error)
        }
        finally {
            setAddRemoveCartLoader(false)
        }
    }

    const getTotalAmount = () => {
        const total = carts.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0)
        return total.toFixed(2)
    }

    return (
        <Fragment>
            <div
                className={`fixed z-100 top-0 right-0 w-80 h-full bg-white shadow-xl p-6 transform transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Shopping Cart</h2>
                    {carts.length === 0 && <p>Cart is empty.</p>}
                    <button onClick={() => setCartOpen(false)} className="text-xl font-bold cursor-pointer">✖</button>
                </div>
                {carts.map((item: CartItem) => (
                    <div key={item.product_id} className="flex justify-between items-center mb-4 border-b pb-2">
                        <div>
                            <h4>{item.productName}</h4>
                            <p>${item.price} x {item.quantity}</p>
                            <div className="mt-2">
                                <button className="px-2 bg-gray-200 rounded cursor-pointer" onClick={() => addRemoveQty(item.product_id, item.quantity - 1)} disabled={addRemoveCartLoader}>-</button>
                                <span className="px-2">{item.quantity}</span>
                                <button className="px-2 bg-gray-200 rounded cursor-pointer" onClick={() => addRemoveQty(item.product_id, item.quantity + 1)} disabled={addRemoveCartLoader}>+</button>
                            </div>
                        </div>
                        <button
                            className="text-red-500 cursor-pointer"
                            onClick={() => removeProductFromCart(item.product_id)} disabled={addRemoveCartLoader}>
                            Remove
                        </button>
                    </div>
                ))}
                <div className="mt-4 font-semibold">Total: ${getTotalAmount()}</div>
            </div>
        </Fragment>


    );
};

export default CartSidebar