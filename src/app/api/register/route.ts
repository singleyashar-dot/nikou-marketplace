import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, phone, password, roleName, country } = await req.json();

    if (!email || !password || !phone) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    });

    if (existingUser) {
      return NextResponse.json({ error: "کاربری با این ایمیل یا شماره موبایل وجود دارد" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // پیدا کردن یا ساختن نقش
    const role = await prisma.role.upsert({
      where: { name: roleName || 'BUYER' },
      update: {},
      create: { name: roleName || 'BUYER', description: roleName || 'BUYER' }
    });

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        profile: {
          create: {
            displayName: email.split('@')[0],
            country: country || 'ایران' // 👈 ذخیره کشور
          }
        },
        userRoles: {
          create: {
            roleId: role.id
          }
        }
      }
    });

    return NextResponse.json({ success: true, message: "ثبت‌نام با موفقیت انجام شد.", userId: user.id });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}