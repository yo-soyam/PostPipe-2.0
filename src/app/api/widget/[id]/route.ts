import dbConnect from '@/lib/dbConnect';
import Widget from '@/lib/models/Widget';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const widget = await Widget.findById(params.id);
    if (!widget) {
      return Response.json({ success: false, error: 'Widget not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: widget });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    const widget = await Widget.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!widget) {
      return Response.json({ success: false, error: 'Widget not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: widget });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deletedWidget = await Widget.deleteOne({ _id: params.id });
    if (!deletedWidget) {
      return Response.json({ success: false, error: 'Widget not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: {} });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
