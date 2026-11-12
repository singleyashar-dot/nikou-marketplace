import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "شناسه کاربر یافت نشد" }, { status: 400 });
    }

    // 👈 شبیه‌سازی موفقیت پرداخت برای محیط لوکال
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        plan: "PRO",
        planExpiresAt: oneMonthLater,
        isVerified: true, 
      },
      create: {
        userId: userId,
        plan: "PRO",
        planExpiresAt: oneMonthLater,
        isVerified: true,
      },
    });

    try {
      await prisma.transaction.create({
        data: {
          amount: 99000,
          currency: "IRR",
          status: "SUCCESS",
          paymentMethod: "ZARINPAL_MOCK",
          orderId: null,
        }
      });
    } catch (txError) {}

    return NextResponse.json({ 
      success: true, 
      refId: "MOCK-" + Math.floor(Math.random() * 1000000),
      message: "اشتراک حرفه‌ای با موفقیت فعال شد (تست)."
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}