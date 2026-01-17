import React, { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { assets, dummyAddress } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const { navigate, products, getCartCount, getCartAmount, currency, cartItems, setCartItems, addToCart, axios, updateCartItem, user, removeFromCart, isLoading } = useAppContext();
    const [showAddress, setShowAddress] = useState(false)
    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")



    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key)
            if (product) {
                // Create a copy to avoid mutating the original product object
                tempArray.push({
                    ...product,
                    quantity: cartItems[key]
                })
            }
        }
        setCartArray(tempArray)
    }

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("Please select an address");
            }

            // Place Order with COD
            if (paymentOption === "COD") {
                const {
                    data
                } = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity
                    })),
                    address: selectedAddress._id
                });
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({})
                    navigate("/my-orders")

                } else {
                    toast.error(data.message)
                }
            } else {

                const {
                    data
                } = await axios.post('/api/order/stripe', {
                    userId: user._id,
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity
                    })),
                    address: selectedAddress._id
                });
                if (data.success) {
                    window.location.replace(data.url)

                } else {
                    toast.error(data.message)
                }

            }
        } catch (error) {
            toast.error(error.message)
        }
    };
    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart()
        }
    }, [products, cartItems])


    const getUserAddress = async () => {
        try {
            const { data } = await axios.get("/api/address/get");

            if (data.success && data.addresses.length > 0) {
                // Set all addresses
                setAddresses(data.addresses);
                // Set default selected address (first one)
                setSelectedAddress(data.addresses[0]);
            } else if (data.success && data.addresses.length === 0) {
                // No addresses for this user
                setAddresses([]);
                toast.error("No addresses found");
            } else {
                toast.error("Failed to fetch addresses");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user]); // run whenever user state changes


    if (isLoading && products.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
        </div>;
    }

    if (getCartCount() === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4 opacity-50">🛒</div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => navigate("/products")}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full transition shadow-lg hover:shadow-green-500/30 font-medium"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row py-10 md:py-16 max-w-6xl w-full px-4 md:px-6 mx-auto gap-8 lg:gap-12">
            <div className='flex-1 lg:max-w-4xl'>
                <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
                    Shopping Cart <span className="text-base text-gray-500 dark:text-gray-400 font-normal">({getCartCount()} items)</span>
                </h1>

                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-medium pb-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
                    {cartArray.map((product, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] items-center py-6 gap-4 md:gap-0">
                            {/* Product Info */}
                            <div className="flex items-start gap-4 md:gap-6">
                                <div
                                    onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }}
                                    className="cursor-pointer w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
                                >
                                    <img className="w-full h-full object-contain p-2" src={product.image[0]} alt={product.name} />
                                </div>
                                <div>
                                    <p
                                        onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }}
                                        className="font-medium text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition line-clamp-2 md:line-clamp-1"
                                    >
                                        {product.name}
                                    </p>
                                    <div className="mt-1 space-y-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Weight: {product.weight || "N/A"}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">Price: {currency}{product.offerPrice}</p>
                                        <div className='flex items-center gap-2 mt-2'>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Qty:</p>
                                            <select
                                                onChange={e => updateCartItem(product._id, Number(e.target.value))}
                                                value={cartItems[product._id]}
                                                className='outline-none border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500'
                                            >
                                                {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                    <option key={index} value={index + 1}>{index + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subtotal */}
                            <p className="text-center font-medium text-gray-800 dark:text-white hidden md:block">
                                {currency}{product.offerPrice * product.quantity}
                            </p>

                            {/* Mobile Subtotal and Remove */}
                            <div className="flex items-center justify-between md:justify-center w-full">
                                <p className="font-medium text-gray-800 dark:text-white md:hidden">
                                    Subtotal: {currency}{product.offerPrice * product.quantity}
                                </p>
                                <button
                                    onClick={() => { removeFromCart(product._id) }}
                                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    title="Remove item"
                                >
                                    <img src={assets.remove_icon} alt="remove" className="w-5 h-5 dark:invert" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => { navigate("/products"); scrollTo(0, 0) }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary-dull hover:text-primary dark:text-green-400 dark:hover:text-green-300 font-medium transition">
                    <img src={assets.arrow_right_icon_colored} alt="arrow" className="transform rotate-180 group-hover:-translate-x-1 transition dark:invert" />
                    Continue Shopping
                </button>

            </div>

            {/* Order Summary */}
            <div className="lg:w-[380px] w-full h-fit bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Order Summary</h2>

                <div className="mb-6 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Delivery Address</p>
                            <button onClick={() => setShowAddress(!showAddress)} className="text-sm text-green-600 dark:text-green-400 hover:underline cursor-pointer font-medium">
                                {selectedAddress ? "Change" : "Add Address"}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    {selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "Please select a delivery address"}
                                </p>
                            </div>

                            {showAddress && (
                                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-60 overflow-y-auto">
                                        {addresses.map((address, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setSelectedAddress(address);
                                                    setShowAddress(false);
                                                }}
                                                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                                            >
                                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                                    {address.street}, {address.city}, {address.state}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => navigate("/add-address")}
                                        className="w-full p-3 text-sm text-center text-green-600 dark:text-green-400 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
                                    >
                                        + Add New Address
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Payment Method</p>
                        <select
                            onChange={e => setPaymentOption(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="COD">Cash On Delivery (COD)</option>
                            <option value="Online">Online Payment (Stripe)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">{currency}{getCartAmount()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (2%)</span>
                        <span className="font-medium text-gray-900 dark:text-white">{currency}{Math.floor(getCartAmount() * 0.02 * 100) / 100}</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                        <span className="text-base font-semibold text-gray-800 dark:text-white">Total Amount</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02 * 100) / 100}</span>
                    </div>
                </div>

                <button
                    onClick={placeOrder}
                    className="w-full py-4 mt-8 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 transition duration-200"
                >
                    {paymentOption === "COD" ? "Place Order" : "Proceed To Checkout"}
                </button>
            </div>
        </div>
    );
}

export default Cart;