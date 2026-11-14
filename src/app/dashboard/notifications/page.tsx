"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, Bell, 
  CheckCircle2, ClipboardList, Info
} from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
    setUserRole(role);

    if (!id) {
      router.push('/login');
      return;
    }

    // گرفتن وضعیت تایید
    fetch(`/api/profile?userId=${id}`).then(res => res.json()).then(data => {
      if (data && data.isVerified) setIsVerified(true);
    }).catch(() => {});

    // گرفتن اعلانات
    fetch(`/api/notifications?userId=${id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
          
          // 👈 علامت زدن همه به عنوان خوانده شده
          const hasUnread = data.some((n: any) => !n.isRead);
          if (hasUnread) {
            fetch('/api/notifications', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: id })
            });
          }
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const switchRole = async () => {
    const currentRole = localStorage.getItem('nikou_user_role') || 'BUYER';
    const nextRole = currentRole === 'SELLER' ? 'BUYER' : 'SELLER';
    const userId = localStorage.getItem('nikou_user_id');

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
          
          {/* لینک اعلانات */}
          <Link href="/dashboard/notifications" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <Bell size={20} className="text-nikou-green" /><span className="font-semibold text-sm">اعلانات</span>
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
            <Bell size={24} className="text-nikou-green" />
            اعلانات
          </h1>
          <span className="text-sm text-nikou-textMuted bg-[#F5F2EA] px-4 py-2 rounded-xl border border-[#DCDDD2]">
            {notifications.length} پیام
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            
            {isLoading ? (
              <div className="text-center py-20 text-nikou-textMuted">در حال دریافت اعلانات...</div>
            ) : notifications.length === 0 ? (
              <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl text-center py-20 text-nikou-textMuted flex flex-col items-center gap-4 shadow-sm">
                <Bell size={64} className="text-nikou-green opacity-20" />
                <p className="text-lg">هیچ اعلانی برای شما ثبت نشده است.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-nikou-green/10 flex items-center justify-center text-nikou-green shrink-0 mt-1">
                    {n.title.includes('کالا') ? <Package size={24} /> : <Info size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-nikou-dark text-[16px]">{n.title}</h3>
                      <span className="text-[11px] text-nikou-textMuted bg-[#F5F2EA] px-2 py-1 rounded-md">
                        {new Date(n.createdAt).toLocaleDateString('fa-IR')} - {new Date(n.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-nikou-textMuted mt-2 leading-relaxed">{n.message}</p>
                    
                    {n.link && (
                      <Link href={n.link} className="inline-flex items-center gap-1 mt-3 text-sm text-nikou-green font-semibold hover:underline">
                        مشاهده جزئیات
                        <CheckCircle2 size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </main>
    </div>
  );
}