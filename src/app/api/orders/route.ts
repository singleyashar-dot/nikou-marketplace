import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, quantity, totalPrice, buyerId } = body;

    if (!buyerId) {
      return NextResponse.json({ error: "لطفا ابتدا وارد شوید." }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return NextResponse.json({ error: "کالا یافت نشد" }, { status: 404 });

    // کنترل موجودی در سمت سرور (جلوگیری از هک شدن)
    if (Number(quantity) > listing.stockQuantity) {
      return NextResponse.json({ error: "موجودی کالا کافی نیست." }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        buyerId: buyerId,
        sellerId: listing.sellerId,
        snapshotPrice: listing.price || 0,
        snapshotCurrency: listing.currency,
        snapshotUnit: listing.unit || "عدد",
        totalAmount: Number(totalPrice),
        status: "PENDING",
        items: {
          create: {
            listingId: listing.id,
            quantity: Number(quantity),
            unitPrice: listing.price || 0,
            totalPrice: Number(totalPrice)
          }
        }
      },
    });

    return NextResponse.json({ message: "سفارش شما ثبت شد!", id: newOrder.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "خطای سرور: " + error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId) {
      return NextResponse.json({ error: "شناسه کاربر ارسال نشده" }, { status: 400 });
    }

    let whereClause = {};
    
    if (role === 'SELLER') {
      whereClause = { sellerId: userId };
    } else {
      whereClause = { buyerId: userId };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: { 
        items: { include: { listing: { include: { media: true } } } }, 
        buyer: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "اطلاعات ناقص" }, { status: 400 });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ message: "وضعیت تغییر کرد!", order: updatedOrder }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}