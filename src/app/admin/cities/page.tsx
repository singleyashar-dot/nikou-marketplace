"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Package, ShieldCheck, 
  LogOut, Plus, Trash2, MapPin, Layers, AlertCircle 
} from "lucide-react";

export default function AdminCitiesPage() {
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCityName, setNewCityName] = useState("");
  const [message, setMessage] = useState("");

  const fetchCities = () => {
    setIsLoading(true);
    fetch('/api/admin/cities', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCities(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    setMessage("");

    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCityName })
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ منطقه جدید با موفقیت اضافه شد.");
        setNewCityName("");
        fetchCities();
      } else {
        setMessage("❌ " + (data.error || "خطا در ثبت منطقه"));
      }
    } catch (error) {
      setMessage("❌ خطا در ارتباط با سرور");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این منطقه اطمینان دارید؟")) return;
    setMessage("");

    try {
      const res = await fetch(`/api/admin/cities?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage("✅ منطقه با موفقیت حذف شد.");
        setCities(cities.filter(c => c.id !== id));
      } else {
        setMessage("❌ خطا در حذف منطقه");
      }
    } catch (error) {
      setMessage("❌ خطا در ارتباط با سرور");
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/'); };

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
          <Link href="/admin/cities" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <MapPin size={20} className="text-nikou-green" /><span className="font-semibold text-sm">مدیریت مناطق</span>
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <MapPin size={24} className="text-nikou-green" />مدیریت مناطق
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
            <input 
              type="text" 
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="نام منطقه جدید را وارد کنید..."
              className="flex-1 w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]"
            />
            <button 
              onClick={handleAddCity}
              className="bg-nikou-green text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shrink-0 w-full md:w-auto"
            >
              <Plus size={18} /> افزودن
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {message.includes('✅') ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
              {message}
            </div>
          )}

          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center text-nikou-textMuted">در حال دریافت لیست...</div>
            ) : cities.length === 0 ? (
              <div className="p-10 text-center text-nikou-textMuted flex flex-col items-center gap-3">
                <MapPin size={48} className="text-nikou-green opacity-20" />
                <p>هیچ منطقه‌ای یافت نشد.</p>
              </div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-[#F5F2EA] border-b border-[#DCDDD2] text-nikou-textMuted text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">نام منطقه</th>
                    <th className="px-6 py-4 font-medium text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD2]">
                  {cities.map((city) => (
                    <tr key={city.id} className="hover:bg-[#F5F2EA]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-nikou-dark text-sm">{city.name}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDelete(city.id)}
                          className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold"
                        >
                          <Trash2 size={14} /> حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}