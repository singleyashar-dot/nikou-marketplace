"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, ShieldCheck, Link as LinkIcon, Layers, CheckCircle2, ChevronLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-nikou-cream font-sans text-nikou-dark" dir="rtl">
      
      {/* هدر ناوبری (یکدست با صفحه اصلی) */}
      <header className="bg-nikou-dark text-white sticky top-0 z-50 h-24 flex items-center border-b border-white/10">
        <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[25px] font-medium tracking-[3px] text-white">NIKOU</span>
            <div className="w-px h-6 bg-nikou-green"></div>
            <span className="text-[33px] font-extrabold text-white leading-none mt-2">نیکو</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[14px]">
            <Link href="/about" className="text-nikou-greenLight font-semibold transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-nikou-greenLight">درباره نیکو</Link>
            <Link href="/guide/buy" className="text-nikou-textLight hover:text-white transition-colors">راهنمای خرید</Link>
            <Link href="/guide/sell" className="text-nikou-textLight hover:text-white transition-colors">راهنمای فروش</Link>
            <Link href="/contact" className="text-nikou-textLight hover:text-white transition-colors">تماس با ما</Link>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[14px] text-white hover:text-nikou-greenLight transition-colors">ورود</Link>
            <Link href="/dashboard/products/new" className="bg-nikou-green text-white px-6 py-3 rounded-lg text-[15px] font-semibold hover:bg-emerald-700 transition-colors">ثبت آگهی</Link>
          </div>
        </div>
      </header>

      {/* ۱. بخش روایت برند (Hero) */}
      <section className="bg-nikou-dark py-20 w-full">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col lg:flex-row items-center gap-16">
          
          {/* تصویر */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 h-[440px] rounded-2xl overflow-hidden relative bg-[#14251E] border border-white/5 flex flex-col items-center justify-center text-nikou-textLight"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10"></div>
            <Package size={80} className="opacity-20 mb-4" />
            <span className="text-sm opacity-50 z-20">تصویر روایت برند</span>
          </motion.div>

          {/* متن */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex flex-col items-start gap-6 text-right"
          >
            <span className="text-nikou-greenLight text-[14px] font-medium tracking-wide">درباره نیکو / فرصتی برای ارتباط</span>
            <h1 className="text-[54px] font-bold leading-[1.4] text-nikou-cream">
              از موجودی شما،<br />
              تا فرصت معامله.
            </h1>
            <p className="text-[20px] text-[#BCCFC2] leading-relaxed max-w-xl">
              نیکو جایی است که عرضه کالا و خدمات به نیاز واقعی بازار گره می‌خورد. ما بستری فراهم کرده‌ایم تا معامله‌ها با شفافیت، بدون واسطه‌های اضافی و بر پایه اطلاعات دقیق شکل بگیرند.
            </p>
            <div className="mt-4 bg-[#1B3026] px-6 py-4 rounded-lg border border-white/5">
              <p className="text-nikou-greenLight font-semibold text-[15px]">یک حساب؛ برای خریدن و فروختن</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ۲. فلسفه نیکو */}
      <section className="py-20 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-10">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right">بازار، از یک ارتباط خوب شروع می‌شود.</h2>
          <div className="flex flex-col md:flex-row items-start gap-12 mt-4">
            <p className="w-full md:w-1/2 text-[29px] font-semibold leading-[1.6] text-nikou-green text-right">
              کالا در انبار شماست؛<br />
              فرصت، در شبکه ارتباطی.
            </p>
            <p className="w-full md:w-1/2 text-[18px] text-[#59675E] leading-[1.8] text-right">
              هر عرضه‌کننده، موجودی و شرایط خودش را دارد و هر خریدار، نیاز و انتظاراتش را. نیکو این دو سمت را به هم نزدیک می‌کند تا معامله‌ها بر اساس واقعیت‌های بازار شکل بگیرند، نه حدس و گمان.
            </p>
          </div>
        </div>
      </section>

      {/* ۳. مسیر ارتباط (۳ کارت) */}
      <section className="py-20 w-full bg-nikou-cream border-t border-[#DCDDD2]">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-10">
          <h2 className="text-[34px] font-bold text-nikou-dark text-right">دو مسیر، یک نقطه اتصال.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "۰۱", title: "عرضه مستقل", desc: "فروشنده کالا یا خدمت را با قیمت، موجودی و شرایط خودش ثبت می‌کند." },
              { num: "۰۲", title: "درخواست روشن", desc: "خریدار، مقدار موردنیاز و شرایط مدنظرش را شفاف اعلام می‌کند." },
              { num: "۰۳", title: "توافق با اختیار طرفین", desc: "پذیرش، مذاکره و شرایط اجرای معامله را خود طرفین تعیین می‌کنند." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                className="bg-[#FFFEFA] p-8 rounded-2xl border border-[#DCDDD2] shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <span className="text-[32px] font-bold text-nikou-green">{item.num}</span>
                <h3 className="text-[23px] font-semibold text-nikou-dark">{item.title}</h3>
                <p className="text-[17px] text-[#59675E] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ۴. اصول اعتماد */}
      <section className="py-20 w-full bg-nikou-dark">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-10">
          <h2 className="text-[34px] font-bold text-nikou-cream text-right">اعتماد، با شفافیت ساخته می‌شود.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "اختیار با شماست", desc: "نیکو تسهیل‌گر ارتباط است؛ داور اختلاف یا طرف معامله نیست. تصمیم نهایی همیشه با شماست." },
              { title: "اطلاعات دقیق‌تر، انتخاب بهتر", desc: "تأیید راه تماس با احراز رسمی هویت یکسان‌سازی می‌شود تا معامله‌ها با اطمینان بیشتری انجام شوند." },
              { title: "شروع بدون مانع", desc: "استفاده پایه رایگان است. خرید و فروش با ابزارهای ساده و بدون پیچیدگی آغاز می‌شود." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                className="bg-[#1B3026] p-7 rounded-2xl flex flex-col gap-3 border border-white/5"
              >
                <h3 className="text-[22px] font-semibold text-nikou-cream">{item.title}</h3>
                <p className="text-[17px] text-[#BCCFC2] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ۵. دعوت به شروع */}
      <section className="py-20 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16">
          <div className="bg-[#E5EDE3] rounded-3xl p-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            
            <div className="flex flex-col items-start gap-4 w-full lg:w-2/3">
              <h2 className="text-[32px] font-bold text-nikou-dark">قدم بعدی، یک ارتباط تازه است.</h2>
              <p className="text-[18px] text-[#59675E] leading-relaxed">
                چه خریدار باشید، چه عرضه‌کننده؛ از نیاز خود شروع کنید و بگذارید بازار نیکو مسیر را برایتان هموار کند.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
              <Link href="/" className="bg-nikou-green text-nikou-cream px-8 py-4 rounded-xl font-semibold text-center hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                کالا و خدمات را پیدا کن
                <ArrowLeft size={18} />
              </Link>
              <Link href="/dashboard/products/new" className="bg-[#203A2E] text-nikou-cream px-8 py-4 rounded-xl font-semibold text-center hover:bg-black transition-colors flex items-center justify-center gap-2">
                عرضه‌ات را ثبت کن
                <ArrowLeft size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* فوتر (یکدست با صفحه اصلی) */}
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