import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// 👈 گرفتن تمام تنظیمات
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    // تبدیل به یک آبجکت Key-Value برای راحتی فرانت‌اند
    const formattedSettings = settings.reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    return NextResponse.json(formattedSettings, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 👈 ذخیره تنظیمات
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    // آپدیت یا ساخت هر کلید
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}