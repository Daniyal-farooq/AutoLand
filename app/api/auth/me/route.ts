import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, admin: { id: decoded.id, email: decoded.email } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
