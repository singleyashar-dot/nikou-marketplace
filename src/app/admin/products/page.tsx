"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Package, ShieldCheck, 
  LogOut, Search, Trash2, Image as ImageIcon 
} from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/products', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کالا اطمینان دارید؟")) return;
    
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json(); // خواندن پاسخ سرور
      
      if (res.ok) {
        // اگر سرور تایید کرد، از لیست صفحه حذف می‌شود
        setProducts(products.filter(p => p.id !== id));
      } else {
        // اگر کالا سفارش داشت، خطای دقیق بک‌اند را نشان می‌دهد
        alert(data.error || "خطا در حذف کالا");
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    }
  };

  const handleLogout = () => { 
    localStorage.clear(); 
    router.push('/'); 
  };

  const filteredProducts = products.filter(product => 
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.seller?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <BarChart3 size={20} /><span className="text-sm">داشبورد آمار</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <Users size={20} /><span className="text-sm">مدیریت کاربران</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <Package size={20} className="text-nikou-green" /><span className="font-semibold text-sm">مدیریت کالاها</span>
          </Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <ShieldCheck size={20} /><span className="text-sm">تاییدیه‌ها</span>
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
        
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <Package size={24} className="text-nikou-green" />مدیریت کالاها
          </h1>
          
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="جستجوی نام کالا یا ایمیل فروشنده..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-nikou-cream rounded-xl border border-[#DCDDD2] outline-none focus:border-nikou-green transition-all"
            />
            <Search size={18} className="absolute left-3 top-3 text-nikou-textMuted" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            
            {isLoading ? (
              <div className="p-10 text-center text-nikou-textMuted">در حال دریافت لیست کالاها...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-10 text-center text-nikou-textMuted flex flex-col items-center gap-3">
                <Package size={48} className="text-nikou-green opacity-20" />
                <p>هیچ کالایی با این مشخصات یافت نشد.</p>
              </div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-nikou-cream border-b border-[#DCDDD2] text-nikou-textMuted text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">کالا</th>
                    <th className="px-6 py-4 font-medium">قیمت</th>
                    <th className="px-6 py-4 font-medium">فروشنده</th>
                    <th className="px-6 py-4 font-medium">موجودی</th>
                    <th className="px-6 py-4 font-medium text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD2]">
                  {filteredProducts.map((product) => {
                    const mediaUrl = product.media && product.media.length > 0 ? product.media[0].url : null;

                    return (
                      <tr key={product.id} className="hover:bg-nikou-cream/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg border border-[#DCDDD2] flex items-center justify-center overflow-hidden shrink-0">
                              {mediaUrl ? (
                                <img src={mediaUrl} alt={product.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={20} className="text-nikou-textMuted" />
                              )}
                            </div>
                            <span className="font-bold text-nikou-dark text-sm truncate max-w-50">
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-nikou-dark">
                          {product.price?.toLocaleString('fa-IR')} {product.currency || 'تومان'}
                        </td>
                        <td className="px-6 py-4 text-sm text-nikou-textMuted">
                          {product.seller?.email || "نامشخص"}
                        </td>
                        <td className="px-6 py-4 text-sm text-nikou-textMuted">
                          {product.stockQuantity || 0} عدد
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold"
                          >
                            <Trash2 size={14} />
                            حذف
                          </button>
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