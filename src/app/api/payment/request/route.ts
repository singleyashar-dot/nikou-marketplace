import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, description, userId } = await req.json();

    if (!amount || !userId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    // 👈 شبیه‌سازی لینک پرداخت (بدون رفتن به درگاه واقعی زرین‌پال)
    const mockAuthority = "MOCK-" + Math.floor(Math.random() * 1000000);
    const mockPaymentUrl = `http://localhost:3000/payment/callback?Status=OK&Authority=${mockAuthority}&userId=${userId}`;

    return NextResponse.json({ url: mockPaymentUrl });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}