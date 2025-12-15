import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request: Request) {
    await dbConnect();
    // Simplified Signup
    try {
        const { name, email, password } = await request.json();
        // Check existing
        const existing = await User.findOne({ email });
        if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

        const user = await User.create({ name, email, password }); // Hash password in pre-save hook or here
        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
