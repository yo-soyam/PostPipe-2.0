'use server';

import dbConnect from '@/lib/dbConnect';
import Project from '@/lib/models/Project';
import { revalidatePath } from 'next/cache';

export async function createProject(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;

    const project = await Project.create({
      name,
      description,
      status,
    });

    // Revalidate the path where projects are listed. 
    // This string 'projects' will be replaced by the CLI with the actual path if known, 
    // or the user should update it. For now, we'll try to keep it generic or rely on the caller/client to update UI.
    // However, revalidatePath is good practice.
    revalidatePath('/projects'); 

    return { success: true, message: 'Project created successfully!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getProjects() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(projects));
  } catch (error: any) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function updateProject(id: string, formData: FormData) {
    try {
        await dbConnect();
        
        const name = formData.get('name');
        const description = formData.get('description');
        const status = formData.get('status');

        const updateData: any = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (status) updateData.status = status;

        const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
        if (!project) {
            return { success: false, message: 'Project not found' };
        }

        revalidatePath('/projects');
        return { success: true, message: 'Project updated successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteProject(id: string) {
    try {
        await dbConnect();
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return { success: false, message: 'Project not found' };
        }
        revalidatePath('/projects');
        return { success: true, message: 'Project deleted successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
