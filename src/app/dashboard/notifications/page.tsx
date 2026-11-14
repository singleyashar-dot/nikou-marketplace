"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, ClipboardList,
  UserCircle, Bell, CheckCircle2, Clock, ArrowLeft
} from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchNotifications = (userId: string) => {
    fetch(`/api/notifications?userId=${userId}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
    setCurrentUserId(id);
    setUserRole(role);

    if (!id) { router.push('/login'); return; }

    fetch(`/api/profile?userId=${id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setIsVerified(data.isVerified || false);
          setDisplayName(data.displayName || 'کاربر نیکو');
          setAvatarUrl(data.avatarUrl || '');
        }
      }).catch(() => {});
    
    // 👈 حل مشکل: آیدی مستقیم پاس داده می‌شود
    fetchNotifications(id);
  }, [router]);

  const markAllAsRead = async () => {
    if (!currentUserId) return;
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId })
    });
    fetchNotifications(currentUserId);
  };

  const handleLogout = () => { localStorage.clear(); router.push('/'); };
  
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
          <Link href="/dashboard/notifications" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <Bell size={20} className="text-nikou-green" /><span className="font-semibold text-sm">اعلانات</span>
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <Bell size={24} className="text-nikou-green" />اعلانات
          </h1>
          <button onClick={markAllAsRead} className="text-sm text-nikou-green font-semibold hover:underline">
            خواندن همه
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {isLoading ? (
              <div className="text-center py-20 text-nikou-textMuted">در حال دریافت اعلانات...</div>
            ) : notifications.length === 0 ? (
              <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl text-center py-20 text-nikou-textMuted flex flex-col items-center gap-3">
                <Bell size={48} className="opacity-20" />
                <p>هیچ اعلانی برای شما وجود ندارد.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`p-5 rounded-xl border transition-colors flex items-start gap-4 ${n.isRead ? 'bg-[#FFFEFA] border-[#DCDDD2]' : 'bg-[#E8EFE6] border-nikou-green shadow-sm'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.isRead ? 'bg-[#F5F2EA] text-nikou-textMuted' : 'bg-nikou-green text-white'}`}>
                    {n.isRead ? <CheckCircle2 size={20} /> : <Bell size={20} />}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className={`text-sm font-bold ${n.isRead ? 'text-nikou-dark' : 'text-nikou-dark'}`}>{n.title}</h3>
                    <p className={`text-sm ${n.isRead ? 'text-nikou-textMuted' : 'text-[#59675E]'}`}>{n.message}</p>
                    <span className="text-[11px] text-nikou-textMuted mt-2 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(n.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  {n.link && (
                    <Link href={n.link} className="mt-2 text-xs font-bold text-nikou-green hover:underline flex items-center gap-1 shrink-0">
                      مشاهده <ArrowLeft size={14} />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}