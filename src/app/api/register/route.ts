import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, phone, password, roleName } = await req.json();

    if (!email || !phone || !password || !roleName) {
      return NextResponse.json({ error: "همه فیلدها الزامی هستند." }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    });

    if (existingUser) {
      return NextResponse.json({ error: "این ایمیل یا شماره موبایل قبلاً ثبت شده است." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({ data: { name: roleName } });
    }

    // ساخت کاربر به همراه پروفایل و نقش
    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash: hashedPassword,
        userRoles: {
          create: { roleId: role.id }
        },
        profile: {
          create: {
            displayName: email.split('@')[0], // نام نمایشی پیش‌فرض از ایمیل
            isVerified: false // تیک آبی به صورت پیش‌فرض خاموش است
          }
        }
      },
    });

    return NextResponse.json({ message: "ثبت‌نام با موفقیت انجام شد!", userId: newUser.id }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: "خطای سرور: " + error.message }, { status: 500 });
  }
}