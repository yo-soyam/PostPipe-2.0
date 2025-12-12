import dbConnect from '@/lib/dbConnect';
import Project from '@/lib/models/Project';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const project = await Project.findById(params.id);
    if (!project) {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: project });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    const project = await Project.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: project });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deletedProject = await Project.deleteOne({ _id: params.id });
    if (!deletedProject) {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: {} });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
