"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", phone: "", password: "", roleName: "BUYER" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("در حال ارسال...");

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ " + data.message);
        if (!isLogin) {
          setTimeout(() => { setIsLogin(true); setMessage(""); }, 2000);
        } else {
          localStorage.setItem('nikou_user_role', data.roles[0] || 'BUYER');
          localStorage.setItem('nikou_user_id', data.userId);
          setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
        }
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (error) {
      setMessage("❌ خطا در ارتباط با سرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans" dir="rtl">
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              {isLogin ? "ورود به NIKOU" : "ساخت حساب جدید"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? "برای مدیریت بازارگاه وارد شوید" : "به بزرگترین بازارگاه تجاری خوش آمدید"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ایمیل</label>
              <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition text-left" dir="ltr" placeholder="email@example.com" />
            </div>

            {/* بخش انتخاب نقش که دوباره برگشت */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">شماره موبایل</label>
                  <input type="text" required={!isLogin} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition text-left" dir="ltr" placeholder="0912..." />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">من می‌خواهم...</label>
                  <select 
                    value={formData.roleName} 
                    onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition bg-white"
                  >
                    <option value="BUYER">🛒 خریدار باشم (ثبت سفارش)</option>
                    <option value="SELLER">📦 فروشنده باشم (ثبت کالا)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">رمز عبور</label>
              <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition text-left" dir="ltr" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-4 disabled:opacity-50">
              {isLoading ? "لطفا صبر کنید..." : (isLogin ? "ورود به حساب" : "ثبت‌نام در نیکو")}
            </button>
          </form>

          {message && <p className={`mt-4 text-center font-bold text-sm ${message.includes('✅') ? 'text-emerald-600' : 'text-red-500'}`}>{message}</p>}

          <div className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "حساب کاربری ندارید؟ " : "قبلاً ثبت‌نام کرده‌اید؟ "}
            <button onClick={() => { setIsLogin(!isLogin); setMessage(""); }} className="text-emerald-600 font-bold hover:underline">
              {isLogin ? "همین حالا ثبت‌نام کنید" : "وارد شوید"}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-emerald-900 text-white flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="z-10 text-center px-12">
          <h1 className="text-6xl font-black mb-6 tracking-tighter">NIKOU</h1>
          <p className="text-xl text-emerald-200 leading-relaxed font-light">پلتفرم جامع تجارت<br />اتصال امن خریداران و فروشندگان</p>
        </motion.div>
      </div>

    </div>
  );
}