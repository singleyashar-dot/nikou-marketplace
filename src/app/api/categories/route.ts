import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic'; // 👈 این خط جادو می‌کنه

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(categories, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}