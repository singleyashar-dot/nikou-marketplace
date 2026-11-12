"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, ShieldCheck, MapPin, Calendar, 
  ChevronLeft, Store, ArrowRight, BadgeCheck 
} from "lucide-react";

export default function SellerStorePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [seller, setSeller] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/seller/${id}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setSeller(data);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setError("خطا در ارتباط با سرور");
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-nikou-textMuted bg-nikou-cream">در حال بارگذاری فروشگاه...</div>;

  if (error || !seller) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500 gap-4 bg-nikou-cream">
      <p className="text-xl font-bold">{error || "فروشنده یافت نشد."}</p>
      <Link href="/" className="bg-nikou-green text-white px-6 py-2 rounded-lg mt-4">بازگشت به بازارگاه</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-nikou-cream font-sans flex flex-col" dir="rtl">
      
      {/* هدر بالای سایت */}
      <header className="bg-[#FFFEFA] border-b border-[#DCDDD2] sticky top-0 z-50 h-20 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[22px] font-medium tracking-[3px] text-nikou-dark">NIKOU</span>
            <div className="w-px h-5 bg-nikou-green"></div>
            <span className="text-[28px] font-extrabold text-nikou-dark leading-none mt-1">نیکو</span>
          </Link>
          <Link href="/" className="text-[14px] text-nikou-dark hover:text-nikou-green transition-colors flex items-center gap-1 font-medium">
            <ArrowRight size={16} />
            بازگشت به بازارگاه
          </Link>
        </div>
      </header>

      {/* نوار مسیر */}
      <div className="bg-[#FFFEFA] border-b border-[#DCDDD2] py-3">
        <div className="max-w-[1440px] mx-auto px-16 flex items-center gap-2 text-[13px] text-nikou-textMuted">
          <Link href="/" className="hover:text-nikou-green">بازارگاه</Link>
          <ChevronLeft size={14} />
          <span className="text-nikou-dark font-medium">فروشگاه {seller.displayName}</span>
        </div>
      </div>

      {/* محتوای اصلی */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-16 py-10">
        
        {/* 👈 هدر پروفایل فروشنده (مینیمال و شیک) */}
        <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E8EFE6] to-[#DCDDD2] rounded-full flex items-center justify-center text-nikou-green border-4 border-white shadow-sm shrink-0">
              <Store size={32} />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-nikou-dark">{seller.displayName}</h1>
                {seller.isVerified && (
                  <BadgeCheck size={22} className="text-blue-500" fill="#EFF6FF" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-nikou-textMuted mt-1">
                <span className="flex items-center gap-1"><MapPin size={14} /> {seller.city}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1"><Calendar size={14} /> عضویت از {new Date(seller.createdAt).toLocaleDateString('fa-IR')}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1 text-nikou-green font-medium"><Package size={14} /> {seller.listings.length} کالای فعال</span>
              </div>
            </div>
          </div>

          {seller.isVerified && (
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-100">
              <ShieldCheck size={18} />
              فروشنده تایید شده
            </div>
          )}
        </div>

        {/* لیست کالاهای فروشنده */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-[#DCDDD2] pb-4">
            <h2 className="text-[24px] font-bold text-nikou-dark">کالاهای این فروشنده</h2>
            <span className="text-[14px] text-nikou-textMuted">مجموع {seller.listings.length} کالا</span>
          </div>

          {seller.listings.length === 0 ? (
            <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl text-center py-20 text-nikou-textMuted flex flex-col items-center gap-3">
              <Package size={48} className="opacity-20" />
              <p>این فروشنده هنوز هیچ کالایی ثبت نکرده است.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seller.listings.map((p: any) => {
                const mediaUrl = p.media && p.media.length > 0 ? p.media[0].url : null;
                return (
                  <Link href={`/products/${p.id}`} key={p.id} className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                    <div className="h-[200px] bg-nikou-greenLight relative overflow-hidden flex items-center justify-center">
                      {mediaUrl ? (
                        <img src={mediaUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Package size={48} className="text-nikou-green opacity-30" />
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow items-end">
                      <h3 className="font-semibold text-nikou-dark text-[18px] leading-[1.8] text-right w-full truncate mb-2">{p.title}</h3>
                      <div className="flex justify-end items-baseline gap-2 mt-auto w-full">
                        <span className="text-nikou-textMuted text-[12px]">تومان</span>
                        <span className="text-nikou-dark text-[22px] font-semibold">{p.price ? p.price.toLocaleString() : '0'}</span>
                      </div>
                      <div className="w-full h-px bg-[#DCDDD2] my-3"></div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-nikou-textMuted text-[12px]">موجودی: {p.stockQuantity} {p.unit || 'عدد'}</span>
                        <span className="text-nikou-green text-[13px] font-medium group-hover:underline">مشاهده کالا</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}