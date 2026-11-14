import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    // ۱. پیدا کردن یا ساختن نقش در جدول Role
    let roleRecord = await prisma.role.findUnique({
      where: { name: role }
    });

    if (!roleRecord) {
      roleRecord = await prisma.role.create({
        data: { name: role, description: role }
      });
    }

    // ۲. پاک کردن نقش‌های قبلی کاربر (چون می‌خواهیم نقش را تغییر دهیم)
    await prisma.userRole.deleteMany({
      where: { userId }
    });

    // ۳. اضافه کردن نقش جدید
    await prisma.userRole.create({
      data: {
        userId: userId,
        roleId: roleRecord.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: error.message || "خطا در دیتابیس" }, { status: 500 });
  }
}