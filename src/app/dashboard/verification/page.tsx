"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, CheckCircle2, 
  Clock, AlertCircle
} from "lucide-react";

export default function VerificationPage() {
  const router = useRouter();
  const [isRequesting, setIsRequesting] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const currentRole = localStorage.getItem('nikou_user_role');
    const currentId = localStorage.getItem('nikou_user_id');
    setRole(currentRole || "");
    setUserId(currentId || "");

    if (currentId) {
      fetch(`/api/profile?userId=${currentId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.isVerified) {
            setIsVerified(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleRequest = async () => {
    setIsRequesting(true);
    setMessage("");
    
    if (!userId) {
      setMessage("❌ خطا: لطفا ابتدا وارد شوید.");
      setIsRequesting(false);
      return;
    }

    try {
      const res = await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ " + data.message);
        setIsPending(true);
      } else {
        // نمایش دقیق خطای بک‌اند
        setMessage("❌ " + (data.error || "خطا در ثبت درخواست"));
        if (data.error && data.error.includes("قبلاً")) setIsPending(true);
      }
    } catch (error) {
      setMessage("❌ خطا در ارتباط با سرور.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const switchRole = async () => {
    const currentRole = localStorage.getItem('nikou_user_role') || 'BUYER';
    const nextRole = currentRole === 'SELLER' ? 'BUYER' : 'SELLER';
    const currentId = localStorage.getItem('nikou_user_id');

    if (currentId) {
      await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentId, role: nextRole })
      });
      localStorage.setItem('nikou_user_role', nextRole);
      window.location.reload(); 
    }
  };

  return (
    <div className="flex h-screen bg-nikou-cream font-sans" dir="rtl">
      
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
              <Link href="/dashboard/verification" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
                <ShieldCheck size={20} className="text-nikou-green" /><span className="font-semibold text-sm">احراز هویت</span>
              </Link>
            </>
          )}
          <Link href="/dashboard/orders" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ShoppingCart size={20} /><span className="text-sm">{role === 'SELLER' ? 'سفارشات دریافتی' : 'سفارشات من'}</span>
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <MessageSquare size={20} /><span className="text-sm">پیام‌ها</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="w-10 h-10 bg-nikou-green rounded-full flex items-center justify-center font-bold text-white shrink-0">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold flex items-center gap-1">
                کاربر نیکو
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

      <main className="flex-1 flex flex-col overflow-y-auto p-10">
        <div className="max-w-3xl mx-auto w-full mt-10">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-3xl p-10 shadow-sm flex flex-col items-center text-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nikou-greenLight rounded-full blur-3xl opacity-50 -z-10"></div>

            <div className="w-24 h-24 bg-[#E8EFE6] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <ShieldCheck size={48} className="text-nikou-green" />
            </div>

            <h1 className="text-3xl font-bold text-nikou-dark">دریافت نشان تایید (تیک آبی)</h1>
            <p className="text-nikou-textMuted text-lg max-w-lg leading-relaxed">
              با تایید هویت، اعتماد خریداران را جلب کنید و امکان انجام معاملات بزرگ‌تر را به دست آورید.
            </p>

            <div className="w-full h-px bg-[#DCDDD2] my-4"></div>

            {isVerified ? (
              <div className="w-full bg-[#E8EFE6] border border-nikou-green/30 p-6 rounded-2xl flex flex-col items-center gap-2">
                <CheckCircle2 size={40} className="text-nikou-green mb-2" />
                <h3 className="text-xl font-bold text-nikou-green">هویت شما تایید شده است!</h3>
                <p className="text-sm text-nikou-dark">شما هم‌اکنون دارای نشان تایید (تیک آبی) در بازارگاه نیکو هستید.</p>
              </div>
            ) : isPending ? (
              <div className="w-full bg-amber-50 border border-amber-200 p-6 rounded-2xl flex flex-col items-center gap-2">
                <Clock size={40} className="text-amber-500 mb-2" />
                <h3 className="text-xl font-bold text-amber-600">درخواست شما در حال بررسی است</h3>
                <p className="text-sm text-amber-700">درخواست احراز هویت شما ثبت شده است و پس از بررسی توسط مدیر، تایید خواهد شد.</p>
              </div>
            ) : (
              <button 
                onClick={handleRequest}
                disabled={isRequesting}
                className="w-full md:w-auto bg-nikou-green hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRequesting ? "در حال ارسال..." : "ارسال درخواست احراز هویت"}
              </button>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {message.includes('✅') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}