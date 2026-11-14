import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "ایمیل و رمز عبور الزامی است" }, { status: 400 });
    }

    // پیدا کردن کاربر با ایمیل
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: { include: { role: true } }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
    }

    // چک کردن پسورد
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
    }

    // گرفتن نقش کاربر
    let roleName = 'BUYER';
    if (user.userRoles && user.userRoles.length > 0) {
      roleName = user.userRoles[0].role.name;
    }

    // ساخت توکن
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'nikou_secret_12345');
    const token = await new SignJWT({ userId: user.id, role: roleName })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    return NextResponse.json({
      success: true,
      message: "ورود موفق",
      userId: user.id,
      role: roleName,
      token: token
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "خطا در ارتباط با سرور" }, { status: 500 });
  }
}