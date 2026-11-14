import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.listing.findMany({
      include: { seller: { include: { profile: true } }, category: true, media: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, unit, stockQuantity, categoryId, country, sellerId, imageUrl } = body;

    if (!title || !sellerId) return NextResponse.json({ error: "عنوان و فروشنده الزامی است" }, { status: 400 });

    const newListing = await prisma.listing.create({
      data: {
        title, description, price: Number(price) || 0, unit: unit || 'عدد',
        stockQuantity: Number(stockQuantity) || 0, categoryId: categoryId || null,
        country: country || 'ایران', // 👈 ذخیره کشور
        sellerId: sellerId,
        media: imageUrl ? { create: { url: imageUrl } } : undefined
      }
    });

    return NextResponse.json({ success: true, listing: newListing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, price, unit, stockQuantity, categoryId, country, imageUrl } = body;

    if (!id) return NextResponse.json({ error: "شناسه کالا یافت نشد" }, { status: 400 });

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title, description, price: Number(price) || 0, unit: unit || 'عدد',
        stockQuantity: Number(stockQuantity) || 0, categoryId: categoryId || null,
        country: country || 'ایران', // 👈 آپدیت کشور
      }
    });

    if (imageUrl) {
      const existingMedia = await prisma.listingMedia.findFirst({ where: { listingId: id } });
      if (existingMedia) await prisma.listingMedia.update({ where: { id: existingMedia.id }, data: { url: imageUrl } });
      else await prisma.listingMedia.create({ data: { url: imageUrl, listingId: id } });
    }

    return NextResponse.json({ success: true, listing: updatedListing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "شناسه کالا یافت نشد" }, { status: 400 });

    await prisma.listingMedia.deleteMany({ where: { listingId: id } });
    await prisma.listing.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "کالا با موفقیت حذف شد" });
  } catch (error: any) {
    if (error.code === 'P2003') return NextResponse.json({ error: "این کالا دارای سفارش ثبت شده است و قابل حذف نیست." }, { status: 400 });
    return NextResponse.json({ error: error.message || "خطا در حذف کالا" }, { status: 500 });
  }
}