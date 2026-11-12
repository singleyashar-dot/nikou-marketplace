"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, CheckCircle2, XCircle } from "lucide-react";

export default function SellingGuidePage() {
  return (
    <div className="min-h-screen bg-nikou-cream font-sans text-nikou-dark" dir="rtl">
      
      {/* هدر ناوبری */}
      <header className="bg-nikou-dark text-white sticky top-0 z-50 h-24 flex items-center border-b border-white/10">
        <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[25px] font-medium tracking-[3px] text-white">NIKOU</span>
            <div className="w-px h-6 bg-nikou-green"></div>
            <span className="text-[33px] font-extrabold text-white leading-none mt-2">نیکو</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[14px]">
            <Link href="/about" className="text-nikou-textLight hover:text-white transition-colors">درباره نیکو</Link>
            <Link href="/guide/buy" className="text-nikou-textLight hover:text-white transition-colors">راهنمای خرید</Link>
            <Link href="/guide/sell" className="text-nikou-greenLight font-semibold transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-nikou-greenLight">راهنمای فروش</Link>
            <Link href="/contact" className="text-nikou-textLight hover:text-white transition-colors">تماس با ما</Link>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[14px] text-white hover:text-nikou-greenLight transition-colors">ورود</Link>
            <Link href="/dashboard/products/new" className="bg-nikou-green text-white px-6 py-3 rounded-lg text-[15px] font-semibold hover:bg-emerald-700 transition-colors">ثبت آگهی</Link>
          </div>
        </div>
      </header>

      {/* نوار ناوبری راهنماها */}
      <div className="bg-[#1B3026] h-14 flex items-center justify-end px-16 gap-9 text-[15px] text-[#C6D8CC]">
        <Link href="/contact" className="hover:text-white transition-colors">تماس با ما</Link>
        <Link href="/guide/sell" className="text-nikou-greenLight font-semibold underline underline-offset-4">راهنمای فروش</Link>
        <Link href="/guide/buy" className="hover:text-white transition-colors">راهنمای خرید</Link>
        <Link href="/about" className="hover:text-white transition-colors">درباره نیکو</Link>
      </div>

      {/* ۱. بخش آغاز راهنمای فروش (Hero) */}
      <section className="bg-nikou-dark py-16 w-full">
        <div className="max-w-[1440px] mx-auto px-16">
          <span className="text-nikou-greenLight text-[14px]">مرکز راهنمای نیکو / راهنمای فروش</span>
          
          <div className="flex flex-col lg:flex-row items-start gap-16 mt-8">
            
            {/* متن اصلی سمت راست */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="w-full lg:w-2/3 flex flex-col items-start gap-6"
            >
              <h1 className="text-[46px] font-bold leading-[1.6] text-nikou-cream">
                خوب معرفی کنید،<br />
                روشن‌تر گفت‌وگو کنید.
              </h1>
              <p className="text-[20px] text-[#BCCFC2] leading-relaxed">
                کالا یا خدمتتان را دقیق معرفی کنید تا خریدار بداند دقیقاً چه چیزی دریافت می‌کند و گفت‌وگو از یک نقطه روشن شروع شود.
              </p>
              <div className="mt-4 border-t border-white/10 pt-4 w-full">
                <p className="text-[14px] text-nikou-greenLight">شروع رایگان · خرید و فروش با یک حساب</p>
              </div>
            </motion.div>

            {/* کارت نمونه آگهی سمت چپ */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/3 bg-[#1B3026] p-8 rounded-2xl border border-white/5 flex flex-col gap-4"
            >
              <span className="text-nikou-greenLight text-[14px]">نمونه خلاصه آگهی</span>
              <h3 className="text-nikou-cream text-[26px] font-semibold">کارتن پنج‌لایه کرافت</h3>
              <p className="text-[23px] font-bold text-nikou-greenLight">۴۸٬۰۰۰ تومان / عدد</p>
              <p className="text-[16px] text-[#C6D8CC] leading-relaxed whitespace-pre-line">
                ابعاد: ۴۰ × ۳۰ × ۳۰ سانتی‌متر{"\n"}
                موجودی: ۲٬۰۰۰ عدد{"\n"}
                حداقل سفارش: ۱۰۰ عدد
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ۲. مراحل فروش (۴ کارت) */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-10">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right">از معرفی عرضه تا بررسی درخواست.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: "۰۱", title: "عرضه را معرفی کنید", desc: "عنوان دقیق، دسته‌بندی مناسب، عکس واضح و مشخصات کامل را وارد کنید." },
              { num: "۰۲", title: "شرایط را بنویسید", desc: "قیمت، ارز، واحد فروش، وضعیت موجودی و زمان تأمین را مشخص کنید." },
              { num: "۰۳", title: "منتشر کنید", desc: "اطلاعات را مرور و عرضه را منتشر کنید. آگهی شما در بازارگاه قابل مشاهده است." },
              { num: "۰۴", title: "گفت‌وگو کنید", desc: "درخواست‌ها را بررسی کنید؛ درباره پذیرش، مقدار نهایی و شرایط توافق کنید." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-[#FFFEFA] p-7 rounded-xl border border-[#DCDDD2] flex flex-col gap-3"
              >
                <span className="text-[30px] font-bold text-nikou-green">{item.num}</span>
                <h3 className="text-[22px] font-semibold text-nikou-dark">{item.title}</h3>
                <p className="text-[17px] text-[#59675E] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ۳. کیفیت آگهی (مقایسه) */}
      <section className="py-16 w-full bg-nikou-cream border-t border-[#DCDDD2]">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-8">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right">تفاوت یک آگهی مبهم با یک عرضه روشن.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* نمونه روشن */}
            <div className="bg-[#E5EDE3] p-8 rounded-xl flex flex-col gap-4 border border-emerald-100">
              <div className="flex items-center gap-2 text-nikou-green">
                <CheckCircle2 size={20} />
                <span className="font-semibold text-[15px]">روشن و قابل بررسی</span>
              </div>
              <h3 className="text-[24px] font-bold text-nikou-dark">کارتن پنج‌لایه کرافت، ۴۰ × ۳۰ × ۳۰</h3>
              <p className="text-[18px] text-[#59675E] leading-relaxed whitespace-pre-line">
                ۴۸٬۰۰۰ تومان / عدد{"\n"}
                موجودی ۲٬۰۰۰ عدد؛ حداقل سفارش ۱۰۰ عدد؛ آماده تحویل
              </p>
            </div>

            {/* نمونه مبهم */}
            <div className="bg-[#FFFEFA] p-8 rounded-xl flex flex-col gap-4 border border-[#DCDDD2]">
              <div className="flex items-center gap-2 text-[#8C5B39]">
                <XCircle size={20} />
                <span className="font-semibold text-[15px]">مبهم و نیازمند پرسش بیشتر</span>
              </div>
              <h3 className="text-[24px] font-bold text-nikou-dark">کارتن عالی، قیمت مناسب!</h3>
              <p className="text-[18px] text-[#59675E] leading-relaxed whitespace-pre-line">
                بدون ابعاد، بدون واحد قیمت، بدون مقدار دقیق موجودی. خریدار نمی‌داند دقیقاً چه چیزی و با چه شرایطی تحویل می‌گیرد.
              </p>
            </div>

          </div>

          <p className="text-[18px] font-semibold text-nikou-green text-right mt-2">عکس واضح + عنوان دقیق + مشخصات کامل = آگهی روشن</p>
        </div>
      </section>

      {/* ۴. قیمت و موجودی */}
      <section className="py-16 w-full bg-nikou-dark">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-10">
          <h2 className="text-[34px] font-bold text-nikou-cream text-right">قیمت و موجودی، دو پیام مستقل‌اند.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1B3026] p-7 rounded-xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-[23px] font-semibold text-nikou-cream">نوع قیمت</h3>
              <p className="text-[17px] text-[#BCCFC2] leading-relaxed">
                قیمت ثابت، قابل مذاکره یا استعلام قیمت. مشخص کنید کدام مدل را انتخاب کرده‌اید تا خریدار بداند چگونه باید با شما ارتباط بگیرد.
              </p>
            </div>
            <div className="bg-[#1B3026] p-7 rounded-xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-[23px] font-semibold text-nikou-cream">وضعیت موجودی</h3>
              <p className="text-[17px] text-[#BCCFC2] leading-relaxed">
                موجود، ناموجود، پیش‌سفارش یا نامحدود را شفاف مشخص کنید. شفافیت در موجودی، از درخواست‌های بی‌نتیجه جلوگیری می‌کند.
              </p>
            </div>
            <div className="bg-[#1B3026] p-7 rounded-xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-[23px] font-semibold text-nikou-cream">به‌روزرسانی مسئولانه</h3>
              <p className="text-[17px] text-[#BCCFC2] leading-relaxed">
                تعداد موجودی با وضعیت انتشار یکسان نیست. وقتی موجودی تمام می‌شود، آگهی را به‌روزرسانی کنید تا اعتماد خریدار حفظ شود.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ۵. پرسش‌های فروش (FAQ) */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-6">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right mb-4">پرسش‌های رایج عرضه‌کنندگان</h2>
          
          {[
            { q: "برای فروش، حساب جداگانه لازم دارم؟", a: "خیر. خرید و فروش نقش‌های یک حساب هستند. با یک حساب می‌توانید هم خرید کنید و هم کالای خود را عرضه کنید." },
            { q: "ثبت عرضه به اشتراک یا احراز رسمی نیاز دارد؟", a: "استفاده پایه رایگان است و اشتراک اجباری نیست. اما برای دریافت نشان تایید و اعتماد بیشتر، می‌توانید درخواست احراز هویت (تیک آبی) دهید." },
            { q: "ارسال درخواست خریدار یعنی معامله نهایی شده؟", a: "خیر. درخواست، شروع گفت‌وگو است. پذیرش، تعیین شرایط نهایی و پرداخت، توسط خود شما و خریدار انجام می‌شود." }
          ].map((faq, i) => (
            <div key={i} className="bg-[#FFFEFA] p-6 rounded-xl border border-[#DCDDD2] flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-nikou-green" />
                <h3 className="text-[20px] font-semibold text-nikou-dark">{faq.q}</h3>
              </div>
              <p className="text-[17px] text-[#59675E] leading-relaxed mr-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ۶. شروع فروش (CTA) */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16">
          <div className="bg-[#E5EDE3] rounded-2xl p-8 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-start gap-3 w-full lg:w-2/3">
              <h2 className="text-[30px] font-bold text-nikou-dark">موجودی شما، فرصت بعدی یک خریدار.</h2>
              <p className="text-[17px] text-[#59675E]">با یک معرفی دقیق، مسیر ارتباط را کوتاه‌تر کنید.</p>
            </div>
            <Link href="/dashboard/products/new" className="bg-nikou-green text-nikou-cream px-8 py-4 rounded-xl font-semibold text-center hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shrink-0 w-full lg:w-auto">
              ثبت آگهی رایگان
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* فوتر */}
      <footer className="bg-nikou-dark text-white py-16">
        <div className="max-w-[1440px] mx-auto px-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[25px] font-medium tracking-[3px]">NIKOU</span>
              <div className="w-px h-6 bg-nikou-green"></div>
              <span className="text-[33px] font-extrabold leading-none mt-2">نیکو</span>
            </div>
            <p className="text-nikou-textLight text-sm leading-relaxed max-w-md">
              بازارگاه جامع تجارت نیکو، بستری امن و حرفه‌ای برای اتصال خریداران و فروشندگان عمده در سراسر کشور است. ما با ارائه ابزارهای مدرن، تجارت شما را متحول می‌کنیم.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-nikou-textLight">
              <li><Link href="/about" className="hover:text-nikou-green transition-colors">درباره ما</Link></li>
              <li><Link href="/contact" className="hover:text-nikou-green transition-colors">تماس با ما</Link></li>
              <li><Link href="#" className="hover:text-nikou-green transition-colors">قوانین و مقررات</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">خدمات مشتریان</h4>
            <ul className="space-y-2 text-sm text-nikou-textLight">
              <li><Link href="#" className="hover:text-nikou-green transition-colors">پرسش‌های متداول</Link></li>
              <li><Link href="/guide/sell" className="hover:text-nikou-green transition-colors">راهنمای فروش</Link></li>
              <li><Link href="#" className="hover:text-nikou-green transition-colors">شرایط بازگشت کالا</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-16 mt-12 pt-8 border-t border-white/10 text-center text-xs text-nikou-textMuted">
          تمامی حقوق مادی و معنوی این سایت متعلق به بازارگاه نیکو می‌باشد. © ۱۴۰۳
        </div>
      </footer>

    </div>
  );
}