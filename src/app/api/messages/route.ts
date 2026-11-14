import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    if (!orderId) return NextResponse.json({ error: "شناسه سفارش یافت نشد" }, { status: 400 });

    const messages = await prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, content, senderId, receiverId } = body;

    if (!content || !senderId || !receiverId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    // ۱. ذخیره پیام
    const newMessage = await prisma.message.create({
      data: {
        orderId,
        content,
        senderId,
        receiverId
      }
    });

    // ۲. 👈 ساخت اعلان برای دریافت‌کننده پیام
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: "پیام جدید",
        message: `یک پیام جدید برای شما ارسال شده است.`,
        link: `/dashboard/messages` // لینک برای رفتن به صفحه پیام‌ها
      }
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}