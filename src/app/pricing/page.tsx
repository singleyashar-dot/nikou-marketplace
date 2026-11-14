"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Crown, Star, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 👈 تابع اتصال به درگاه پرداخت
  const handlePayment = async () => {
    const userId = localStorage.getItem('nikou_user_id');
    
    if (!userId) {
      alert("لطفا ابتدا وارد حساب کاربری خود شوید.");
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 99000, // مبلغ اشتراک (تومان)
          description: "خرید اشتراک حرفه‌ای بازارگاه نیکو",
          userId: userId
        })
      });

      const data = await res.json();

      if (res.ok && data.url) {
        // هدایت کاربر به درگاه بانک
        window.location.href = data.url;
      } else {
        alert(data.error || "خطا در ارتباط با درگاه");
        setIsLoading(false);
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nikou-cream font-sans" dir="rtl">
      
      {/* هدر ناوبری */}
      <header className="bg-nikou-dark text-white sticky top-0 z-50 h-24 flex items-center border-b border-white/10">
        <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[25px] font-medium tracking-[3px] text-white">NIKOU</span>
            <div className="w-px h-6 bg-nikou-green"></div>
            <span className="text-[33px] font-extrabold text-white leading-none mt-2">نیکو</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[14px] text-nikou-textLight">
            <Link href="/about" className="hover:text-white transition-colors">درباره نیکو</Link>
            <Link href="/guide/buy" className="hover:text-white transition-colors">راهنمای خرید</Link>
            <Link href="/guide/sell" className="hover:text-white transition-colors">راهنمای فروش</Link>
            <Link href="/contact" className="hover:text-white transition-colors">تماس با ما</Link>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[14px] text-white hover:text-nikou-greenLight transition-colors">ورود</Link>
            <Link href="/register" className="bg-nikou-green text-white px-6 py-3 rounded-lg text-[15px] font-semibold hover:bg-emerald-700 transition-colors">ثبت‌نام رایگان</Link>
          </div>
        </div>
      </header>

      {/* بخش معرفی */}
      <section className="bg-nikou-dark text-white pt-20 pb-20">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col items-center text-center gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-nikou-greenLight text-sm font-semibold flex items-center gap-2"
          >
            <Crown size={16} /> پلن‌های اشتراک ویژه فروشندگان
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[54px] font-bold leading-[1.5] text-nikou-cream max-w-4xl"
          >
            کسب‌وکار خود را به سطح <span className="text-nikou-greenLight">بالاتری</span> ببرید.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[20px] text-[#BCCFC2] leading-relaxed max-w-2xl"
          >
            با انتخاب پلن مناسب، کالاهای خود را بیشتر در معرض دید خریداران قرار دهید، نشان اعتماد بگیرید و فروش خود را چند برابر کنید.
          </motion.p>
        </div>
      </section>

      {/* کارت‌های قیمت‌گذاری */}
      <section className="max-w-[1200px] mx-auto px-8 mt-12 mb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* پلن پایه */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-3xl p-8 shadow-sm flex flex-col h-full"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-nikou-dark">پلن پایه</h3>
              <p className="text-sm text-nikou-textMuted mt-2">برای شروع و تست بازارگاه</p>
            </div>
            <div className="flex items-end gap-1 mb-8 h-[50px]">
              <span className="text-4xl font-black text-nikou-dark">رایگان</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {[
                "ثبت حداکثر ۵ کالا",
                "پشتیبانی از طریق تیکت",
                "نمایش در نتایج جستجو",
                "دسترسی به داشبورد مدیریت"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#59675E] font-medium">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-gray-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="w-full text-center bg-[#F5F2EA] text-nikou-dark font-bold py-4 rounded-xl hover:bg-[#E5EDE3] transition-colors mt-auto">
              شروع رایگان
            </Link>
          </motion.div>

          {/* پلن حرفه‌ای */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-nikou-dark rounded-3xl p-8 shadow-2xl flex flex-col h-full relative border-2 border-nikou-green"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-nikou-green text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md whitespace-nowrap">
              <Star size={12} fill="white" /> محبوب‌ترین
            </div>
            
            <div className="mb-6 mt-2">
              <h3 className="text-2xl font-bold text-white">حرفه‌ای</h3>
              <p className="text-sm text-[#BCCFC2] mt-2">برای رشد و افزایش فروش</p>
            </div>
            <div className="flex items-end gap-2 mb-8 h-[50px]">
              <span className="text-4xl font-black text-nikou-greenLight">۹۹,۰۰۰</span>
              <span className="text-sm text-[#BCCFC2] mb-1">تومان / ماهانه</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {[
                "ثبت حداکثر ۵۰ کالا",
                "دریافت نشان تایید (تیک آبی)",
                "نمایش ویژه در نتایج جستجو",
                "پشتیبانی تلفنی اولویت‌دار",
                "گزارش‌های تحلیلی بازدید کالا"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#E5EDE3] font-medium">
                  <div className="w-5 h-5 rounded-full bg-nikou-green/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-nikou-greenLight" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            {/* 👈 دکمه متصل به درگاه پرداخت */}
            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full text-center bg-nikou-green text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg mt-auto disabled:opacity-70"
            >
              {isLoading ? "در حال انتقال..." : "ارتقا به حرفه‌ای"}
            </button>
          </motion.div>

          {/* پلن سازمانی */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-3xl p-8 shadow-sm flex flex-col h-full"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-nikou-dark">سازمانی</h3>
              <p className="text-sm text-nikou-textMuted mt-2">برای شرکت‌های بزرگ</p>
            </div>
            <div className="flex items-end gap-2 mb-8 h-[50px]">
              <span className="text-4xl font-black text-nikou-dark">۲۹۹,۰۰۰</span>
              <span className="text-sm text-nikou-textMuted mb-1">تومان / ماهانه</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {[
                "ثبت کالای نامحدود",
                "نشان تایید و لوگوی ویژه",
                "قرارگیری در صدر نتایج (Top Ad)",
                "پشتیبانی اختصاصی (مدیر حساب)",
                "دسترسی به API بازارگاه",
                "گزارش‌های تحلیلی پیشرفته"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#59675E] font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#E8EFE6] flex items-center justify-center shrink-0">
                    <Check size={14} className="text-nikou-green" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full text-center bg-[#F5F2EA] text-nikou-dark font-bold py-4 rounded-xl hover:bg-[#E5EDE3] transition-colors mt-auto">
              تماس با فروش
            </button>
          </motion.div>

        </div>
      </section>

      {/* بخش سوالات متداول */}
      <section className="max-w-[1000px] mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-nikou-dark text-center mb-12">سوالات متداول درباره اشتراک‌ها</h2>
        <div className="flex flex-col gap-4">
          {[
            { q: "آیا می‌توانم در هر زمان پلن خود را تغییر دهم؟", a: "بله، شما می‌توانید در هر زمان از پنل کاربری خود، پلن خود را ارتقا دهید یا لغو کنید. تغییرات بلافاصله اعمال می‌شوند." },
            { q: "پرداخت به چه صورت انجام می‌شود؟", a: "در حال حاضر پرداخت‌ها به صورت آنلاین و از طریق درگاه‌های امن بانکی انجام می‌شود. امکان پرداخت ماهانه و سالانه وجود دارد." },
            { q: "اگر پلن حرفه‌ای بخرم، تیک آبی فوری می‌گیرم؟", a: "پس از خرید پلن حرفه‌ای، درخواست شما در اولویت بررسی تیم پشتیبانی قرار می‌گیرد و به سرعت تایید می‌شود." }
          ].map((faq, i) => (
            <div key={i} className="bg-[#FFFEFA] border border-[#DCDDD2] p-6 rounded-2xl flex gap-4">
              <HelpCircle size={24} className="text-nikou-green shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-nikou-dark mb-2">{faq.q}</h3>
                <p className="text-sm text-[#59675E] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* فوتر */}
      <footer className="bg-nikou-dark text-white py-16">
        <div className="max-w-[1440px] mx-auto px-16 text-center text-xs text-nikou-textMuted">
          تمامی حقوق مادی و معنوی این سایت متعلق به بازارگاه نیکو می‌باشد. © ۱۴۰۳
        </div>
      </footer>

    </div>
  );
}