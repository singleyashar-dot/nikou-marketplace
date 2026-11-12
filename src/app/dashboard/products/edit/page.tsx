"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // خواندن کالاها هنگام لود صفحه
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // تابع حذف کالا
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کالا مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("خطا در حذف کالا");
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans" dir="rtl">
      
      {/* سایدبار */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="h-20 flex items-center justify-center border-b border-slate-800">
          <h1 className="text-2xl font-black tracking-widest text-emerald-400">
            NIKOU
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 px-4 py-3 rounded-xl transition-colors">
            <span className="text-xl">📊</span>
            <span>داشبورد</span>
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 bg-emerald-600/20 text-emerald-400 px-4 py-3 rounded-xl cursor-pointer">
            <span className="text-xl">📦</span>
            <span className="font-bold">مدیریت کالاها</span>
          </Link>
          <Link href="/dashboard/requests" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 px-4 py-3 rounded-xl transition-colors">
            <span className="text-xl">📑</span>
            <span>درخواست‌های خرید</span>
          </Link>
          <div className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 px-4 py-3 rounded-xl cursor-pointer transition-colors">
            <span className="text-xl">💬</span>
            <span>پیام‌ها</span>
          </div>
        </nav>
      </aside>

      {/* بخش اصلی */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* هدر */}
        <header className="bg-white h-20 shadow-sm flex items-center justify-between px-8 sticky top-0 z-0">
          <h2 className="text-xl font-bold text-slate-800">لیست کالاهای انبار</h2>
          <Link href="/dashboard/products/new" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md shadow-emerald-600/20">
            + افزودن کالای جدید
          </Link>
        </header>

        {/* لیست کالاها */}
        <div className="p-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-slate-500">در حال بارگذاری...</div>
          ) : products.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
              هنوز هیچ کالایی ثبت نکرده‌اید.
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex justify-between items-center">
                  
                  {/* بخش راست: عکس و اطلاعات */}
                  <div className="flex items-center gap-6">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="w-24 h-24 object-cover rounded-xl border border-slate-200" />
                    ) : (
                      <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm border border-slate-200">
                        بدون عکس
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{p.title}</h3>
                      <p className="text-sm text-slate-500 mt-2">موجودی: {p.stock} عدد</p>
                      <p className="text-xs text-slate-400 mt-1">دسته‌بندی: {p.category === 'food' ? 'مواد غذایی' : p.category}</p>
                    </div>
                  </div>

                  {/* بخش چپ: قیمت و دکمه‌های ویرایش و حذف */}
                  <div className="flex flex-col items-end gap-4">
                    <p className="text-2xl font-black text-emerald-600">
                      {p.price.toLocaleString()} {p.currency === 'IRR' ? 'تومان' : p.currency}
                    </p>
                    
                    <div className="flex gap-2">
                      {/* دکمه ویرایش */}
                      <Link 
                        href={`/dashboard/products/edit?id=${p.id}`}
                        className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm border border-blue-200"
                      >
                        ✏️ ویرایش
                      </Link>

                      {/* دکمه حذف */}
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm border border-red-200"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}