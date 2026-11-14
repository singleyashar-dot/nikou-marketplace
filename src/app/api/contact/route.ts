import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

// دریافت لیست پیام‌ها
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ثبت پیام جدید
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, topic, title, message } = body;

    if (!email || !message || !title) {
      return NextResponse.json({ error: "لطفا فیلدهای ضروری را پر کنید." }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        name: name || null,
        email,
        topic: topic || null,
        title,
        message,
      }
    });

    return NextResponse.json({ success: true, message: "پیام شما با موفقیت دریافت شد." });
  } catch (error: any) {
    console.error("Contact Error:", error);
    return NextResponse.json({ error: "خطا در ارتباط با سرور" }, { status: 500 });
  }
}

// علامت زدن به عنوان خوانده شده
export async function PUT(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "شناسه یافت نشد" }, { status: 400 });

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 👈 متد جدید: حذف پیام توسط ادمین
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "شناسه یافت نشد" }, { status: 400 });

    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}