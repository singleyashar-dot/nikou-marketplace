import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        seller: true,
        media: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(listings);
  } catch (error: any) {
    console.error("Admin Products API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "شناسه کالا یافت نشد" }, { status: 400 });
    }

    // تلاش برای حذف کالا
    await prisma.listing.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true, message: "کالا با موفقیت حذف شد" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    
    // اگر کالا سفارش ثبت شده داشت، دیتابیس ارور P2003 میده
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: "این کالا دارای سفارش ثبت شده است و قابل حذف نیست." 
      }, { status: 400 });
    }

    return NextResponse.json({ error: error.message || "خطا در حذف کالا" }, { status: 500 });
  }
}