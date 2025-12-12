import dbConnect from '@/lib/dbConnect';
import Widget from '@/lib/models/Widget';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const widgets = await Widget.find({});
    return Response.json({ success: true, data: widgets });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const widget = await Widget.create(body);
    return Response.json({ success: true, data: widget }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
