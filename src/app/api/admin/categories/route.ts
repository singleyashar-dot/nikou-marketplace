import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });

    // ساخت یک slug یکتا برای دسته‌بندی جدید
    const slug = title.trim().replace(/\s+/g, '-') + '-' + Date.now();

    const newCategory = await prisma.category.create({
      data: { title, slug }
    });
    return NextResponse.json(newCategory);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "شناسه یافت نشد" }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "امکان حذف این دسته‌بندی وجود ندارد. ممکن است کالایی به آن متصل باشد." }, { status: 500 });
  }
}