"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Package, ShieldCheck, Layers, MapPin,
  LogOut, Settings, Save, CheckCircle2, AlertCircle, UploadCloud,
  Crown, Star
} from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // 👈 استیت‌های تنظیمات (شامل محدودیت پلن‌ها)
  const [settings, setSettings] = useState({
    siteName: "NIKOU",
    siteNameFa: "نیکو",
    footerText: "تمامی حقوق مادی و معنوی این سایت متعلق به بازارگاه نیکو می‌باشد. © ۱۴۰۳",
    
    heroTitle: "بازارگاه جامع تجارت",
    heroTitleHighlight: "برای رشد کسب‌وکار شما",
    heroSubtitle: "اتصال امن خریداران و فروشندگان در بزرگترین انبار مجازی. تجربه‌ای متفاوت از معامله عمده با تضمین کیفیت و امنیت.",
    
    contactPhone: "۰۲۱-۱۲۳۴۵۶۷۸",
    contactEmail: "info@nikou.com",
    contactAddress: "تهران، خیابان ولیعصر، برج نیکو",

    // 👈 محدودیت‌های پلن (به صورت رشته ذخیره می‌شوند)
    limit_free: "5",
    limit_pro: "50",
    limit_enterprise: "1000", 
  });

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setMessage("✅ تنظیمات با موفقیت ذخیره شد.");
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

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-nikou-cream text-nikou-textMuted">در حال دریافت تنظیمات...</div>;

  return (
    <div className="flex h-screen bg-nikou-cream font-sans" dir="rtl">
      
      <aside className="w-64 bg-nikou-dark text-white flex flex-col shadow-2xl z-20 hidden md:flex shrink-0">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[16px] font-medium text-white/70">ADMIN</span>
            <div className="w-px h-5 bg-nikou-green"></div>
            <span className="text-[24px] font-extrabold text-white">نیکو</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
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
            <MapPin size={20} /><span className="text-sm">مدیریت شهرها</span>
          </Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <ShieldCheck size={20} /><span className="text-sm">تاییدیه‌ها</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <Settings size={20} className="text-nikou-green" /><span className="font-semibold text-sm">تنظیمات سایت</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl transition-all font-medium text-xs">
            <LogOut size={14} />خروج از حساب
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <Settings size={24} className="text-nikou-green" />تنظیمات سایت
          </h1>
          <div className="text-sm text-nikou-textMuted bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-100 font-bold flex items-center gap-2">
            <ShieldCheck size={16} /> دسترسی سطح بالا (مدیر کل)
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={handleSave} className="max-w-4xl mx-auto bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            
            {/* تب‌ها */}
            <div className="flex border-b border-[#DCDDD2] bg-[#F5F2EA] flex-wrap">
              <button type="button" onClick={() => setActiveTab("general")} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === "general" ? "text-nikou-green border-b-2 border-nikou-green bg-[#FFFEFA]" : "text-nikou-textMuted hover:text-nikou-dark"}`}>تنظیمات عمومی</button>
              <button type="button" onClick={() => setActiveTab("hero")} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === "hero" ? "text-nikou-green border-b-2 border-nikou-green bg-[#FFFEFA]" : "text-nikou-textMuted hover:text-nikou-dark"}`}>صفحه اصلی</button>
              <button type="button" onClick={() => setActiveTab("contact")} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === "contact" ? "text-nikou-green border-b-2 border-nikou-green bg-[#FFFEFA]" : "text-nikou-textMuted hover:text-nikou-dark"}`}>اطلاعات تماس</button>
              
              {/* 👈 تب جدید محدودیت پلن‌ها */}
              <button type="button" onClick={() => setActiveTab("limits")} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === "limits" ? "text-nikou-green border-b-2 border-nikou-green bg-[#FFFEFA]" : "text-nikou-textMuted hover:text-nikou-dark"}`}>محدودیت پلن‌ها</button>
            </div>

            <div className="p-8 flex flex-col gap-6">
              
              {activeTab === "general" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-nikou-dark">نام سایت (انگلیسی)</label>
                      <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-nikou-dark">نام سایت (فارسی)</label>
                      <input type="text" name="siteNameFa" value={settings.siteNameFa} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-nikou-dark">متن فوتر (پاورقی)</label>
                    <textarea name="footerText" value={settings.footerText} onChange={handleChange} rows={3} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green resize-none bg-[#F5F2EA]"></textarea>
                  </div>
                </>
              )}

              {activeTab === "hero" && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-nikou-dark">تیتر اصلی هدر (خط اول)</label>
                    <input type="text" name="heroTitle" value={settings.heroTitle} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-nikou-dark">تیتر مکمل (خط دوم)</label>
                    <input type="text" name="heroTitleHighlight" value={settings.heroTitleHighlight} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-nikou-dark">توضیحات زیر تیتر</label>
                    <textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} rows={3} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green resize-none bg-[#F5F2EA]"></textarea>
                  </div>
                </>
              )}

              {activeTab === "contact" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-nikou-dark">شماره تماس</label>
                    <input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-nikou-dark">ایمیل</label>
                    <input type="text" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-nikou-dark">آدرس</label>
                    <input type="text" name="contactAddress" value={settings.contactAddress} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>
                </div>
              )}

              {/* 👈 تب محدودیت پلن‌ها */}
              {activeTab === "limits" && (
                <div className="flex flex-col gap-6">
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                    در این بخش می‌توانید حداکثر تعداد کالاهایی که هر فروشنده می‌تواند در هر پلن ثبت کند را مشخص کنید. این محدودیت‌ها به عنوان اهرم تشویقی برای ارتقای پلن عمل می‌کنند.
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-nikou-dark flex items-center gap-2">
                        <Star size={16} className="text-gray-400" /> پلن پایه (بدون ستاره)
                      </label>
                      <input type="number" name="limit_free" value={settings.limit_free} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                      <span className="text-xs text-nikou-textMuted">تعداد کالاهای مجاز برای پلن رایگان</span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-nikou-dark flex items-center gap-2">
                        <Star size={16} className="text-blue-500" fill="#EFF6FF" /> پلن حرفه‌ای (ستاره آبی)
                      </label>
                      <input type="number" name="limit_pro" value={settings.limit_pro} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                      <span className="text-xs text-nikou-textMuted">تعداد کالاهای مجاز برای پلن حرفه‌ای</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-nikou-dark flex items-center gap-2">
                        <Crown size={16} className="text-amber-500" /> پلن سازمانی (ستاره طلایی)
                      </label>
                      <input type="number" name="limit_enterprise" value={settings.limit_enterprise} onChange={handleChange} className="w-full p-3 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                      <span className="text-xs text-nikou-textMuted">تعداد کالاهای مجاز برای پلن سازمانی</span>
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {message.includes('✅') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {message}
                </div>
              )}

              <div className="pt-6 border-t border-[#DCDDD2] flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-nikou-green text-white font-semibold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? "در حال ذخیره..." : (<><Save size={18} /> ذخیره تنظیمات</>)}
                </button>
              </div>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}