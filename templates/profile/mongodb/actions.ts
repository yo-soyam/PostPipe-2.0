'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/connectors/mongodb';
import User from '@/lib/auth/User';
import { getSession } from '@/lib/auth/actions';
import { UpdateProfileSchema, ChangePasswordSchema } from './schemas';

export async function getUser() {
    const session = await getSession();
    if (!session) return null;

    try {
        await dbConnect();
        const user = await User.findById(session.userId).select('-password -verifyToken -forgotPasswordToken');
        if (!user) return null;
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        return null;
    }
}

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'Unauthorized' };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validated = UpdateProfileSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, errors: validated.error.flatten().fieldErrors };
    }

    const { name, email } = validated.data;

    try {
        await dbConnect();

        // specific check if email is being changed and if it's taken
        if (email !== session.email) {
            const existing = await User.findOne({ email });
            if (existing) {
                return { success: false, message: 'Email already in use' };
            }
        }

        await User.findByIdAndUpdate(session.userId, { name, email });

        revalidatePath('/profile');
        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        return { success: false, message: 'Internal server error' };
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: 'Unauthorized' };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validated = ChangePasswordSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, errors: validated.error.flatten().fieldErrors };
    }

    const { currentPassword, newPassword } = validated.data;

    try {
        await dbConnect();
        const user = await User.findById(session.userId);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return { success: false, message: 'Incorrect current password' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return { success: true, message: 'Password changed successfully' };
    } catch (error) {
        return { success: false, message: 'Internal server error' };
    }
}
