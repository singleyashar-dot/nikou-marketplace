"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, Users, Package, ShieldCheck, 
  LogOut, CheckCircle2, XCircle, Clock, Calendar, User
} from "lucide-react";

export default function AdminVerificationsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    fetch('/api/admin/verifications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRequests(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleAction = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setMessage(status === 'VERIFIED' ? '✅ درخواست تایید شد.' : '❌ درخواست رد شد.');
        fetchRequests(); // رفرش لیست
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="flex h-screen bg-nikou-cream font-sans" dir="rtl">
      
      {/* سایدبار ادمین */}
      <aside className="w-64 bg-nikou-dark text-white flex flex-col shadow-2xl z-20">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-nikou-green" size={28} />
            <span className="text-2xl font-black text-white tracking-wide">ADMIN</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <LayoutDashboard size={20} />
            <span className="text-sm">آمار کلی</span>
          </Link>
          
          <Link href="/admin/users" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <Users size={20} />
            <span className="text-sm">مدیریت کاربران</span>
          </Link>
          
          <Link href="/admin/products" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <Package size={20} />
            <span className="text-sm">مدیریت کالاها</span>
          </Link>
          
          <Link href="/admin/verifications" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <ShieldCheck size={20} className="text-nikou-green" />
            <span className="font-semibold text-sm">درخواست‌های احراز هویت</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl transition-all font-medium text-xs">
            <LogOut size={14} />
            <span>خروج از پنل مدیریت</span>
          </Link>
        </div>
      </aside>

      {/* بخش اصلی */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* هدر */}
        <header className="bg-[#FFFEFA] h-24 border-b border-[#DCDDD2] flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-nikou-dark">مدیریت درخواست‌های تیک آبی</h2>
        </header>

        <div className="p-10">
          
          {message && (
            <div className="mb-6 bg-[#E8EFE6] border border-nikou-green/30 text-nikou-green p-4 rounded-xl text-center font-bold">
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-nikou-textMuted">در حال بارگذاری...</div>
          ) : requests.length === 0 ? (
            <div className="bg-[#FFFEFA] border border-[#DCDDD2] p-16 rounded-2xl text-center text-nikou-textMuted shadow-sm flex flex-col items-center gap-4">
              <Clock size={48} className="text-nikou-green opacity-30" />
              <p>هیچ درخواست در انتظاری وجود ندارد.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  
                  {/* اطلاعات کاربر */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-14 h-14 bg-[#E8EFE6] rounded-xl flex items-center justify-center border border-[#DCDDD2] shrink-0">
                      <User size={28} className="text-nikou-green" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold text-nikou-dark">{req.user.email}</h3>
                      <div className="flex items-center gap-3 text-[13px] text-nikou-textMuted">
                        <span>شماره: {req.user.phone}</span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(req.createdAt).toLocaleDateString('fa-IR')}</span>
                      </div>
                    </div>
                  </div>

                  {/* دکمه‌های عملیات */}
                  <div className="flex gap-3 w-full md:w-auto border-t md:border-t-0 md:border-r border-[#DCDDD2] pt-4 md:pt-0 md:pr-6">
                    <button 
                      onClick={() => handleAction(req.id, 'VERIFIED')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-nikou-green text-white hover:bg-emerald-700 px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm"
                    >
                      <CheckCircle2 size={18} />
                      تایید هویت
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'REJECTED')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-6 py-3 rounded-xl text-sm font-bold transition-colors"
                    >
                      <XCircle size={18} />
                      رد درخواست
                    </button>
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