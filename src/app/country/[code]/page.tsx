"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Package, ArrowRight, Globe, ShieldCheck, 
  Search
} from "lucide-react";

export default function CountryPage() {
  const params = useParams();
  const code = (params.code as string)?.toUpperCase(); // مثلاً CN

  const [country, setCountry] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!code) return;

    // گرفتن اطلاعات کشور و کالاها به صورت همزمان
    Promise.all([
      fetch('/api/countries', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/products', { cache: 'no-store' }).then(res => res.json())
    ]).then(([countriesData, productsData]) => {
      if (Array.isArray(countriesData)) {
        const found = countriesData.find((c: any) => c.code === code);
        if (found) setCountry(found);
      }
      if (Array.isArray(productsData)) {
        setAllProducts(productsData);
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [code]);

  // فیلتر کردن کالاها (خارج از useEffect برای جلوگیری از حلقه)
  const filteredProducts = allProducts.filter(p => {
    const matchesCountry = country ? p.country === country.name : false;
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-nikou-cream text-nikou-textMuted">در حال بارگذاری بازار {code}...</div>;
  }

  return (
    <div className="min-h-screen bg-nikou-cream font-sans" dir="rtl">
      
      {/* هدر */}
      <header className="bg-nikou-dark text-white sticky top-0 z-50 h-24 flex items-center border-b border-white/10">
        <div className="max-w-360 mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[25px] font-medium tracking-[3px] text-white">NIKOU</span>
            <div className="w-px h-6 bg-nikou-green"></div>
            <span className="text-[33px] font-extrabold text-white leading-none mt-2">نیکو</span>
          </Link>
          <Link href="/" className="text-[14px] text-nikou-textLight hover:text-white transition-colors flex items-center gap-1">
            <ArrowRight size={16} />
            بازگشت به بازارگاه
          </Link>
        </div>
      </header>

      {/* بنر کشور */}
      <section className="bg-gradient-to-br from-[#14251E] via-[#1B3026] to-[#087F5B] text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-360 mx-auto px-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-6xl backdrop-blur-sm border border-white/20 shadow-lg">
              {country?.flag || '🌍'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-nikou-greenLight text-sm mb-2">
                <Globe size={16} />
                بازار بین‌المللی
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">بازار {country?.name || code}</h1>
              <p className="text-[#BCCFC2] max-w-md leading-relaxed text-sm md:text-base">
                کالاهای عرضه شده توسط فروشندگان {country?.name || code}. برای معامله، مستقیماً با فروشنده در ارتباط باشید.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`جستجو در بازار ${country?.name || code}...`}
              className="w-full pl-10 pr-4 py-3 text-sm bg-white/10 backdrop-blur-md rounded-xl border border-white/20 outline-none text-white placeholder-white/60 focus:border-nikou-greenLight transition-all"
            />
            <Search size={18} className="absolute left-3 top-3.5 text-white/60" />
          </div>
        </div>
      </section>

      {/* لیست کالاها */}
      <main className="max-w-360 mx-auto px-16 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-[#DCDDD2] pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-nikou-textMuted text-sm">کالاهای موجود</span>
            <h2 className="text-2xl font-bold text-nikou-dark">محصولات {country?.name || code}</h2>
          </div>
          <span className="text-sm text-nikou-textMuted">{filteredProducts.length} کالا</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl text-center py-20 text-nikou-textMuted flex flex-col items-center gap-3">
            <Package size={48} className="opacity-20 text-nikou-green" />
            <p>هنوز کالایی از {country?.name || code} ثبت نشده است.</p>
            <Link href="/" className="text-nikou-green font-bold text-sm mt-2 hover:underline">بازگشت به بازارگاه</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const mediaUrl = p.media && p.media.length > 0 ? p.media[0].url : null;
              return (
                <Link href={`/products/${p.id}`} key={p.id} className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                  <div className="h-[200px] bg-nikou-greenLight relative overflow-hidden flex items-center justify-center">
                    {mediaUrl ? (
                      <img src={mediaUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Package size={48} className="text-nikou-green opacity-30" />
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-nikou-dark text-[10px] px-2 py-1 rounded-full font-bold border border-gray-200 flex items-center gap-1">
                      <Globe size={10} /> {country?.name}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow items-end">
                    <h3 className="font-semibold text-nikou-dark text-[17px] leading-[1.8] text-right w-full truncate mb-2">{p.title}</h3>
                    <div className="flex justify-end items-baseline gap-1 mt-auto w-full">
                      <span className="text-nikou-textMuted text-[11px]">تومان</span>
                      <span className="text-nikou-dark text-[20px] font-semibold">{p.price ? p.price.toLocaleString() : '0'}</span>
                    </div>
                    <div className="w-full h-px bg-[#DCDDD2] my-3"></div>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-nikou-textMuted text-[11px]">موجودی: {p.stockQuantity}</span>
                      <span className="text-nikou-green text-[12px] font-medium group-hover:underline">مشاهده کالا</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* سلب مسئولیت */}
        <div className="mt-16 bg-[#F5F2EA] border border-[#DCDDD2] rounded-xl p-6 flex items-start gap-4">
          <ShieldCheck className="text-nikou-green shrink-0 mt-1" size={24} />
          <div className="text-sm text-[#59675E] leading-relaxed">
            <strong className="text-nikou-dark block mb-1">توجه:</strong>
            NIKOU یک پلتفرم معرفی و ارتباط است. اطلاعات مبدا کالاها توسط فروشندگان اعلام شده است. انجام تشریفات گمرکی، پرداخت ارزی و حمل و نقل بین‌المللی بر عهده خریدار و فروشنده است.
          </div>
        </div>
      </main>
    </div>
  );
}