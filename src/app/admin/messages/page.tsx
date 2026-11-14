"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Package, ShieldCheck, 
  LogOut, Layers, MapPin, MessageSquare, 
  Mail, CheckCircle2, Clock, Trash2, Send, User
} from "lucide-react";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchMessages = () => {
    setIsLoading(true);
    fetch('/api/contact', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        else setErrorMsg("داده‌های دریافتی معتبر نیست.");
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMsg("خطا در دریافت پیام‌ها.");
        setIsLoading(false);
      });
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkAsRead = async (id: string) => {
    await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchMessages();
  };

  // 👈 تابع حذف پیام
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این پیام اطمینان دارید؟")) return;
    
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        setSelectedMsg(null); // بستن مودال اگر باز باشد
      } else {
        alert("خطا در حذف پیام");
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
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
          <Link href="/admin/messages" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <MessageSquare size={20} className="text-nikou-green" /><span className="font-semibold text-sm">پیام‌های تماس</span>
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
            <MessageSquare size={24} className="text-nikou-green" />پیام‌های فرم تماس
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center text-nikou-textMuted">در حال دریافت پیام‌ها...</div>
            ) : errorMsg ? (
              <div className="p-10 text-center text-red-500 font-bold">{errorMsg}</div>
            ) : messages.length === 0 ? (
              <div className="p-10 text-center text-nikou-textMuted flex flex-col items-center gap-3">
                <MessageSquare size={48} className="text-nikou-green opacity-20" />
                <p>هیچ پیامی دریافت نشده است.</p>
              </div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-[#F5F2EA] border-b border-[#DCDDD2] text-nikou-textMuted text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">وضعیت</th>
                    <th className="px-6 py-4 font-medium">عنوان</th>
                    <th className="px-6 py-4 font-medium">فرستنده</th>
                    <th className="px-6 py-4 font-medium">موضوع</th>
                    <th className="px-6 py-4 font-medium">تاریخ</th>
                    <th className="px-6 py-4 font-medium text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD2]">
                  {messages.map((msg) => (
                    <tr key={msg.id} className={`hover:bg-[#F5F2EA]/50 transition-colors ${!msg.isRead ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        {msg.isRead ? (
                          <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 size={14} /> خوانده شده</span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-600 text-xs font-bold"><Clock size={14} /> جدید</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-nikou-dark text-sm">{msg.title}</td>
                      <td className="px-6 py-4 text-sm text-nikou-textMuted">
                        <div className="flex flex-col">
                          {/* 👈 نمایش واضح‌تر نام */}
                          <span className="font-semibold text-nikou-dark flex items-center gap-1"><User size={12}/> {msg.name || 'بدون نام'}</span>
                          <span className="text-[11px] mt-1">{msg.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-nikou-textMuted">{msg.topic || '-'}</td>
                      <td className="px-6 py-4 text-xs text-nikou-textMuted">{new Date(msg.createdAt).toLocaleDateString('fa-IR')}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedMsg(msg); if (!msg.isRead) handleMarkAsRead(msg.id); }} className="inline-flex items-center gap-1.5 bg-[#E8EFE6] text-nikou-green hover:bg-nikou-green hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold">
                            <Mail size={14} /> مشاهده
                          </button>
                          <button onClick={() => handleDelete(msg.id)} className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold">
                            <Trash2 size={14} /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* مودال مشاهده و پاسخ پیام */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setSelectedMsg(null)} className="absolute top-4 left-4 text-nikou-textMuted hover:text-red-500 text-2xl">×</button>
            
            <h2 className="text-xl font-bold text-nikou-dark mb-4">{selectedMsg.title}</h2>
            
            <div className="bg-[#F5F2EA] p-4 rounded-xl mb-4">
              <p className="text-sm text-nikou-textMuted mb-2 flex items-center gap-1"><strong>فرستنده:</strong> <User size={14} /> {selectedMsg.name || 'بدون نام'}</p>
              <p className="text-sm text-nikou-textMuted mb-2"><strong>راه تماس:</strong> <span dir="ltr">{selectedMsg.email}</span></p>
              <p className="text-sm text-nikou-textMuted"><strong>موضوع:</strong> {selectedMsg.topic || 'نامشخص'}</p>
            </div>

            <div className="bg-[#FFFEFA] border border-[#DCDDD2] p-4 rounded-xl text-sm text-nikou-dark leading-relaxed mb-6 whitespace-pre-wrap">
              {selectedMsg.message}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => handleDelete(selectedMsg.id)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-semibold transition-colors text-sm">
                <Trash2 size={16} /> حذف پیام
              </button>
              
              {/* 👈 دکمه پاسخ از طریق ایمیل (mailto) */}
              <a 
                href={`mailto:${selectedMsg.email}?subject=پاسخ به پیام شما در نیکو: ${selectedMsg.title}`}
                className="flex items-center gap-2 px-6 py-2 bg-nikou-green text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
              >
                <Send size={16} /> پاسخ از طریق ایمیل
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}