import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

// دریافت لیست اعلانات کاربر
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "شناسه کاربر یافت نشد" }, { status: 400 });

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notifications, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// علامت زدن به عنوان خوانده شده (همه یا یکی)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, notificationId } = body;

    if (!userId) return NextResponse.json({ error: "شناسه کاربر یافت نشد" }, { status: 400 });

    if (notificationId) {
      // خواندن یک اعلان خاص
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
    } else {
      // خواندن همه اعلانات
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}