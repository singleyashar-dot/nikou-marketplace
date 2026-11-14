import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "شناسه کاربر یافت نشد" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userRoles: { include: { role: true } }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      phone: user.phone || '',
      displayName: user.profile?.displayName || '',
      city: user.profile?.city || '',
      bio: user.profile?.bio || '',
      avatarUrl: user.profile?.avatarUrl || '',
      isVerified: user.profile?.isVerified || false,
      plan: user.profile?.plan || 'FREE', // 👈 پلن
      planExpiresAt: user.profile?.planExpiresAt || null, // 👈 تاریخ انقضا
      role: user.userRoles.length > 0 ? user.userRoles[0].role.name : 'BUYER'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, displayName, phone, city, bio, avatarUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: "شناسه کاربر یافت نشد" }, { status: 400 });
    }

    if (phone) {
      await prisma.user.update({
        where: { id: userId },
        data: { phone }
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        displayName,
        city,
        bio,
        avatarUrl
      },
      create: {
        userId,
        displayName,
        city,
        bio,
        avatarUrl
      }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}