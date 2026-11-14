import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { requestId, listingId } = await req.json();

    if (!requestId || !listingId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const offer = await prisma.match.create({
      data: {
        requestId,
        listingId,
        score: 100 // امتیاز ۱۰۰ یعنی پیشنهاد مستقیم توسط فروشنده
      }
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error("Offer Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}