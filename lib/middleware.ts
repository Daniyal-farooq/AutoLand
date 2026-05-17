import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token || !process.env.NEXTAUTH_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler: (req: NextRequest, decoded: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(request, decoded);
  };
}
