"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, ClipboardList,
  UserCircle, CheckCircle2, XCircle, Clock, Check
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
    setCurrentUserId(id);
    setUserRole(role);

    if (!id) {
      router.push('/login');
      return;
    }

    fetch(`/api/profile?userId=${id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setIsVerified(data.isVerified || false);
          setDisplayName(data.displayName || 'کاربر نیکو');
          setAvatarUrl(data.avatarUrl || '');
        }
      })
      .catch(() => {});

    fetch(`/api/orders?userId=${id}&role=${role}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("خطا در تغییر وضعیت");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-bold w-fit"><Clock size={14} /> در انتظار تایید</span>;
      case 'ACCEPTED': return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold w-fit"><CheckCircle2 size={14} /> تایید شده</span>;
      case 'REJECTED': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold w-fit"><XCircle size={14} /> رد شده</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold w-fit">{status}</span>;
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
          <Link href="/dashboard/orders" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <ShoppingCart size={20} className="text-nikou-green" /><span className="font-semibold text-sm">{userRole === 'SELLER' ? 'سفارشات دریافتی' : 'سفارشات من'}</span>
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
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <ShoppingCart size={24} className="text-nikou-green" />
            {userRole === 'SELLER' ? 'سفارشات دریافتی' : 'سفارشات من'}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center text-nikou-textMuted">در حال دریافت سفارشات...</div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center text-nikou-textMuted flex flex-col items-center gap-3">
                <ShoppingCart size={48} className="text-nikou-green opacity-20" />
                <p>هیچ سفارشی یافت نشد.</p>
              </div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-[#F5F2EA] border-b border-[#DCDDD2] text-nikou-textMuted text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">کالا</th>
                    <th className="px-6 py-4 font-medium">مقدار</th>
                    <th className="px-6 py-4 font-medium">طرف مقابل</th>
                    <th className="px-6 py-4 font-medium">وضعیت</th>
                    <th className="px-6 py-4 font-medium text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD2]">
                  {orders.map((o) => {
                    const listing = o.items?.[0]?.listing;
                    const mediaUrl = listing?.media?.[0]?.url;
                    const otherPartyEmail = userRole === 'SELLER' ? o.buyer?.email : o.seller?.email;
                    
                    return (
                      <tr key={o.id} className="hover:bg-[#F5F2EA]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg border border-[#DCDDD2] flex items-center justify-center overflow-hidden shrink-0">
                              {mediaUrl ? <img src={mediaUrl} alt={listing?.title} className="w-full h-full object-cover" /> : <Package size={20} className="text-nikou-textMuted" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-nikou-dark text-sm truncate max-w-[200px]">{listing?.title || "کالا"}</span>
                              <span className="text-[11px] text-nikou-textMuted mt-1">#{o.id.slice(0, 6)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-nikou-dark">
                          {o.items?.[0]?.quantity} {o.snapshotUnit}
                        </td>
                        <td className="px-6 py-4 text-sm text-nikou-textMuted">
                          {otherPartyEmail || "نامشخص"}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(o.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {userRole === 'SELLER' && o.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(o.id, 'ACCEPTED')}
                                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                                >
                                  <Check size={14} /> تایید
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(o.id, 'REJECTED')}
                                  className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                                >
                                  <XCircle size={14} /> رد
                                </button>
                              </>
                            )}
                            <Link 
                              href="/dashboard/messages"
                              className="bg-[#F5F2EA] text-nikou-dark border border-[#DCDDD2] hover:bg-nikou-green hover:text-white hover:border-nikou-green px-3 py-2 rounded-lg transition-colors text-xs font-bold"
                            >
                              گفتگو
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}