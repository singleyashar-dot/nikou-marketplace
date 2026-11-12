import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const usersCount = await prisma.user.count();
    const productsCount = await prisma.listing.count();
    const ordersCount = await prisma.order.count();
    
    // شمارش درخواست‌های احراز هویت در انتظار
    const pendingVerifications = await prisma.verification.count({
      where: { status: "PENDING" }
    });

    return NextResponse.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      pendingVerifications: pendingVerifications
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}