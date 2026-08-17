import { NextResponse } from 'next/server';
import { getUnnotifiedPublications, getPublications } from '@/lib/db.mjs';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const unnotified = getUnnotifiedPublications();
    
    if (unnotified.length === 0) {
      const allPubs = getPublications();
      const recent = allPubs.filter((p) => p.is_new_notified === false);
      return NextResponse.json({
        success: true,
        count: recent.length,
        publications: recent,
      });
    }

    return NextResponse.json({
      success: true,
      count: unnotified.length,
      publications: unnotified,
    });
  } catch (err) {
    console.error('Error fetching unnotified publications:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
