import { NextResponse } from 'next/server';
import { markAsNotified } from '@/lib/db.mjs';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing publication id' },
        { status: 400 }
      );
    }

    const updated = markAsNotified(id);

    return NextResponse.json({
      success: true,
      id,
      marked: updated,
    });
  } catch (err) {
    console.error('Error marking publication as notified:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
