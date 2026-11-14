import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const verifications = await prisma.verification.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(verifications, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, action } = body;

    const verification = await prisma.verification.findUnique({
      where: { id: id }
    });

    if (!verification) {
      return NextResponse.json({ error: "درخواست یافت نشد" }, { status: 404 });
    }

    const newStatus = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

    // ۱. آپدیت درخواست
    await prisma.verification.update({
      where: { id: id },
      data: { status: newStatus }
    });

    // ۲. آپدیت پروفایل (اگر پروفایل نبود، می‌سازد)
    if (action === 'APPROVE') {
      try {
        await prisma.profile.upsert({
          where: { userId: verification.userId },
          update: { isVerified: true },
          create: { userId: verification.userId, isVerified: true }
        });
        console.log("✅ Profile upserted for user:", verification.userId);
      } catch (profileError: any) {
        console.error("⚠️ Profile update failed:", profileError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}