"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Package, ShieldCheck, 
  LogOut, Plus, Trash2, Globe, MapPin, Layers, AlertCircle
} from "lucide-react";

export default function AdminCountriesPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  // فرم افزودن
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [flag, setFlag] = useState("");
  const [type, setType] = useState("COUNTRY");

  const fetchCountries = () => {
    setIsLoading(true);
    fetch('/api/admin/countries', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCountries(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => { fetchCountries(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    setMessage("");

    try {
      const res = await fetch('/api/admin/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, flag, type })
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ مورد جدید با موفقیت اضافه شد.");
        setName(""); setCode(""); setFlag("");
        fetchCountries();
      } else {
        setMessage("❌ " + (data.error || "خطا در ثبت"));
      }
    } catch (error) {
      setMessage("❌ خطا در ارتباط با سرور");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این مورد اطمینان دارید؟")) return;
    setMessage("");

    try {
      const res = await fetch(`/api/admin/countries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage("✅ مورد با موفقیت حذف شد.");
        setCountries(countries.filter(c => c.id !== id));
      } else {
        setMessage("❌ خطا در حذف");
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
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
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
          <Link href="/admin/cities" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <MapPin size={20} /><span className="text-sm">مدیریت مناطق</span>
          </Link>
          <Link href="/admin/countries" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <Globe size={20} className="text-nikou-green" /><span className="font-semibold text-sm">کشورها و بازارچه‌ها</span>
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl transition-colors">
            <AlertCircle size={20} /><span className="text-sm">پیام‌های تماس</span>
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
            <Globe size={24} className="text-nikou-green" />مدیریت کشورها و بازارچه‌ها
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-nikou-dark mb-4">افزودن مورد جدید</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">نام (مثلاً: عراق)</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="p-3 rounded-lg border text-sm outline-none focus:border-nikou-green" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">کد (مثل IQ)</label>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} maxLength={3} className="p-3 rounded-lg border text-sm outline-none focus:border-nikou-green" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">ایموجی/پرچم</label>
                <input type="text" value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="🇮🇶" className="p-3 rounded-lg border text-sm outline-none focus:border-nikou-green" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">نوع</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="p-3 rounded-lg border text-sm outline-none focus:border-nikou-green">
                  <option value="COUNTRY">کشور</option>
                  <option value="BORDER_MARKET">بازارچه مرزی</option>
                </select>
              </div>
              <button type="submit" className="bg-nikou-green text-white p-3 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors">
                افزودن
              </button>
            </form>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {message}
            </div>
          )}

          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center text-nikou-textMuted">در حال دریافت...</div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-[#F5F2EA] border-b border-[#DCDDD2] text-sm text-nikou-textMuted">
                  <tr>
                    <th className="px-6 py-4">نام</th>
                    <th className="px-6 py-4">کد</th>
                    <th className="px-6 py-4">نوع</th>
                    <th className="px-6 py-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD2]">
                  {countries.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F5F2EA]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm flex items-center gap-2 text-nikou-dark">
                        <span>{c.flag}</span> {c.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-nikou-textMuted font-mono">{c.code}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.type === 'COUNTRY' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                          {c.type === 'COUNTRY' ? 'کشور' : 'بازارچه مرزی'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {countries.length === 0 && (
                     <tr>
                        <td colSpan={4} className="text-center py-10 text-nikou-textMuted">هیچ موردی ثبت نشده است.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}