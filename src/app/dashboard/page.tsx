"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, ClipboardList,
  UserCircle, ArrowRight, Wallet, TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // آمار فرضی برای نمایش
  const [stats, setStats] = useState({ orders: 0, products: 0 });

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
    setUserRole(role);
    setCurrentUserId(id);

    if (!id) {
      router.push('/login');
      return;
    }

    fetch(`/api/profile?userId=${id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setIsVerified(data.isVerified || false);
          setDisplayName(data.displayName || 'کاربر نیکو');
          setAvatarUrl(data.avatarUrl || '');
        }
      })
      .catch(() => {});

    fetch(`/api/orders?userId=${id}&role=${role}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStats(prev => ({ ...prev, orders: data.length }));
      }).catch(() => {});

    if (role === 'SELLER') {
      fetch(`/api/products`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const myProducts = data.filter((p: any) => p.sellerId === id);
            setStats(prev => ({ ...prev, products: myProducts.length }));
          }
        }).catch(() => {});
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const switchRole = async () => {
    const currentRole = localStorage.getItem('nikou_user_role') || 'BUYER';
    const nextRole = currentRole === 'SELLER' ? 'BUYER' : 'SELLER';
    
    if (currentUserId) {
      await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, role: nextRole })
      });
      localStorage.setItem('nikou_user_role', nextRole);
      window.location.reload(); 
    }
  };

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
          <Link href="/dashboard" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <BarChart3 size={20} className="text-nikou-green" /><span className="font-semibold text-sm">داشبورد</span>
          </Link>
          {userRole === 'SELLER' && (
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
            <ShoppingCart size={20} /><span className="text-sm">{userRole === 'SELLER' ? 'سفارشات دریافتی' : 'سفارشات من'}</span>
          </Link>
          <Link href="/dashboard/requests" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ClipboardList size={20} /><span className="text-sm">{userRole === 'SELLER' ? 'درخواست‌های بازار' : 'درخواست‌های خرید من'}</span>
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <MessageSquare size={20} /><span className="text-sm">پیام‌ها</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <UserCircle size={20} /><span className="text-sm">پروفایل من</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="w-10 h-10 bg-nikou-green rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={20} />}
            </div>
            <div>
              <p className="text-sm font-bold flex items-center gap-1">
                {displayName}
                {userRole === 'SELLER' && isVerified && <span className="text-blue-400 text-xs">✔️</span>}
              </p>
              <p className="text-xs text-nikou-textLight mt-1">{userRole === 'SELLER' ? 'فروشنده' : 'خریدار'}</p>
            </div>
          </div>

          <button onClick={switchRole} className="flex items-center justify-center gap-2 w-full bg-nikou-green hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl transition-all font-semibold text-xs">
            <RefreshCw size={14} /><span>{userRole === 'SELLER' ? "ورود به پنل خریدار" : "ورود به پنل فروشنده"}</span>
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
            <BarChart3 size={24} className="text-nikou-green" />داشبورد {userRole === 'SELLER' ? 'فروشنده' : 'خریدار'}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-nikou-dark rounded-2xl p-8 text-white mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nikou-green rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-2 border-nikou-green/30 shrink-0 overflow-hidden backdrop-blur-sm">
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={40} className="text-nikou-green" />}
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  خوش آمدی، {displayName}!
                  {isVerified && <span className="text-blue-400 text-xl">✔️</span>}
                </h2>
                <p className="text-nikou-textLight text-sm">امیدواریم امروز روز پرباری داشته باشی.</p>
              </div>
            </div>
            <Link href="/dashboard/profile" className="relative z-10 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-sm">
              ویرایش پروفایل <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-nikou-textMuted font-medium text-sm">تعداد سفارشات</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-black text-nikou-dark">{stats.orders}</span>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1 font-bold">
                  <TrendingUp size={14} /> فعال
                </span>
              </div>
            </div>

            {userRole === 'SELLER' && (
              <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-nikou-textMuted font-medium text-sm">کالاهای من</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                    <Package size={20} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-black text-nikou-dark">{stats.products}</span>
                  <Link href="/dashboard/products" className="text-xs text-nikou-green font-bold hover:underline">مدیریت</Link>
                </div>
              </div>
            )}

            <Link href="/dashboard/profile" className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-nikou-green transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-nikou-textMuted font-medium text-sm group-hover:text-nikou-green transition-colors">تکمیل پروفایل</span>
                <div className="w-10 h-10 rounded-xl bg-[#E8EFE6] flex items-center justify-center text-nikou-green">
                  <UserCircle size={20} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nikou-textMuted">اطلاعات خود را کامل کنید</span>
                <ArrowRight size={16} className="text-nikou-textMuted group-hover:text-nikou-green transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}