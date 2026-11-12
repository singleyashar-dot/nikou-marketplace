import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 👈 این خط مهم‌ترین تغییره: باید منتظر موند تا params باز بشه
    const resolvedParams = await params;
    const sellerId = resolvedParams.id;

    if (!sellerId) {
      return NextResponse.json({ error: "شناسه فروشنده یافت نشد" }, { status: 400 });
    }

    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      include: {
        profile: true,
        userRoles: {
          include: { role: true }
        },
        listings: {
          include: { media: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!seller) {
      return NextResponse.json({ error: "فروشنده یافت نشد" }, { status: 404 });
    }

    // فرمت کردن اطلاعات برای فرانت‌اند
    const formattedSeller = {
      id: seller.id,
      email: seller.email,
      displayName: seller.profile?.displayName || seller.email.split('@')[0] || 'فروشنده نیکو',
      isVerified: seller.profile?.isVerified || false,
      city: seller.profile?.city || 'ایران',
      createdAt: seller.createdAt,
      listings: seller.listings
    };

    return NextResponse.json(formattedSeller);
  } catch (error: any) {
    console.error("Seller API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}