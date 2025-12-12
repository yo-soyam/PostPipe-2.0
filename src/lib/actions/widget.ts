'use server';

import dbConnect from '@/lib/dbConnect';
import Widget from '@/lib/models/Widget';
import { revalidatePath } from 'next/cache';

export async function createWidget(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;

    const widget = await Widget.create({
      name,
      description,
      status,
    });

    // Revalidate the path where widgets are listed. 
    // This string 'widgets' will be replaced by the CLI with the actual path if known, 
    // or the user should update it. For now, we'll try to keep it generic or rely on the caller/client to update UI.
    // However, revalidatePath is good practice.
    revalidatePath('/widgets'); 

    return { success: true, message: 'Widget created successfully!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getWidgets() {
  try {
    await dbConnect();
    const widgets = await Widget.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(widgets));
  } catch (error: any) {
    console.error('Failed to fetch widgets:', error);
    return [];
  }
}

export async function updateWidget(id: string, formData: FormData) {
    try {
        await dbConnect();
        
        const name = formData.get('name');
        const description = formData.get('description');
        const status = formData.get('status');

        const updateData: any = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (status) updateData.status = status;

        const widget = await Widget.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
        if (!widget) {
            return { success: false, message: 'Widget not found' };
        }

        revalidatePath('/widgets');
        return { success: true, message: 'Widget updated successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteWidget(id: string) {
    try {
        await dbConnect();
        const widget = await Widget.findByIdAndDelete(id);
        if (!widget) {
            return { success: false, message: 'Widget not found' };
        }
        revalidatePath('/widgets');
        return { success: true, message: 'Widget deleted successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
