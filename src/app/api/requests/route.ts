import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    let whereClause = {};
    if (role === 'BUYER' && userId) {
      whereClause = { buyerId: userId };
    }

    const requests = await prisma.request.findMany({
      where: whereClause,
      include: {
        category: true,
        buyer: { include: { profile: true } },
        matches: {
          include: {
            listing: {
              include: {
                seller: { include: { profile: true } },
                media: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedRequests = requests.map((req: any) => { // 👈 any اضافه شد
      return {
        id: req.id,
        title: req.title,
        description: req.description,
        quantity: req.quantity,
        unit: req.unit,
        categoryId: req.categoryId,
        categoryName: req.category?.title || 'عمومی',
        createdAt: req.createdAt,
        buyerName: req.buyer.profile?.displayName || req.buyer.email.split('@')[0] || 'خریدار نیکو',
        matches: req.matches 
      };
    });

    return NextResponse.json(formattedRequests, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, quantity, unit, buyerId, categoryId } = body;

    if (!title || !buyerId) {
      return NextResponse.json({ error: "عنوان و شناسه خریدار الزامی است" }, { status: 400 });
    }

    const newRequest = await prisma.request.create({
      data: {
        title,
        description,
        quantity: Number(quantity) || 1,
        unit: unit || 'عدد',
        buyerId: buyerId,
        categoryId: categoryId || null
      }
    });

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}