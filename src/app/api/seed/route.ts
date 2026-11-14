import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // پیدا کردن یک فروشنده برای نسبت دادن کالاها
    const seller = await prisma.user.findFirst();
    if (!seller) {
      return NextResponse.json({ error: "ابتدا باید یک کاربر در سیستم ثبت‌نام کند." }, { status: 400 });
    }

    const products = [
      { title: "زعفران سرگل درجه یک", price: 85000000, unit: "کیلوگرم", stock: 50, desc: "زعفران خالص ایرانی با بسته‌بندی صادراتی" },
      { title: "برنج هاشمی معطر", price: 120000, unit: "کیلوگرم", stock: 5000, desc: "برنج هاشمی درجه یک از شالیزارهای شمال" },
      { title: "چای سیاه قلم", price: 250000, unit: "کیلوگرم", stock: 1200, desc: "چای قلم لاهیجان با عطر و طعم عالی" },
      { title: "روغن زیتون فرابکر", price: 450000, unit: "لیتر", stock: 800, desc: "روغن زیتون ارگانیک بدون افزودنی" },
      { title: "پسته اکبری", price: 980000, unit: "کیلوگرم", stock: 300, desc: "پسته اکبری خندان درجه یک" },
      { title: "خرمای مضافتی بم", price: 85000, unit: "کیلوگرم", stock: 2000, desc: "خرمای تازه و مرغوب بم" },
      { title: "قند شکسته", price: 45000, unit: "کیلوگرم", stock: 10000, desc: "قند شکسته بهداشتی" },
      { title: "شکر سفید", price: 35000, unit: "کیلوگرم", stock: 15000, desc: "شکر صنعتی بسته‌بندی ۱۰ کیلویی" },
      { title: "عدس درشت", price: 95000, unit: "کیلوگرم", stock: 3000, desc: "عدس درشت و باکیفیت" },
      { title: "لوبیا چیتی", price: 110000, unit: "کیلوگرم", stock: 2500, desc: "لوبیا چیتی تمیز و یکدست" },
      { title: "کنجد بوداده", price: 180000, unit: "کیلوگرم", stock: 1000, desc: "کنجد بوداده برای شیرینی‌پزی" },
      { title: "عسل طبیعی کوهستان", price: 450000, unit: "کیلوگرم", stock: 150, desc: "عسل طبیعی بدون شکر" },
      { title: "کره حیوانی", price: 380000, unit: "کیلوگرم", stock: 400, desc: "کره حیوانی تازه" },
      { title: "پنیر لیقوان", price: 250000, unit: "کیلوگرم", stock: 600, desc: "پنیر لیقوان اصل" },
      { title: "ماست پرچرب", price: 45000, unit: "کیلوگرم", stock: 2000, desc: "ماست پرچرب سنتی" },
      { title: "نوشابه خانواده", price: 25000, unit: "کارتن", stock: 5000, desc: "نوشابه ۱.۵ لیتری بسته ۶ عددی" },
      { title: "آب معدنی", price: 15000, unit: "کارتن", stock: 8000, desc: "آب معدنی بسته ۱۲ عددی" },
      { title: "کاغذ A4", price: 2500000, unit: "کارتن", stock: 200, desc: "کاغذ A4 بسته ۵۰۰ برگی" },
      { title: "ماشین حساب مهندسی", price: 850000, unit: "عدد", stock: 100, desc: "ماشین حساب علمی پیشرفته" },
      { title: "مبلمان اداری", price: 15000000, unit: "ست", stock: 20, desc: "ست کامل میز و صندلی مدیر" },
      { title: "کولر گازی", price: 25000000, unit: "عدد", stock: 50, desc: "کولر گازی ۲۴۰۰۰ بی‌تی‌یو" },
      { title: "کابل برق", price: 1200000, unit: "حلقه", stock: 300, desc: "کابل مسی ۲.۵" },
      { title: "لامپ LED", price: 85000, unit: "عدد", stock: 2000, desc: "لامپ کم‌مصرف ۱۲ وات" },
      { title: "پمپ آب خانگی", price: 4500000, unit: "عدد", stock: 80, desc: "پمپ آب نیم اسب بخار" },
      { title: "شیرآلات ساختمانی", price: 750000, unit: "ست", stock: 150, desc: "ست شیرآلات حمام و دستشویی" },
      { title: "سرامیک کف", price: 350000, unit: "متر", stock: 5000, desc: "سرامیک ۶۰x۶۰ ضد سایش" },
      { title: "رنگ ساختمانی", price: 1200000, unit: "حلبی", stock: 400, desc: "رنگ پلاستیک سفید" },
      { title: "گوشی هوشمند", price: 12000000, unit: "عدد", stock: 60, desc: "گوشی موبایل میان‌رده" },
      { title: "لپ‌تاپ اداری", price: 28000000, unit: "عدد", stock: 30, desc: "لپ‌تاپ مخصوص کارهای اداری" },
      { title: "پرینتر لیزری", price: 8500000, unit: "عدد", stock: 40, desc: "پرینتر سیاه و سفید" },
    ];

    for (let i = 0; i < products.length; i++) {
      await prisma.listing.create({
        data: {
          title: products[i].title,
          description: products[i].desc,
          price: products[i].price,
          stockQuantity: products[i].stock,
          unit: products[i].unit,
          sellerId: seller.id,
        }
      });
    }

    const requests = [
      { title: "خرید عمده پارچه", quantity: 500, unit: "متر" },
      { title: "نیاز به ۱۰ تن میلگرد", quantity: 10, unit: "تن" },
      { title: "خرید جعبه مقوایی", quantity: 2000, unit: "عدد" },
      { title: "سیب درجه یک", quantity: 1500, unit: "کیلوگرم" },
      { title: "لوازم یدکی خودرو", quantity: 50, unit: "ست" },
    ];

    for (let i = 0; i < requests.length; i++) {
      await prisma.request.create({
        data: {
          title: requests[i].title,
          quantity: requests[i].quantity,
          unit: requests[i].unit,
          buyerId: seller.id, // فعلاً همان کاربر را خریدار می‌گذاریم
        }
      });
    }

    return NextResponse.json({ message: "داده‌های تستی با موفقیت اضافه شدند! به صفحه اصلی بروید." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}