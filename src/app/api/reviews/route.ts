import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

// دریافت نظرات یک فروشنده
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: "شناسه فروشنده یافت نشد" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { revieweeId: sellerId },
      include: {
        reviewer: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // محاسبه میانگین امتیاز
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0";

    return NextResponse.json({ reviews, averageRating, totalReviews: reviews.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ثبت نظر جدید
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reviewerId, revieweeId, orderId, rating, comment } = body;

    if (!reviewerId || !revieweeId || !orderId || !rating) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    // بررسی اینکه آیا کاربر قبلاً برای این سفارش نظر داده است یا نه
    const existingReview = await prisma.review.findFirst({
      where: { reviewerId, orderId }
    });

    if (existingReview) {
      return NextResponse.json({ error: "شما قبلاً برای این سفارش نظر ثبت کرده‌اید." }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        reviewerId,
        revieweeId,
        orderId,
        rating: Number(rating),
        comment,
        isVerified: true
      }
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}