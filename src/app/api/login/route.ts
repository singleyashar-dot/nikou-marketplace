import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "ایمیل و رمز عبور الزامی است" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: true } } }
    });

    if (!user) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
    }

    const role = user.userRoles.length > 0 ? user.userRoles[0].role.name : 'BUYER';

    // ساخت توکن
    const token = await signToken({ userId: user.id, role });

    // ساخت پاسخ و تنظیم کوکی امن
    const response = NextResponse.json({ success: true, role });
    
    response.cookies.set({
      name: 'nikou_token',
      value: token,
      httpOnly: true, // 👈 جاوااسکریپت نمی‌تونه بخونتش
      secure: process.env.NODE_ENV === 'production', // فقط روی HTTPS آنلاین
      sameSite: 'strict', // جلوگیری از حملات CSRF
      maxAge: 7 * 24 * 60 * 60, // ۷ روز
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}