import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    console.log("📩 درخواست جدید برای احراز هویت. userId:", userId);

    if (!userId) {
      console.log("❌ خطا: userId ارسال نشده است.");
      return NextResponse.json({ error: "شناسه کاربر یافت نشد. لطفا دوباره لاگین کنید." }, { status: 400 });
    }

    // بررسی اینکه آیا کاربر قبلا درخواست داده یا نه
    const existingRequest = await prisma.verification.findFirst({
      where: { userId: userId, status: 'PENDING' }
    });

    if (existingRequest) {
      return NextResponse.json({ error: "شما قبلاً درخواست داده‌اید و در حال بررسی است." }, { status: 400 });
    }

    // ثبت درخواست جدید
    const newVerification = await prisma.verification.create({
      data: {
        userId: userId,
        type: 'KYC',
        status: 'PENDING'
      }
    });

    console.log("✅ درخواست با موفقیت ثبت شد:", newVerification);
    return NextResponse.json({ success: true, message: "درخواست شما با موفقیت ثبت شد." });

  } catch (error: any) {
    console.error("🔴 خطا در ثبت درخواست احراز هویت:", error.message);
    return NextResponse.json({ error: error.message || "خطا در دیتابیس" }, { status: 500 });
  }
}