import { NextResponse } from 'next/server';
import { syncPublicationsPipeline } from '@/lib/scholarFetcher.mjs';

export const dynamic = 'force-static';

export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}

async function handleSync() {
  try {
    const result = await syncPublicationsPipeline();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (err) {
    console.error('Error executing publications sync API:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
