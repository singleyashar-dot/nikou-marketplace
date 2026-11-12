import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        userRoles: { include: { role: true } },
        verifications: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map((user: any) => { // 👈 any اضافه شد
      const hasVerified = user.verifications.some((v: any) => v.status === 'VERIFIED'); // 👈 any اضافه شد
      const isUserVerified = user.profile?.isVerified === true || hasVerified;

      return {
        id: user.id,
        name: user.profile?.displayName || 'کاربر نیکو',
        email: user.email,
        role: user.userRoles.length > 0 ? user.userRoles[0].role.name : 'BUYER',
        isVerified: isUserVerified,
        createdAt: user.createdAt
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}