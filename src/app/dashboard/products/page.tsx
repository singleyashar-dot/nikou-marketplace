"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, Plus, Trash2, 
  Image as ImageIcon, Pencil, UserCircle, ClipboardList
} from "lucide-react";

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
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

    fetch('/api/products', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const myProducts = data.filter((p: any) => p.sellerId === id);
          setProducts(myProducts);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کالا اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "خطا در حذف کالا. ممکن است سفارش ثبت شده باشد.");
      }
    } catch (error) {
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
          <Link href="/dashboard/products" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <Package size={20} className="text-nikou-green" /><span className="font-semibold text-sm">مدیریت کالاها</span>
          </Link>
          <Link href="/dashboard/verification" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ShieldCheck size={20} /><span className="text-sm">احراز هویت</span>
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ShoppingCart size={20} /><span className="text-sm">سفارشات دریافتی</span>
          </Link>
          <Link href="/dashboard/requests" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ClipboardList size={20} /><span className="text-sm">درخواست‌های بازار</span>
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
            <Package size={24} className="text-nikou-green" />مدیریت کالاها
          </h1>
          <Link href="/dashboard/products/new" className="bg-nikou-green text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md">
            <Plus size={18} /> ثبت کالای جدید
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center text-nikou-textMuted">در حال دریافت لیست کالاها...</div>
            ) : products.length === 0 ? (
              <div className="p-10 text-center text-nikou-textMuted flex flex-col items-center gap-3">
                <Package size={48} className="text-nikou-green opacity-20" />
                <p>شما هنوز هیچ کالایی ثبت نکرده‌اید.</p>
                <Link href="/dashboard/products/new" className="text-nikou-green font-bold text-sm mt-2 hover:underline">همین حالا اولین کالا را ثبت کنید</Link>
              </div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-[#F5F2EA] border-b border-[#DCDDD2] text-nikou-textMuted text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">کالا</th>
                    <th className="px-6 py-4 font-medium">دسته‌بندی</th>
                    <th className="px-6 py-4 font-medium">قیمت</th>
                    <th className="px-6 py-4 font-medium">موجودی</th>
                    <th className="px-6 py-4 font-medium text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD2]">
                  {products.map((p) => {
                    const mediaUrl = p.media && p.media.length > 0 ? p.media[0].url : null;
                    return (
                      <tr key={p.id} className="hover:bg-[#F5F2EA]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg border border-[#DCDDD2] flex items-center justify-center overflow-hidden shrink-0">
                              {mediaUrl ? (
                                <img src={mediaUrl} alt={p.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={20} className="text-nikou-textMuted" />
                              )}
                            </div>
                            <span className="font-bold text-nikou-dark text-sm truncate max-w-[200px]">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-nikou-textMuted">
                          {p.category?.title || 'عمومی'}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-nikou-dark">
                          {p.price?.toLocaleString('fa-IR')} تومان
                        </td>
                        <td className="px-6 py-4 text-sm text-nikou-textMuted">
                          {p.stockQuantity} {p.unit || 'عدد'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link 
                              href={`/dashboard/products/edit/${p.id}`}
                              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold"
                            >
                              <Pencil size={14} /> ویرایش
                            </Link>
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold"
                            >
                              <Trash2 size={14} /> حذف
                            </button>
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