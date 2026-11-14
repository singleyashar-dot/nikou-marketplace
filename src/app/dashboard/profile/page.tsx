"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, Camera, Save, 
  CheckCircle2, AlertCircle, ClipboardList, UserCircle,
  Crown, Sparkles
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  
  const [plan, setPlan] = useState("FREE");
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const userRole = localStorage.getItem('nikou_user_role');
    
    if (!id) {
      router.push('/login');
      return;
    }
    
    setUserId(id);
    setRole(userRole || 'BUYER');

    fetch(`/api/profile?userId=${id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setDisplayName(data.displayName || "");
          setCity(data.city || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatarUrl || "");
          setIsVerified(data.isVerified || false);
          setImagePreview(data.avatarUrl || null);
          setPlan(data.plan || "FREE");
          setPlanExpiresAt(data.planExpiresAt);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      let finalAvatarUrl = avatarUrl;
      if (imageFile) {
        setMessage("در حال آپلود عکس...");
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          finalAvatarUrl = uploadData.url;
          setAvatarUrl(finalAvatarUrl);
        } else {
          throw new Error("خطا در آپلود عکس");
        }
      }

      setMessage("در حال ذخیره اطلاعات...");
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          displayName,
          phone,
          city,
          bio,
          avatarUrl: finalAvatarUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ اطلاعات پروفایل با موفقیت ذخیره شد.");
      } else {
        setMessage("❌ " + (data.error || "خطا در ذخیره اطلاعات"));
      }
    } catch (error: any) {
      setMessage("❌ " + (error.message || "خطا در ارتباط با سرور"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const switchRole = async () => {
    const currentRole = localStorage.getItem('nikou_user_role') || 'BUYER';
    const nextRole = currentRole === 'SELLER' ? 'BUYER' : 'SELLER';
    
    if (userId) {
      await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: nextRole })
      });
      localStorage.setItem('nikou_user_role', nextRole);
      window.location.reload(); 
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-nikou-textMuted bg-nikou-cream">در حال بارگذاری...</div>;

  return (
    <div className="flex h-screen bg-nikou-cream font-sans" dir="rtl">
      
      {/* سایدبار */}
      <aside className="w-64 bg-nikou-dark text-white flex flex-col shadow-2xl z-20 hidden md:flex shrink-0">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[20px] font-medium tracking-[2px] text-white">NIKOU</span>
            <div className="w-px h-5 bg-nikou-green"></div>
            <span className="text-[28px] font-extrabold text-white leading-none mt-1">نیکو</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <BarChart3 size={20} /><span className="text-sm">داشبورد</span>
          </Link>
          {role === 'SELLER' && (
            <>
              <Link href="/dashboard/products" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
                <Package size={20} /><span className="text-sm">مدیریت کالاها</span>
              </Link>
              <Link href="/dashboard/verification" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
                <ShieldCheck size={20} /><span className="text-sm">احراز هویت</span>
              </Link>
            </>
          )}
          <Link href="/dashboard/orders" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ShoppingCart size={20} /><span className="text-sm">{role === 'SELLER' ? 'سفارشات دریافتی' : 'سفارشات من'}</span>
          </Link>
          <Link href="/dashboard/requests" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ClipboardList size={20} /><span className="text-sm">{role === 'SELLER' ? 'درخواست‌های بازار' : 'درخواست‌های خرید من'}</span>
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <MessageSquare size={20} /><span className="text-sm">پیام‌ها</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <UserCircle size={20} className="text-nikou-green" /><span className="font-semibold text-sm">پروفایل من</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="w-10 h-10 bg-nikou-green rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={20} />}
            </div>
            <div>
              <p className="text-sm font-bold flex items-center gap-1">
                {displayName || 'کاربر نیکو'}
                {isVerified && <span className="text-blue-400 text-xs">✔️</span>}
              </p>
              <p className="text-xs text-nikou-textLight mt-1">{role === 'SELLER' ? 'فروشنده' : 'خریدار'}</p>
            </div>
          </div>

          <button onClick={switchRole} className="flex items-center justify-center gap-2 w-full bg-nikou-green hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl transition-all font-semibold text-xs">
            <RefreshCw size={14} /><span>{role === 'SELLER' ? "ورود به پنل خریدار" : "ورود به پنل فروشنده"}</span>
          </button>
          
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl transition-all font-medium text-xs">
            <LogOut size={14} /><span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* بخش اصلی */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <UserCircle size={24} className="text-nikou-green" />
            پروفایل من
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* 👈 عرض کلی فرم کمتر شد تا متمرکزتر باشه (max-w-3xl) */}
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            
            {/* 👈 کارت وضعیت اشتراک (فشرده‌تر و مینیمال‌تر) */}
            <div className={`rounded-2xl border p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden ${plan === 'PRO' ? 'bg-nikou-dark border-nikou-green/30 text-white' : 'bg-[#FFFEFA] border-[#DCDDD2]'}`}>
              {plan === 'PRO' && <div className="absolute top-0 right-0 w-64 h-64 bg-nikou-green rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>}
              
              <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${plan === 'PRO' ? 'bg-nikou-green/20 text-nikou-greenLight' : 'bg-[#F5F2EA] text-nikou-textMuted'}`}>
                  {plan === 'PRO' ? <Crown size={28} /> : <User size={28} />}
                </div>
                <div>
                  <h2 className={`text-[18px] font-bold flex items-center gap-2 ${plan === 'PRO' ? 'text-white' : 'text-nikou-dark'}`}>
                    پلن فعلی: {plan === 'PRO' ? 'حرفه‌ای' : 'پایه (رایگان)'}
                    {plan === 'PRO' && <Sparkles size={16} className="text-nikou-greenLight" />}
                  </h2>
                  {plan === 'PRO' && planExpiresAt && (
                    <p className="text-[13px] text-[#BCCFC2] mt-1">اعتبار تا: {new Date(planExpiresAt).toLocaleDateString('fa-IR')}</p>
                  )}
                  {plan === 'FREE' && <p className="text-[13px] text-nikou-textMuted mt-1">برای رشد سریع‌تر، پلن خود را ارتقا دهید.</p>}
                </div>
              </div>

              <div className="relative z-10 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                {plan === 'FREE' ? (
                  <Link href="/pricing" className="w-full md:w-auto bg-nikou-green text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Crown size={16} /> ارتقا به حرفه‌ای
                  </Link>
                ) : (
                  <Link href="/pricing" className="w-full md:w-auto bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-all flex items-center justify-center">
                    تمدید اشتراک
                  </Link>
                )}
              </div>
            </div>

            {/* فرم اطلاعات */}
            <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm p-6 md:p-8">
              <form onSubmit={handleSave} className="flex flex-col gap-6">
                
                {/* 👈 بخش آواتار (کوچیک‌تر و فشرده‌تر) */}
                <div className="flex flex-col items-center gap-3 border-b border-[#DCDDD2] pb-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#E8EFE6] bg-[#F5F2EA] flex items-center justify-center group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={36} className="text-nikou-green opacity-50" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={20} className="text-white" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[13px] text-nikou-textMuted font-medium">برای تغییر عکس، روی آن کلیک کنید</p>
                </div>

                {/* 👈 فیلدها (ارتفاع کمتر و فاصله بهینه) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nikou-dark">ایمیل (غیرقابل تغییر)</label>
                    <input type="email" disabled value={email} className="w-full py-3 px-4 rounded-xl border border-[#DCDDD2] text-[14px] bg-gray-100 text-gray-500 cursor-not-allowed" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nikou-dark">شماره تماس *</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="مثلاً: 09123456789" className="w-full py-3 px-4 rounded-xl border border-[#DCDDD2] text-[14px] focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nikou-dark">نام نمایشی (نام و نام خانوادگی) *</label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="مثلاً: علی رضایی" className="w-full py-3 px-4 rounded-xl border border-[#DCDDD2] text-[14px] focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-nikou-dark">شهر</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="مثلاً: تهران" className="w-full py-3 px-4 rounded-xl border border-[#DCDDD2] text-[14px] focus:outline-none focus:border-nikou-green bg-[#F5F2EA]" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-nikou-dark">درباره من / بیوگرافی</label>
                  <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="کمی از خودتان یا کسب‌وکارتان بنویسید..." className="w-full py-3 px-4 rounded-xl border border-[#DCDDD2] text-[14px] focus:outline-none focus:border-nikou-green resize-none bg-[#F5F2EA]"></textarea>
                </div>

                {message && (
                  <div className={`p-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {message.includes('✅') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {message}
                  </div>
                )}

                <button type="submit" disabled={isSaving} className="w-full md:w-auto self-end bg-nikou-green text-white font-semibold text-[15px] py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                  {isSaving ? "در حال ذخیره..." : (<><span>ذخیره تغییرات</span><Save size={16} /></>)}
                </button>

              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}