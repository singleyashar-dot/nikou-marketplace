import { NextResponse } from 'next/server';
// import { prisma } from '../../../../lib/prisma'; 
// (اگر بخواهید پیام‌ها را در دیتابیس ذخیره کنید، این خط را از کامنت دربیاورید و از کدهای پایین استفاده کنید)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, topic, title, message } = body;

    if (!email || !message || !title) {
      return NextResponse.json({ error: "لطفا فیلدهای ضروری را پر کنید." }, { status: 400 });
    }

    // 📌 اینجا می‌توانید پیام را در دیتابیس ذخیره کنید (مثلا در جدول SupportTicket)
    // چون کاربر ممکن است لاگین نباشد، باید با یک کاربر سیستم (System User) یا به صورت موقت ثبت شود.
    // برای فاز فعلی، فقط پیام را در کنسول سرور چاپ می‌کنیم تا مطمئن شویم می‌رسد.
    console.log("📩 پیام جدید از فرم تماس:", { name, email, topic, title, message });

    // شبیه‌سازی تاخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: "پیام شما با موفقیت دریافت شد." });
  } catch (error: any) {
    return NextResponse.json({ error: "خطا در ارتباط با سرور" }, { status: 500 });
  }
}