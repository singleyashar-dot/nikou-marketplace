"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Package, ShieldCheck, 
  LogOut, Globe, MapPin, Layers, AlertCircle, 
  Settings, Save, CheckCircle2, AlertTriangle 
} from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // استیت‌های متن‌های سایت
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaSubtitle, setCtaSubtitle] = useState("");
  const [footerAbout, setFooterAbout] = useState("");

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        // مقادیر پیش‌فرض اگر توی دیتابیس نبودن
        setHeroTitle(data.hero_title || "بازارگاه جامع تجارت <br /> برای رشد کسب‌وکار شما");
        setHeroSubtitle(data.hero_subtitle || "اتصال امن خریداران و فروشندگان در بزرگترین انبار مجازی. تجربه‌ای متفاوت از معامله عمده با تضمین کیفیت و امنیت.");
        setCtaTitle(data.cta_title || "کالای مورد نظر خود را پیدا نکردید؟");
        setCtaSubtitle(data.cta_subtitle || "درخواست خرید خود را ثبت کنید تا فروشندگان به شما پیشنهاد قیمت بدهند.");
        setFooterAbout(data.footer_about || "بازارگاه جامع تجارت نیکو، بستری امن و حرفه‌ای برای اتصال خریداران و فروشندگان عمده در سراسر کشور است. ما با ارائه ابزارهای مدرن، تجارت شما را متحول می‌کنیم.");
        
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          cta_title: ctaTitle,
          cta_subtitle: ctaSubtitle,
          footer_about: footerAbout
        })
      });

      if (res.ok) {
        setMessage("✅ متن‌های سایت با موفقیت ذخیره شدند.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ خطا در ذخیره تنظیمات");
      }
    } catch (error) {
      setMessage("❌ خطا در ارتباط با سرور");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/'); };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-nikou-cream text-nikou-textMuted">در حال بارگذاری تنظیمات...</div>;

  return (
    <div className="flex h-screen bg-nikou-cream font-sans" dir="rtl">
      
      {/* سایدبار ادمین */}
      <aside className="w-64 bg-nikou-dark text-white flex flex-col shadow-2xl z-20 hidden md:flex shrink-0">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[16px] font-medium text-white/70">ADMIN</span>
            <div className="w-px h-5 bg-nikou-green"></div>
            <span className="text-[24px] font-extrabold text-white">نیکو</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <BarChart3 size={20} /><span className="text-sm">داشبورد آمار</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <Users size={20} /><span className="text-sm">مدیریت کاربران</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <Package size={20} /><span className="text-sm">مدیریت کالاها</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <Layers size={20} /><span className="text-sm">مدیریت دسته‌بندی‌ها</span>
          </Link>
          <Link href="/admin/cities" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <MapPin size={20} /><span className="text-sm">مدیریت مناطق</span>
          </Link>
          <Link href="/admin/countries" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <Globe size={20} /><span className="text-sm">کشورها و بازارچه‌ها</span>
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <AlertCircle size={20} /><span className="text-sm">پیام‌های تماس</span>
          </Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <ShieldCheck size={20} /><span className="text-sm">تاییدیه‌ها</span>
          </Link>
          {/* 👈 لینک تنظیمات */}
          <Link href="/admin/settings" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <Settings size={20} className="text-nikou-green" /><span className="font-semibold text-sm">تنظیمات متن‌ها</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl transition-all font-medium text-xs">
            <LogOut size={14} />خروج از حساب
          </button>
        </div>
      </aside>

      {/* بخش اصلی */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <Settings size={24} className="text-nikou-green" />
            مدیریت متن‌های صفحه اصلی
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSave} className="max-w-4xl mx-auto bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm p-8 flex flex-col gap-8">
            
            {/* بخش هدر (Hero) */}
            <div className="flex flex-col gap-4 border-b border-[#DCDDD2] pb-8">
              <h2 className="text-lg font-bold text-nikou-green">بخش معرفی (هدر صفحه اصلی)</h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">عنوان اصلی</label>
                <textarea 
                  rows={2} value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green resize-none bg-[#F5F2EA]"
                ></textarea>
                <span className="text-xs text-nikou-textMuted">برای رفتن به خط بعد، از تگ &lt;br /&gt; استفاده کنید.</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">زیرعنوان (توضیحات)</label>
                <textarea 
                  rows={3} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green resize-none bg-[#F5F2EA]"
                ></textarea>
              </div>
            </div>

            {/* بخش CTA */}
            <div className="flex flex-col gap-4 border-b border-[#DCDDD2] pb-8">
              <h2 className="text-lg font-bold text-nikou-green">بخش دعوت به اقدام (نوار سبز پایین صفحه)</h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">عنوان</label>
                <input 
                  type="text" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">توضیحات</label>
                <input 
                  type="text" value={ctaSubtitle} onChange={(e) => setCtaSubtitle(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]"
                />
              </div>
            </div>

            {/* بخش فوتر */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-nikou-green">درباره ما (متن فوتر)</h2>
              
              <div className="flex flex-col gap-2">
                <textarea 
                  rows={3} value={footerAbout} onChange={(e) => setFooterAbout(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green resize-none bg-[#F5F2EA]"
                ></textarea>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {message.includes('✅') ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full md:w-auto self-end bg-nikou-green text-white font-semibold text-[16px] py-4 px-10 rounded-xl hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? "در حال ذخیره..." : (
                <>
                  ذخیره تغییرات
                  <Save size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}