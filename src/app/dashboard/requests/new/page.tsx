"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ClipboardList, Send } from "lucide-react";

export default function NewRequestPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("عدد");
  const [categoryId, setCategoryId] = useState(""); // 👈 اضافه شد
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const userId = localStorage.getItem('nikou_user_id');
    
    if (!userId) {
      setMessage("❌ لطفاً ابتدا وارد حساب کاربری خود شوید.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          quantity: Number(quantity),
          unit,
          categoryId, // 👈 ارسال به بک‌اند
          buyerId: userId
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ درخواست شما با موفقیت ثبت شد! در حال انتقال...");
        setTimeout(() => {
          router.push("/dashboard/requests");
        }, 2000);
      } else {
        setMessage("❌ " + (data.error || "خطا در ثبت درخواست"));
      }
    } catch (error) {
      setMessage("❌ خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-nikou-cream font-sans flex flex-col" dir="rtl">
      <header className="bg-[#FFFEFA] border-b border-[#DCDDD2] sticky top-0 z-50 h-24 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/dashboard/requests" className="flex items-center gap-2 text-nikou-textMuted hover:text-nikou-dark transition-colors">
            <ArrowRight size={20} />
            <span className="font-semibold text-sm">بازگشت به لیست درخواست‌ها</span>
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[25px] font-medium tracking-[3px] text-nikou-dark">NIKOU</span>
            <div className="w-px h-6 bg-nikou-green"></div>
            <span className="text-[33px] font-extrabold text-nikou-dark leading-none mt-2">نیکو</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-8 py-12">
        <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-[#DCDDD2] pb-6">
            <div className="w-12 h-12 bg-[#E8EFE6] rounded-xl flex items-center justify-center text-nikou-green">
              <ClipboardList size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-nikou-dark">ثبت درخواست خرید جدید</h1>
              <p className="text-sm text-nikou-textMuted mt-1">نیاز خود را ثبت کنید تا فروشندگان به شما پیشنهاد بدهند.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-nikou-dark">عنوان درخواست *</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: نیاز به کارتن پنج لایه"
                className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-nikou-dark">دسته‌بندی *</label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green bg-[#F5F2EA]"
              >
                <option value="">انتخاب کنید...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">مقدار مورد نیاز *</label>
                <input 
                  type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  placeholder="مثلاً: 500"
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]" 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">واحد شمارش *</label>
                <input 
                  type="text" required value={unit} onChange={(e) => setUnit(e.target.value)}
                  placeholder="مثلاً: عدد، کیلوگرم، کارتن"
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-nikou-dark">توضیحات و شرایط</label>
              <textarea 
                rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="جزئیات بیشتری از نیاز خود، زمان تحویل یا شرایط پرداخت بنویسید..."
                className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors resize-none bg-[#F5F2EA]"
              ></textarea>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-nikou-green text-white font-semibold text-[16px] py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "در حال ثبت..." : (
                <>
                  ثبت درخواست
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}