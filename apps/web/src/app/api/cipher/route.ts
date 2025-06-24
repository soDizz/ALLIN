import { encryptData } from '@/lib/crypo';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const KEY = process.env.CIPHER_KEY;

    if (!KEY) {
      return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'No token' }, { status: 404 });
    }

    const encrypted = encryptData(token, KEY);

    return NextResponse.json(
      {
        encrypted,
      },
      {
        status: 201,
      },
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 503 });
  }
}
