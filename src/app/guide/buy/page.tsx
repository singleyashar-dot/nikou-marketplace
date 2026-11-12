"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, ShieldCheck, HelpCircle } from "lucide-react";

export default function BuyingGuidePage() {
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
            <Link href="/guide/buy" className="text-nikou-greenLight font-semibold transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-nikou-greenLight">راهنمای خرید</Link>
            <Link href="/guide/sell" className="text-nikou-textLight hover:text-white transition-colors">راهنمای فروش</Link>
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
        <Link href="/guide/sell" className="hover:text-white transition-colors">راهنمای فروش</Link>
        <Link href="/guide/buy" className="text-nikou-greenLight font-semibold underline underline-offset-4">راهنمای خرید</Link>
        <Link href="/about" className="hover:text-white transition-colors">درباره نیکو</Link>
      </div>

      {/* ۱. بخش آغاز راهنمای خرید (Hero) */}
      <section className="bg-nikou-dark py-16 w-full">
        <div className="max-w-[1440px] mx-auto px-16">
          <span className="text-nikou-greenLight text-[14px]">مرکز راهنمای نیکو / راهنمای خرید</span>
          
          <div className="flex flex-col lg:flex-row items-start gap-16 mt-8">
            
            {/* متن اصلی سمت راست */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="w-full lg:w-2/3 flex flex-col items-start gap-6"
            >
              <h1 className="text-[46px] font-bold leading-[1.6] text-nikou-cream">
                خرید خوب،<br />
                از سؤال درست شروع می‌شود.
              </h1>
              <p className="text-[20px] text-[#BCCFC2] leading-relaxed">
                نیازتان را پیدا کنید، جزئیات را بسنجید و پیش از هر توافقی، شرایط را روشن کنید.
              </p>
              <div className="mt-4 border-t border-white/10 pt-4 w-full">
                <p className="text-[14px] text-nikou-greenLight">بدون پرداخت در نیکو · توافق مستقیم طرفین</p>
              </div>
            </motion.div>

            {/* کارت خلاصه مسیر سمت چپ */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/3 bg-[#1B3026] p-8 rounded-2xl border border-white/5 flex flex-col gap-4"
            >
              <h3 className="text-nikou-cream text-[24px] font-semibold mb-2">از نیاز تا گفت‌وگو</h3>
              <div className="flex flex-col gap-3 text-[18px] text-[#C6D8CC]">
                <span>۰۱ &nbsp; کشف آگهی مناسب</span>
                <span>۰۲ &nbsp; بررسی فروشنده و شرایط</span>
                <span>۰۳ &nbsp; ارسال درخواست خرید</span>
                <span>۰۴ &nbsp; مذاکره و توافق</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ۲. مراحل خرید (۴ کارت) */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-10">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right">قدم‌به‌قدم، تا یک تصمیم آگاهانه.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: "۰۱", title: "آگهی را پیدا کنید", desc: "کالا یا خدمت را جست‌وجو و گزینه‌ها را مقایسه کنید." },
              { num: "۰۲", title: "شرایط را بررسی کنید", desc: "نوع قیمت، موجودی، حداقل سفارش و مشخصات را دقیق بخوانید." },
              { num: "۰۳", title: "درخواست بفرستید", desc: "مقدار، واحد، محل تحویل و توضیحات نیازتان را ثبت کنید." },
              { num: "۰۴", title: "توافق کنید", desc: "درباره قیمت نهایی، روش پرداخت و زمان تأمین به تفاهم برسید." }
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

      {/* ۳. قیمت و شرایط */}
      <section className="py-16 w-full bg-nikou-cream border-t border-[#DCDDD2]">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-8">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right">این قیمت، دقیقاً چه معنایی دارد؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "قیمت ثابت", desc: "مبلغ درج‌شده را همراه ارز، واحد و شرایط تحویل بپذیرید." },
              { title: "قابل مذاکره", desc: "قیمت اعلامی نقطه شروع گفت‌وگو است؛ می‌توانید پیشنهاد بدهید." },
              { title: "استعلام قیمت", desc: "فروشنده پس از دریافت جزئیات نیازتان، قیمت را اعلام می‌کند." }
            ].map((item, i) => (
              <div key={i} className="bg-[#FFFEFA] p-7 rounded-xl border border-[#DCDDD2] flex flex-col gap-3">
                <h3 className="text-[22px] font-semibold text-nikou-dark">{item.title}</h3>
                <p className="text-[17px] text-[#59675E] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#E5EDE3] p-6 rounded-xl border border-emerald-100 flex flex-col gap-2 mt-4">
            <p className="text-[21px] font-bold text-nikou-green">۴۸٬۰۰۰ تومان / عدد  ≠  ۴۸٬۰۰۰ تومان / کیلوگرم</p>
            <p className="text-[17px] text-[#59675E]">همیشه ارز، واحد قیمت‌گذاری و زمان آخرین به‌روزرسانی را بررسی کنید.</p>
          </div>
        </div>
      </section>

      {/* ۴. پیش از توافق */}
      <section className="py-16 w-full bg-nikou-dark">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="w-full lg:w-1/2 bg-[#1B3026] p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h3 className="text-[22px] font-bold text-nikou-cream mb-2">چک‌لیست پیش از توافق</h3>
            <ul className="flex flex-col gap-3 text-[17px] text-[#C6D8CC] list-disc list-inside">
              <li>مشخصات و مقدار موردنیاز را دقیق تطبیق دهید.</li>
              <li>زمان تأمین، روش ارسال و هزینه تحویل را بپرسید.</li>
              <li>شرایط پرداخت و اجرای معامله را با طرف مقابل روشن کنید.</li>
              <li>تأیید راه تماس را با احراز رسمی هویت یکسان‌سازی کنید.</li>
            </ul>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h2 className="text-[32px] font-bold leading-[1.6] text-nikou-cream">درخواست خرید،<br />هنوز معامله قطعی نیست.</h2>
            <p className="text-[18px] text-[#BCCFC2] leading-relaxed">
              ارسال درخواست به معنی پرداخت، توافق نهایی یا تعهد خرید نیست. نیکو بستری برای آشنایی و شروع گفت‌وگوست و تصمیم نهایی با شماست.
            </p>
          </div>

        </div>
      </section>

      {/* ۵. پرسش‌های خرید (FAQ) */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-6">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right mb-4">پیش از شروع، این‌ها را بدانید.</h2>
          
          {[
            { q: "برای درخواست خرید باید اشتراک بخرم؟", a: "خیر. استفاده پایه بازارگاه رایگان است و برای ارسال درخواست خرید نیازی به پرداخت هزینه نیست." },
            { q: "آگهی ناموجود را می‌توان دوباره بررسی کرد؟", a: "بله. ناموجود شدن، به معنی حذف آگهی نیست و ممکن است فروشنده موجودی خود را به‌روزرسانی کند." },
            { q: "تخلف در آگهی را کجا گزارش کنم؟", a: "از گزینه گزارش تخلف در همان آگهی استفاده کنید تا تیم پشتیبانی نیکو بررسی کند." }
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

      {/* ۶. شروع خرید (CTA) */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16">
          <div className="bg-[#E5EDE3] rounded-2xl p-8 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-start gap-3 w-full lg:w-2/3">
              <h2 className="text-[30px] font-bold text-nikou-dark">حالا از نیازتان شروع کنید.</h2>
              <p className="text-[17px] text-[#59675E]">عرضه‌های مستقل را ببینید و گفت‌وگو را آغاز کنید.</p>
            </div>
            <Link href="/" className="bg-nikou-green text-nikou-cream px-8 py-4 rounded-xl font-semibold text-center hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shrink-0 w-full lg:w-auto">
              جست‌وجوی آگهی‌ها
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
              <li><Link href="/guide/buy" className="hover:text-nikou-green transition-colors">راهنمای خرید امن</Link></li>
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