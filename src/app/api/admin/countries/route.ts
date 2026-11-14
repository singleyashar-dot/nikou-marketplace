import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// دریافت لیست
export async function GET() {
  try {
    const countries = await prisma.country.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(countries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// افزودن کشور/بازارچه جدید
export async function POST(req: Request) {
  try {
    const { name, code, flag, type } = await req.json();
    if (!name || !code) return NextResponse.json({ error: "نام و کد الزامی است" }, { status: 400 });

    const newCountry = await prisma.country.create({
      data: { name, code: code.toUpperCase(), flag, type: type || 'COUNTRY' }
    });

    return NextResponse.json(newCountry);
  } catch (error: any) {
    return NextResponse.json({ error: "این کد یا نام قبلاً ثبت شده است." }, { status: 500 });
  }
}

// حذف
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "شناسه یافت نشد" }, { status: 400 });

    await prisma.country.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}