import dbConnect from '@/lib/dbConnect';
import Project from '@/lib/models/Project';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const projects = await Project.find({});
    return Response.json({ success: true, data: projects });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const project = await Project.create(body);
    return Response.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
