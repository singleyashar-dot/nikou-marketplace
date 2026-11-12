"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  // استیت‌های فرم
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("پشتیبانی"); // پیش‌فرض
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, title, message })
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitResult({ success: true, text: "پیام شما با موفقیت دریافت شد. به زودی پاسخ می‌دهیم." });
        // پاک کردن فرم
        setName(""); setEmail(""); setTitle(""); setMessage("");
      } else {
        setSubmitResult({ success: false, text: data.error || "خطا در ارسال پیام." });
      }
    } catch (error) {
      setSubmitResult({ success: false, text: "خطا در ارتباط با سرور." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Link href="/guide/sell" className="text-nikou-textLight hover:text-white transition-colors">راهنمای فروش</Link>
            <Link href="/contact" className="text-nikou-greenLight font-semibold transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-nikou-greenLight">تماس با ما</Link>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[14px] text-white hover:text-nikou-greenLight transition-colors">ورود</Link>
            <Link href="/dashboard/products/new" className="bg-nikou-green text-white px-6 py-3 rounded-lg text-[15px] font-semibold hover:bg-emerald-700 transition-colors">ثبت آگهی</Link>
          </div>
        </div>
      </header>

      {/* نوار ناوبری راهنماها */}
      <div className="bg-[#1B3026] h-14 flex items-center justify-end px-16 gap-9 text-[15px] text-[#C6D8CC]">
        <Link href="/contact" className="text-nikou-greenLight font-semibold underline underline-offset-4">تماس با ما</Link>
        <Link href="/guide/sell" className="hover:text-white transition-colors">راهنمای فروش</Link>
        <Link href="/guide/buy" className="hover:text-white transition-colors">راهنمای خرید</Link>
        <Link href="/about" className="hover:text-white transition-colors">درباره نیکو</Link>
      </div>

      {/* ۱. بخش آغاز تماس (Hero) */}
      <section className="bg-nikou-dark py-16 w-full">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-6">
          <span className="text-nikou-greenLight text-[14px]">نیکو / تماس با ما</span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-[48px] font-bold leading-[1.6] text-nikou-cream"
          >
            گفت‌وگو،<br />
            از همین‌جا شروع می‌شود.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[20px] text-[#BCCFC2] leading-relaxed max-w-3xl"
          >
            سؤالی درباره کار با نیکو دارید، پیشنهادی برای بهتر شدن دارید یا می‌خواهید یک مشکل را گزارش کنید؟ ما اینجا هستیم تا بشنویم و پاسخ دهیم.
          </motion.p>
        </div>
      </section>

      {/* ۲. بخش فرم و مسیرهای ارتباط */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col lg:flex-row gap-12 items-start">
          
          {/* ستون راست: مسیر درست ارتباط */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1"
          >
            <h2 className="text-[26px] font-bold text-nikou-dark">برای رسیدن به پاسخ درست</h2>
            
            <div className="bg-[#E5EDE3] p-6 rounded-xl border border-emerald-100 flex flex-col gap-2">
              <h3 className="text-[20px] font-semibold text-nikou-dark">سؤال درباره خرید و فروش؟</h3>
              <p className="text-[16px] text-[#59675E] leading-relaxed">راهنماها، مراحل شروع و نکات مهم را کوتاه و روشن توضیح داده‌اند. شاید پاسخ شما همان‌جا باشد.</p>
            </div>
            
            <div className="bg-[#E5EDE3] p-6 rounded-xl border border-emerald-100 flex flex-col gap-2">
              <h3 className="text-[20px] font-semibold text-nikou-dark">گزارش یک آگهی یا حساب؟</h3>
              <p className="text-[16px] text-[#59675E] leading-relaxed">گزارش تخلف را از همان آگهی یا حساب ثبت کنید تا سریع‌تر و دقیق‌تر بررسی شود.</p>
            </div>

            <div className="bg-[#E5EDE3] p-6 rounded-xl border border-emerald-100 flex flex-col gap-2">
              <h3 className="text-[20px] font-semibold text-nikou-dark">درباره قیمت یا تحویل کالا؟</h3>
              <p className="text-[16px] text-[#59675E] leading-relaxed">برای قیمت، موجودی و شرایط اجرای معامله، گفت‌وگو را مستقیماً با طرف مقابل ادامه دهید.</p>
            </div>
          </motion.div>

          {/* ستون چپ: فرم ارسال پیام */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="w-full lg:w-2/3 bg-[#FFFEFA] p-10 rounded-2xl border border-[#DCDDD2] shadow-sm order-1 lg:order-2"
          >
            <h2 className="text-[30px] font-bold text-nikou-dark mb-2">پیامتان را بنویسید.</h2>
            <p className="text-[16px] text-[#59675E] mb-8">فقط اطلاعات لازم برای پاسخ‌گویی را وارد کنید.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* انتخاب موضوع */}
              <div className="flex flex-col gap-3">
                <label className="text-[16px] font-semibold text-nikou-dark">موضوع پیام *</label>
                <div className="grid grid-cols-3 gap-3">
                  {["همکاری", "پیشنهاد", "پشتیبانی"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`py-3 rounded-lg text-[16px] font-semibold transition-all border ${
                        topic === t 
                          ? 'bg-nikou-green text-white border-nikou-green shadow-md' 
                          : 'bg-[#F5F2EA] text-nikou-dark border-[#DCDDD2] hover:bg-[#E5EDE3]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* مشخصات فرستنده */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] font-semibold text-nikou-dark">ایمیل یا شماره موبایل *</label>
                  <input 
                    type="text" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="راه تماس برای دریافت پاسخ"
                    className="w-full p-4 rounded-lg border border-[#C3CFC4] text-[16px] focus:outline-none focus:border-nikou-green transition-colors bg-[#FFFEFA]" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] font-semibold text-nikou-dark">نام شما</label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="نام و نام خانوادگی"
                    className="w-full p-4 rounded-lg border border-[#C3CFC4] text-[16px] focus:outline-none focus:border-nikou-green transition-colors bg-[#FFFEFA]" 
                  />
                </div>
              </div>

              {/* عنوان پیام */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-semibold text-nikou-dark">عنوان پیام *</label>
                <input 
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: سؤال درباره ثبت آگهی"
                  className="w-full p-4 rounded-lg border border-[#C3CFC4] text-[16px] focus:outline-none focus:border-nikou-green transition-colors bg-[#FFFEFA]" 
                />
              </div>

              {/* متن پیام */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-semibold text-nikou-dark">متن پیام *</label>
                <textarea 
                  required rows={6} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="موضوع را با جزئیات لازم توضیح دهید..."
                  className="w-full p-4 rounded-lg border border-[#C3CFC4] text-[16px] focus:outline-none focus:border-nikou-green transition-colors resize-none bg-[#FFFEFA]"
                ></textarea>
              </div>

              <p className="text-[13px] text-[#59675E]">
                * تکمیل این موارد برای بررسی و پاسخ‌گویی ضروری است. هرگز رمز عبور، کد ورود یا اطلاعات کارت بانکی خود را برای ما ارسال نکنید.
              </p>

              {submitResult && (
                <div className={`p-4 rounded-lg flex items-center gap-2 text-sm font-semibold ${submitResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {submitResult.success ? <CheckCircle2 size={18} /> : <HelpCircle size={18} />}
                  {submitResult.text}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-nikou-green text-white font-semibold text-[17px] py-4 rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
                <Send size={18} className={isSubmitting ? "animate-pulse" : ""} />
              </button>

            </form>
          </motion.div>

        </div>
      </section>

      {/* ۳. پاسخ پرسش‌های تماس (FAQ) */}
      <section className="py-16 w-full bg-nikou-cream border-t border-[#DCDDD2]">
        <div className="max-w-[1440px] mx-auto px-16 flex flex-col gap-6">
          <h2 className="text-[32px] font-bold text-nikou-dark text-right mb-4">پاسخ بعضی سؤال‌ها، همین‌جاست.</h2>
          
          {[
            { q: "نیکو وجه معامله را دریافت می‌کند؟", a: "خیر. در فاز نخست نیکو وجه کاربران را دریافت نمی‌کند و پرداخت‌ها مستقیماً بین خریدار و فروشنده انجام می‌شود." },
            { q: "تأیید شماره تماس یعنی احراز هویت رسمی؟", a: "خیر. تأیید راه تماس با احراز رسمی هویت متفاوت است. احراز هویت رسمی (تیک آبی) نشان‌دهنده بررسی مدارک است." },
            { q: "برای شروع باید خریدار یا فروشنده ثبت‌نام کنم؟", a: "یک حساب برای هر دو نقش کافی است. استفاده پایه رایگان است و می‌توانید هم خرید کنید و هم کالای خود را عرضه کنید." }
          ].map((faq, i) => (
            <div key={i} className="bg-[#FFFEFA] p-6 rounded-lg border border-[#DCDDD2] flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-nikou-green" />
                <h3 className="text-[20px] font-semibold text-nikou-dark">{faq.q}</h3>
              </div>
              <p className="text-[17px] text-[#59675E] leading-relaxed mr-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ۴. شفافیت در ارتباط */}
      <section className="py-16 w-full bg-nikou-cream">
        <div className="max-w-[1440px] mx-auto px-16">
          <div className="bg-[#E5EDE3] rounded-2xl p-8 flex flex-col items-start gap-3">
            <h2 className="text-[28px] font-bold text-nikou-dark">پیام روشن، ارتباط بهتر.</h2>
            <p className="text-[18px] text-[#59675E]">برای پرسش‌های مربوط به یک آگهی، عنوان و مشخصات آن را در پیام ذکر کنید تا سریع‌تر راهنمایی شوید.</p>
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