import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicId, imageUrl } = body;

    if (!publicId && !imageUrl) {
      return NextResponse.json({ error: 'No publicId or imageUrl provided' }, { status: 400 });
    }

    let idToDelete = publicId;

    // If only imageUrl is provided, extract public_id from URL
    if (!publicId && imageUrl) {
      const urlParts = imageUrl.split('/');
      idToDelete = urlParts.slice(urlParts.indexOf('upload') + 2).join('/').split('.')[0];
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(idToDelete);

    if (result.result === 'ok' || result.result === 'not_found') {
      return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    } else {
      return NextResponse.json({ success: true, message: 'Delete processed' });
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    // Don't fail the entire update if image deletion fails
    return NextResponse.json({ success: true, message: 'Continuing despite delete error' }, { status: 200 });
  }
}
