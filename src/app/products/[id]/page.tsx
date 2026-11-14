"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ChevronLeft, MapPin, Package, CheckCircle2, Store, Image as ImageIcon, ArrowLeft } from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch('/api/products', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          const found = data.find((p: any) => p.id === id);
          if (found) setProduct(found);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [id]);

  const handleRequest = async () => {
    setIsOrdering(true);
    setOrderMessage("در حال ثبت سفارش...");

    if (quantity > product.stockQuantity) {
      setOrderMessage("❌ تعداد درخواستی بیشتر از موجودی انبار است.");
      setIsOrdering(false);
      return;
    }

    const userId = localStorage.getItem('nikou_user_id');

    if (!userId || userId === 'null' || userId === 'undefined') {
      setOrderMessage("❌ خطا: لطفا ابتدا وارد حساب کاربری خود شوید.");
      setIsOrdering(false);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: product.id,
          quantity: quantity,
          totalPrice: (product.price || 0) * quantity,
          buyerId: userId
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderMessage("✅ " + data.message);
        setOrderSuccessId(data.id);
      } else {
        setOrderMessage("❌ " + data.error);
      }
    } catch (error) {
      setOrderMessage("❌ خطا در ارتباط با سرور.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-nikou-textMuted bg-nikou-cream">در حال بارگذاری...</div>;
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500 gap-4 bg-nikou-cream">
      <p className="text-xl font-bold">کالا یافت نشد.</p>
      <Link href="/" className="bg-nikou-green text-white px-6 py-2 rounded-lg mt-4">بازگشت</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-nikou-cream font-sans flex flex-col" dir="rtl">
      
      <header className="bg-[#FFFEFA] border-b border-[#DCDDD2] sticky top-0 z-50 h-24 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[25px] font-medium tracking-[3px] text-nikou-dark">NIKOU</span>
            <div className="w-px h-6 bg-nikou-green"></div>
            <span className="text-[33px] font-extrabold text-nikou-dark leading-none mt-2">نیکو</span>
          </Link>
          <div className="flex items-center gap-4">
             <Link href="/login" className="text-[14px] text-nikou-dark hover:text-nikou-green transition-colors">ورود</Link>
             <Link href="/dashboard" className="bg-nikou-green text-white px-6 py-2.5 rounded-lg text-[15px] font-semibold hover:bg-emerald-700 transition-colors">پنل کاربری</Link>
          </div>
        </div>
      </header>

      <div className="bg-[#FFFEFA] border-b border-[#DCDDD2] py-4">
        <div className="max-w-[1440px] mx-auto px-16 flex items-center gap-2 text-[13px] text-nikou-textMuted">
          <Link href="/" className="hover:text-nikou-green">بازارگاه</Link>
          <ChevronLeft size={14} />
          {/* 👈 اصلاح شد: category?.title */}
          <span className="hover:text-nikou-green cursor-pointer">{product.category?.title || "دسته‌بندی نشده"}</span>
          <ChevronLeft size={14} />
          <span className="text-nikou-dark font-medium">{product.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[55%] flex flex-col gap-4">
            <div className="w-full h-[450px] bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl relative overflow-hidden flex items-center justify-center shadow-sm">
              {product.media && product.media.length > 0 ? (
                <img src={product.media[0].url} alt={product.title} className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-[#087F5B]/20">
                  <Package size={80} />
                  <span className="text-sm font-medium">تصویری ثبت نشده است</span>
                </div>
              )}
              {/* 👈 اصلاح شد: category?.title */}
              <div className="absolute top-5 right-5 bg-[#FFFEFA]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#DCDDD2] text-[12px] text-nikou-dark font-medium shadow-sm">
                {product.category?.title || "کالای عمومی"}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[45%] flex flex-col gap-5">
            <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-7 flex flex-col gap-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="bg-[#E8EFE6] text-[#087F5B] px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> موجود در انبار
                  </span>
                </div>
              </div>

              <h1 className="text-[32px] font-bold text-nikou-dark leading-[1.6]">{product.title}</h1>
              <p className="text-[14px] text-nikou-textMuted leading-relaxed">{product.description || 'توضیحات ثبت نشده است.'}</p>

              <div className="w-full h-px bg-[#DCDDD2] my-1"></div>

              <div className="flex flex-col items-end">
                <span className="text-[13px] text-nikou-textMuted mb-1">قیمت واحد</span>
                <div className="flex justify-end items-baseline gap-2">
                  <span className="text-[40px] font-bold text-nikou-dark">{product.price ? product.price.toLocaleString() : '0'}</span>
                  <span className="text-[14px] text-nikou-textMuted">تومان</span>
                </div>
              </div>

              <div className="flex gap-4 mt-2 p-4 bg-[#F5F2EA] rounded-xl">
                <div className="flex flex-col gap-1 w-1/2 border-l border-[#DCDDD2] pl-4">
                  <span className="text-[13px] text-nikou-textMuted">حداقل سفارش</span>
                  <span className="text-[18px] font-semibold text-nikou-dark">۱ {product.unit || 'عدد'}</span>
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="text-[13px] text-nikou-textMuted">موجودی انبار</span>
                  <span className="text-[18px] font-semibold text-nikou-dark">{product.stockQuantity} {product.unit || 'عدد'}</span>
                </div>
              </div>

              {orderSuccessId ? (
                <div className="bg-[#E8EFE6] border border-[#087F5B]/20 p-5 rounded-xl text-center mt-2">
                  <p className="text-[#087F5B] font-bold mb-3 text-sm">✅ سفارش شما با موفقیت ثبت شد!</p>
                  <div className="flex gap-2 justify-center">
                    <Link href={`/orders/${orderSuccessId}`} className="bg-nikou-green hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md">
                      مشاهده و گفتگو
                    </Link>
                    <Link href="/" className="bg-[#FFFEFA] text-nikou-dark border border-[#DCDDD2] hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-bold transition-all">
                      بازگشت
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-nikou-dark">تعداد درخواستی:</label>
                    <div className="flex items-center gap-3">
                       <input 
                        type="number" min="1" max={product.stockQuantity} value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-20 px-3 py-2 text-sm border border-[#DCDDD2] rounded-lg text-center outline-none focus:border-nikou-green bg-[#F5F2EA] font-bold text-nikou-dark"
                      />
                      <span className="text-sm text-nikou-textMuted">{product.unit || 'عدد'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleRequest}
                    disabled={isOrdering || product.stockQuantity === 0}
                    className={`w-full font-semibold text-[15px] py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 mt-2 ${
                      product.stockQuantity === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-nikou-green hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isOrdering ? "در حال ثبت..." : (product.stockQuantity === 0 ? "ناموجود" : "ثبت سفارش / درخواست خرید")}
                  </button>
                </div>
              )}
              
              {orderMessage && !orderSuccessId && (
                <p className={`text-center text-sm font-bold ${orderMessage.includes('✅') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {orderMessage}
                </p>
              )}
            </div>

            <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E8EFE6] rounded-xl flex items-center justify-center text-nikou-green">
                    <Store size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[18px] font-bold text-nikou-dark">
                      {product.seller?.profile?.displayName || product.seller?.email?.split('@')[0] || 'فروشنده نیکو'}
                    </span>
                    <span className="text-[13px] text-nikou-textMuted flex items-center gap-1 mt-1">فروشنده در بازارگاه نیکو</span>
                  </div>
                </div>
                
                <Link 
                  href={`/seller/${product.sellerId}`} 
                  className="bg-[#F5F2EA] hover:bg-[#E8EFE6] text-nikou-dark border border-[#DCDDD2] px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2"
                >
                  مشاهده فروشگاه
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#DCDDD2] bg-[#F5F2EA]">
            <h2 className="text-[22px] font-bold text-nikou-dark">مشخصات فنی کالا</h2>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-[#DCDDD2] hover:bg-gray-50 transition-colors">
              <span className="text-[15px] font-medium text-nikou-dark">دسته‌بندی</span>
              {/* 👈 اصلاح شد: category?.title */}
              <span className="text-[14px] text-nikou-textMuted">{product.category?.title || 'عمومی'}</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-[#DCDDD2] hover:bg-gray-50 transition-colors">
              <span className="text-[15px] font-medium text-nikou-dark">واحد شمارش</span>
              <span className="text-[14px] text-nikou-textMuted">{product.unit || 'عدد'}</span>
            </div>
            <div className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
              <span className="text-[15px] font-medium text-nikou-dark">موجودی انبار</span>
              <span className="text-[14px] text-nikou-textMuted">{product.stockQuantity} {product.unit || 'عدد'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}