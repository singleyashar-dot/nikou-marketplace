"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Users, Package, ShieldCheck, 
  ShoppingCart, LogOut, Activity, ArrowRight, 
  TrendingUp, TrendingDown, Clock, CheckCircle2,
  Layers, MapPin // 👈 آیکون شهرها اضافه شد
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, pendingVerifications: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.users !== undefined) setStats(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-nikou-cream font-sans" dir="rtl">
      
      {/* سایدبار ادمین */}
      <aside className="w-64 bg-nikou-dark text-white flex flex-col shadow-2xl z-20 hidden md:flex shrink-0">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[16px] font-medium tracking-[2px] text-white/70">ADMIN</span>
            <div className="w-px h-5 bg-nikou-green"></div>
            <span className="text-[24px] font-extrabold text-white leading-none mt-1">نیکو</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <BarChart3 size={20} className="text-nikou-green" />
            <span className="font-semibold text-sm">داشبورد آمار</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <Users size={20} />
            <span className="text-sm">مدیریت کاربران</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <Package size={20} />
            <span className="text-sm">مدیریت کالاها</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <Layers size={20} />
            <span className="text-sm">مدیریت دسته‌بندی‌ها</span>
          </Link>
          {/* 👈 لینک جدید شهرها */}
          <Link href="/admin/cities" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <MapPin size={20} />
            <span className="text-sm">مدیریت شهرها</span>
          </Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ShieldCheck size={20} />
            <span className="text-sm">تاییدیه‌های احراز هویت</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl transition-all font-medium text-xs">
            <LogOut size={14} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* بخش اصلی */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-nikou-dark">داشبورد مدیریت</h1>
            <p className="text-xs text-nikou-textMuted mt-1">خلاصه‌ای از وضعیت بازارگاه نیکو</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-nikou-textMuted bg-[#F5F2EA] px-4 py-2 rounded-xl border border-[#DCDDD2]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            وضعیت سیستم: آنلاین
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-nikou-textMuted">در حال دریافت آمار...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#FFFEFA] p-6 rounded-2xl shadow-sm border border-[#DCDDD2] flex flex-col justify-between hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-nikou-textMuted font-medium text-sm group-hover:text-nikou-dark transition-colors">کل کاربران</span>
                      <span className="text-3xl font-black text-nikou-dark mt-2">{stats.users}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <Users size={24} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-4 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                    <TrendingUp size={14} /> +۱۲٪ نسبت به ماه قبل
                  </div>
                </div>

                <div className="bg-[#FFFEFA] p-6 rounded-2xl shadow-sm border border-[#DCDDD2] flex flex-col justify-between hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-nikou-textMuted font-medium text-sm group-hover:text-nikou-dark transition-colors">کل کالاها</span>
                      <span className="text-3xl font-black text-nikou-dark mt-2">{stats.products}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <Package size={24} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-4 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                    <TrendingUp size={14} /> +۵٪ نسبت به ماه قبل
                  </div>
                </div>

                <div className="bg-[#FFFEFA] p-6 rounded-2xl shadow-sm border border-[#DCDDD2] flex flex-col justify-between hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-nikou-textMuted font-medium text-sm group-hover:text-nikou-dark transition-colors">کل سفارشات</span>
                      <span className="text-3xl font-black text-nikou-dark mt-2">{stats.orders}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                      <ShoppingCart size={24} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-red-500 text-xs font-bold mt-4 bg-red-50 w-fit px-2 py-1 rounded-md">
                    <TrendingDown size={14} /> -۲٪ نسبت به ماه قبل
                  </div>
                </div>

                <Link href="/admin/verifications" className="bg-[#FFFEFA] p-6 rounded-2xl shadow-sm border border-[#DCDDD2] flex flex-col justify-between hover:shadow-md hover:border-nikou-green transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-nikou-textMuted font-medium text-sm group-hover:text-nikou-green transition-colors">در انتظار تایید</span>
                      <span className="text-3xl font-black text-nikou-dark mt-2">{stats.pendingVerifications}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#E8EFE6] flex items-center justify-center text-nikou-green group-hover:scale-110 transition-transform">
                      <ShieldCheck size={24} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-nikou-textMuted text-xs">نیاز به بررسی دارد</span>
                    <ArrowRight size={16} className="text-nikou-textMuted group-hover:text-nikou-green transition-colors" />
                  </div>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-nikou-dark">روند بازدید بازارگاه</h2>
                    <span className="text-xs text-nikou-textMuted">۷ روز گذشته</span>
                  </div>
                  
                  <div className="flex-1 flex items-end justify-between gap-4 h-[200px] mt-4 px-2">
                    {[
                      { day: 'شنبه', height: 'h-[40%]' },
                      { day: 'یک', height: 'h-[70%]' },
                      { day: 'دو', height: 'h-[45%]' },
                      { day: 'سه', height: 'h-[90%]' },
                      { day: 'چهار', height: 'h-[65%]' },
                      { day: 'پنج', height: 'h-[85%]' },
                      { day: 'جمعه', height: 'h-[100%]' },
                    ].map((item, i) => (
                      <div key={i} className="w-full flex flex-col justify-end items-center gap-2 group h-full">
                        <div className={`w-full ${item.height} bg-nikou-green/30 group-hover:bg-nikou-green transition-all rounded-t-md relative`}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-nikou-dark text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap">
                            {item.day}
                          </div>
                        </div>
                        <span className="text-[10px] text-nikou-textMuted">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm flex flex-col">
                  <h2 className="font-bold text-nikou-dark mb-6 flex items-center gap-2">
                    <Clock size={18} className="text-nikou-green" />
                    آخرین فعالیت‌ها
                  </h2>
                  <div className="flex flex-col gap-4">
                    {[
                      { title: 'کاربر جدید ثبت‌نام کرد', time: '۵ دقیقه پیش', icon: Users, color: 'text-blue-500' },
                      { title: 'سفارش جدید ثبت شد', time: '۲۰ دقیقه پیش', icon: ShoppingCart, color: 'text-purple-500' },
                      { title: 'کالای جدید اضافه شد', time: '۱ ساعت پیش', icon: Package, color: 'text-amber-500' },
                      { title: 'درخواست تیک آبی تایید شد', time: '۲ ساعت پیش', icon: CheckCircle2, color: 'text-emerald-500' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ${activity.color}`}>
                          <activity.icon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-nikou-dark">{activity.title}</span>
                          <span className="text-xs text-nikou-textMuted">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-nikou-dark rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-nikou-green rounded-full blur-3xl opacity-20 -z-0 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-nikou-green shrink-0 backdrop-blur-sm">
                    <Activity size={32} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-white">مدیریت هوشمند بازارگاه نیکو</h3>
                    <p className="text-sm text-nikou-textLight">همه‌چیز تحت کنترل شماست. برای مشاهده تغییرات به بخش‌های مختلف سر بزنید.</p>
                  </div>
                </div>
                
                <Link href="/" className="relative z-10 bg-nikou-green text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg">
                  بازگشت به سایت
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}