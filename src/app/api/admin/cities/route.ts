import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(cities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "نام شهر الزامی است" }, { status: 400 });

    const newCity = await prisma.city.create({ data: { name } });
    return NextResponse.json(newCity);
  } catch (error: any) {
    return NextResponse.json({ error: "این شهر قبلاً ثبت شده است." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "شناسه یافت نشد" }, { status: 400 });

    await prisma.city.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "امکان حذف این شهر وجود ندارد." }, { status: 500 });
  }
}