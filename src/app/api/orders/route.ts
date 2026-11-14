import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

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
        buyer: { include: { profile: true } },
        seller: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, quantity, totalPrice, buyerId } = body;

    if (!listingId || !buyerId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return NextResponse.json({ error: "کالا یافت نشد" }, { status: 404 });

    const newOrder = await prisma.order.create({
      data: {
        buyerId,
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
      }
    });

    // 👈 اعلان برای فروشنده
    try {
      await prisma.notification.create({
        data: {
          userId: listing.sellerId,
          title: "سفارش جدید",
          message: `سفارش جدیدی برای کالای "${listing.title}" ثبت شد.`,
          link: "/dashboard/orders"
        }
      });
    } catch (notifErr) {
      console.error("Notification Error:", notifErr);
    }

    return NextResponse.json({ success: true, id: newOrder.id, message: "سفارش با موفقیت ثبت شد." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    // 👈 اعلان برای خریدار (وقتی فروشنده وضعیت رو تغییر داد)
    try {
      const statusText = status === 'ACCEPTED' ? 'تایید شد' : status === 'REJECTED' ? 'رد شد' : 'تغییر کرد';
      await prisma.notification.create({
        data: {
          userId: updatedOrder.buyerId,
          title: "تغییر وضعیت سفارش",
          message: `وضعیت سفارش شما ${statusText}.`,
          link: "/dashboard/orders"
        }
      });
    } catch (notifErr) {
      console.error("Notification Error:", notifErr);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}