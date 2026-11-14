import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// دریافت پیام‌های یک سفارش
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    if (!orderId) return NextResponse.json({ error: "آیدی سفارش ارسال نشده" }, { status: 400 });

    const messages = await prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(messages, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ارسال پیام جدید
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, content, senderId, receiverId } = body;

    if (!orderId || !content || !senderId || !receiverId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        orderId,
        content,
        senderId,
        receiverId
      },
    });

    return NextResponse.json({ message: "پیام ارسال شد", data: newMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}