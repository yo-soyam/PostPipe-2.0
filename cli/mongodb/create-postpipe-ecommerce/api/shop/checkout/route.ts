import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Cart from '@/models/Cart';
import Razorpay from 'razorpay';
import Coupon from '@/models/Coupon';

// Init Razorpay
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userId, address, couponCode } = await request.json();

    // 1. Get Cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let subtotal = 0;
    const itemsToOrder = [];
    
    // 2. Validate Stock & Calculate Totals (Snapshot Price)
    for (const item of cart.items) {
        const product = item.product as any;
        if (product.stock < item.quantity) {
             return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
        }
        
        const price = product.salePrice || product.price;
        subtotal += price * item.quantity;
        
        itemsToOrder.push({
            product: product._id,
            name: product.name,
            price: price, // Snapshot!
            quantity: item.quantity
        });
    }

    // 3. Apply Coupon
    let discount = 0;
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
        if (coupon) {
            if (new Date() > coupon.expiry) {
                 return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
            }
            if (subtotal < coupon.minOrderValue) {
                 return NextResponse.json({ error: `Min order value for coupon is ${coupon.minOrderValue}` }, { status: 400 });
            }
            
            if (coupon.type === 'percent') {
                discount = (subtotal * coupon.value) / 100;
            } else {
                discount = coupon.value;
            }
            
            // Limit check? (Optional enhancement)
        }
    }

    const total = subtotal - discount;

    // 4. Create Razorpay Order
    const rzpOrder = await instance.orders.create({
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    });

    // 5. Create DB Order (Pending)
    const newOrder = await Order.create({
        user: userId,
        items: itemsToOrder,
        subtotal,
        discount,
        total,
        paymentMethod: 'razorpay',
        paymentInfo: {
            razorpayOrderId: rzpOrder.id,
            status: 'pending'
        },
        shippingAddress: address,
        couponApplied: couponCode,
        status: 'pending'
    });

    // 6. Decrement Stock **NOW** (Locking inventory)
    // Alternatively, decrement after payment success. 
    // Best practice often validates usually holds stock for x minutes, 
    // but for simplicity, we decrement now. If payment fails, we can release via Verify webhook.
    for (const item of itemsToOrder) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    
    // Clear Cart ?? Usually clear after payment success. 
    // But for Razorpay flow, we might want to keep it until verified.
    // Let's keep cart for now, clear in /verify.

    return NextResponse.json({ success: true, order: newOrder, razorpayOrder: rzpOrder });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
