'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CommerceDemo() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'wishlist' | 'orders'>('shop');
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check for success callback from Stripe
        if (searchParams.get('success')) {
            alert('Payment Successful! Order Confirmed.');
            setActiveTab('orders');
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
        fetchCart();
        fetchWishlist();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) setProducts(json.data);
    };
    const fetchCart = async () => {
        const res = await fetch('/api/cart');
        const json = await res.json();
        if (json.success) setCart(json.data);
    };
    const fetchWishlist = async () => {
        const res = await fetch('/api/wishlist');
        const json = await res.json();
        if (json.success) setWishlist(json.data);
    };
    const fetchOrders = async () => {
        const res = await fetch('/api/orders');
        const json = await res.json();
        if (json.success) setOrders(json.data);
    };

    const addToCart = async (productId: string) => {
        setLoading(true);
        await fetch('/api/cart', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity: 1 })
        });
        await fetchCart();
        setLoading(false);
    };

    const toggleWishlist = async (productId: string) => {
        await fetch('/api/wishlist', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        await fetchWishlist();
    };

    const placeOrder = async () => {
        if (!confirm('Place example order (deduct stock, skip payment)?')) return;
        setLoading(true);
        const res = await fetch('/api/orders', { method: 'POST' });
        const json = await res.json();
        if (!json.success) {
            alert(json.error);
        } else {
            alert('Order Placed Successfully!');
            fetchCart();
            fetchOrders();
        }
        setLoading(false);
    };

    /* Stripe Checkout Skipped */

    return (
        <div className="max-w-6xl mx-auto p-8 min-h-screen bg-gray-50 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">PostPipe Commerce Demo</h1>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8">
                {[
                    { id: 'shop', label: '🛍️ Shop Products' },
                    { id: 'cart', label: `🛒 Cart (${cart.length})` },
                    { id: 'wishlist', label: `❤️ Wishlist (${wishlist.length})` },
                    { id: 'orders', label: `📦 Orders (${orders.length})` },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 min-h-[400px]">

                {/* SHOP TAB */}
                {activeTab === 'shop' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.length === 0 && <p className="text-gray-500 col-span-full text-center">No products found. Add some in the CMS Demo first!</p>}
                        {products.map(p => (
                            <div key={p._id} className="border border-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow">
                                <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-300">Image Placeholder</div>
                                <h3 className="font-bold text-lg">{p.name}</h3>
                                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{p.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-green-600 font-bold">${p.price}</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Stock: {p.stock}</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => addToCart(p._id)} disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                                        Add to Cart
                                    </button>
                                    <button onClick={() => toggleWishlist(p._id)} className="px-3 bg-pink-100 text-pink-600 rounded hover:bg-pink-200">
                                        {wishlist.includes(p._id) ? '💔' : '❤️'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CART TAB */}
                {activeTab === 'cart' && (
                    <div className="max-w-2xl mx-auto">
                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500">Your cart is empty.</p>
                        ) : (
                            <>
                                <div className="space-y-4 mb-8">
                                    {cart.map((item: any) => (
                                        <div key={item.product._id} className="flex justify-between items-center border-b pb-4">
                                            <div>
                                                <h4 className="font-bold">{item.product.name}</h4>
                                                <p className="text-sm text-gray-500">${item.product.price} x {item.quantity}</p>
                                            </div>
                                            <div className="font-mono font-bold">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold border-t pt-4 mb-8">
                                    <span>Total:</span>
                                    <span>${cart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0).toFixed(2)}</span>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={placeOrder} disabled={loading} className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-black disabled:opacity-50">
                                        Place Example Order (No Pay)
                                    </button>
                                    {/* Stripe Checkout Skipped */}

                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.length === 0 && <p className="text-gray-500 col-span-full text-center">Wishlist is empty.</p>}
                        {wishlist.map((p: any) => (
                            <div key={p._id} className="border border-gray-100 p-4 rounded-lg">
                                <h3 className="font-bold">{p.name}</h3>
                                <p className="text-gray-500">${p.price}</p>
                                <button onClick={() => toggleWishlist(p._id)} className="mt-2 text-sm text-red-500 hover:underline">Remove</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {orders.length === 0 && <p className="text-gray-500 text-center">No orders yet.</p>}
                        {orders.map((order: any) => (
                            <div key={order._id} className="border border-gray-200 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="font-mono text-sm text-gray-500">#{order._id}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>{order.status}</span>
                                </div>
                                <div className="text-sm text-gray-700 mb-2">
                                    {order.items.map((i: any) => (
                                        <div key={i.product}>{i.quantity}x {i.name}</div>
                                    ))}
                                </div>
                                <div className="font-bold text-right border-t pt-2">
                                    ${order.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
