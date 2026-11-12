"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Users, Package, ShieldCheck, LogOut, Search, User, CheckCircle2, XCircle, Mail, Calendar } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 👈 اینجا cache: 'no-store' اضافه شد تا هر بار دیتای جدید بگیره
    fetch('/api/admin/users', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleLogout = () => { localStorage.clear(); router.push('/'); };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Link href="/admin" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl"><BarChart3 size={20} /><span className="text-sm">داشبورد آمار</span></Link>
          <Link href="/admin/users" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl"><Users size={20} className="text-nikou-green" /><span className="font-semibold text-sm">مدیریت کاربران</span></Link>
          <Link href="/admin/products" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl"><Package size={20} /><span className="text-sm">مدیریت کالاها</span></Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 px-4 py-3 rounded-xl"><ShieldCheck size={20} /><span className="text-sm">تاییدیه‌ها</span></Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 px-4 py-2.5 rounded-xl text-xs"><LogOut size={14} />خروج</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2"><Users size={24} className="text-nikou-green" />مدیریت کاربران</h1>
          <div className="relative w-72">
            <input type="text" placeholder="جستجو..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm bg-nikou-cream rounded-xl border outline-none focus:border-nikou-green" />
            <Search size={18} className="absolute left-3 top-3 text-nikou-textMuted" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? <div className="p-10 text-center">در حال بارگذاری...</div> : filteredUsers.length === 0 ? <div className="p-10 text-center">کاربری یافت نشد.</div> : (
              <table className="w-full text-right">
                <thead className="bg-nikou-cream border-b border-[#DCDDD2] text-sm">
                  <tr>
                    <th className="px-6 py-4">کاربر</th><th className="px-6 py-4">ایمیل</th><th className="px-6 py-4">نقش</th><th className="px-6 py-4">وضعیت تایید</th><th className="px-6 py-4">تاریخ عضویت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD2]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-nikou-cream/50">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E8EFE6] rounded-full flex items-center justify-center text-nikou-green font-bold">{user.name ? user.name.charAt(0) : <User size={18} />}</div>
                        <span className="font-bold text-sm">{user.name || "کاربر نیکو"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-nikou-textMuted"><Mail size={14} className="inline ml-1" />{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'SELLER' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role === 'SELLER' ? 'فروشنده' : 'خریدار'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? <span className="text-emerald-600 text-sm flex items-center gap-1"><CheckCircle2 size={16} />تایید شده</span> : <span className="text-gray-500 text-sm flex items-center gap-1"><XCircle size={16} />تایید نشده</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-nikou-textMuted"><Calendar size={14} className="inline ml-1" />{new Date(user.createdAt).toLocaleDateString('fa-IR')}</td>
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