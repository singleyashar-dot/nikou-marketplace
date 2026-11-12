"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Search, MapPin, Package, ArrowRight, 
  SlidersHorizontal, CheckCircle2, ChevronLeft, X,
  Grid, ListFilter
} from "lucide-react";

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه دسته‌ها");
  const [selectedCity, setSelectedCity] = useState("همه شهرها");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));

    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});

    fetch('/api/cities', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCities(data); })
      .catch(() => {});
  }, []);

  let filtered = products.filter(p => {
    const categoryTitle = p.category?.title || "عمومی";
    const productCity = p.seller?.profile?.city || "";
    
    const matchSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        categoryTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "همه دسته‌ها" ? true : categoryTitle === selectedCategory;
    const matchCity = selectedCity === "همه شهرها" ? true : productCity === selectedCity;
    
    return matchSearch && matchCategory && matchCity;
  });

  if (sortOption === "cheapest") filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortOption === "expensive") filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sortOption === "inStock") filtered = filtered.filter(p => p.stockQuantity > 0);
  else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-[#F8F6F0] font-sans" dir="rtl">
      
      {/* 👈 هدر مینیمال و چسبان (بدون تکرار و شلوغی) */}
      <header className="bg-nikou-dark text-white sticky top-0 z-50 h-[72px] flex items-center border-b border-white/10 shadow-lg">
        <div className="max-w-[1440px] mx-auto w-full px-6 flex justify-between items-center gap-4">
          
          {/* دکمه بازگشت */}
          <Link href="/" className="flex items-center gap-2 text-[13px] text-nikou-textLight hover:text-white transition-colors shrink-0">
            <ArrowRight size={16} /> بازگشت
          </Link>

          {/* نوار جستجو (دقیقا وسط) */}
          <div className="flex-1 max-w-[600px] relative hidden md:block">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کالا، خدمات یا کسب‌وکار..." 
              className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-white/10 text-white placeholder:text-white/50 rounded-xl outline-none border border-white/10 focus:border-nikou-green transition-all" 
            />
            <Search size={18} className="absolute left-3 top-2.5 text-white/50" />
          </div>

          {/* لوگو */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="text-[20px] font-medium tracking-[2px] text-white">NIKOU</span>
            <div className="w-px h-5 bg-nikou-green"></div>
            <span className="text-[24px] font-extrabold text-white leading-none mt-1">نیکو</span>
          </Link>
        </div>
      </header>

      {/* محتوای اصلی (با فاصله مناسب از هدر) */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* سایدبار فیلترها (سمت راست) */}
        <aside className="w-full lg:w-[260px] shrink-0 space-y-4">
          
          {/* فیلتر دسته‌بندی */}
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#F5F2EA]">
              <h3 className="font-bold text-nikou-dark text-[14px] flex items-center gap-2">
                <ListFilter size={16} className="text-nikou-green" /> دسته‌بندی‌ها
              </h3>
              <button onClick={() => setSelectedCategory("همه دسته‌ها")} className="text-[11px] text-nikou-textMuted hover:text-red-500">حذف</button>
            </div>
            <div className="flex flex-col max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
              <button 
                onClick={() => setSelectedCategory("همه دسته‌ها")}
                className={`text-right text-[13px] py-2.5 px-2 rounded-lg transition-all ${selectedCategory === "همه دسته‌ها" ? "bg-[#E8EFE6] text-nikou-green font-bold" : "text-[#59675E] hover:bg-[#F5F2EA]"}`}
              >
                همه دسته‌ها
              </button>
              {categories.map((cat: any) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.title)}
                  className={`text-right text-[13px] py-2.5 px-2 rounded-lg transition-all ${selectedCategory === cat.title ? "bg-[#E8EFE6] text-nikou-green font-bold" : "text-[#59675E] hover:bg-[#F5F2EA]"}`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* فیلتر شهر */}
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#F5F2EA]">
              <h3 className="font-bold text-nikou-dark text-[14px] flex items-center gap-2">
                <MapPin size={16} className="text-nikou-green" /> شهر شما
              </h3>
              <button onClick={() => setSelectedCity("همه شهرها")} className="text-[11px] text-nikou-textMuted hover:text-red-500">حذف</button>
            </div>
            <div className="flex flex-col max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
              <button 
                onClick={() => setSelectedCity("همه شهرها")}
                className={`text-right text-[13px] py-2.5 px-2 rounded-lg transition-all ${selectedCity === "همه شهرها" ? "bg-[#E8EFE6] text-nikou-green font-bold" : "text-[#59675E] hover:bg-[#F5F2EA]"}`}
              >
                همه شهرها
              </button>
              {cities.map((city: any) => (
                <button 
                  key={city.id}
                  onClick={() => setSelectedCity(city.name)}
                  className={`text-right text-[13px] py-2.5 px-2 rounded-lg transition-all ${selectedCity === city.name ? "bg-[#E8EFE6] text-nikou-green font-bold" : "text-[#59675E] hover:bg-[#F5F2EA]"}`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* لیست کالاها (سمت چپ) */}
        <div className="flex-1">
          
          {/* نوار مرتب‌سازی (مینیمال) */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5 bg-[#FFFEFA] border border-[#DCDDD2] p-2 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-[12px] text-nikou-textMuted font-medium px-3">
              <span>مرتب‌سازی:</span>
            </div>
            
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button onClick={() => setSortOption("newest")} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${sortOption === "newest" ? "bg-nikou-dark text-white" : "text-nikou-textMuted hover:bg-[#F5F2EA]"}`}>جدیدترین</button>
              <button onClick={() => setSortOption("cheapest")} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${sortOption === "cheapest" ? "bg-nikou-dark text-white" : "text-nikou-textMuted hover:bg-[#F5F2EA]"}`}>ارزان‌ترین</button>
              <button onClick={() => setSortOption("expensive")} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${sortOption === "expensive" ? "bg-nikou-dark text-white" : "text-nikou-textMuted hover:bg-[#F5F2EA]"}`}>گران‌ترین</button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 border-4 border-nikou-green border-t-transparent rounded-full animate-spin"></div>
              <span className="text-nikou-textMuted text-sm font-medium">در حال دریافت کالاها...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-xl text-center py-20 px-6 shadow-sm flex flex-col items-center gap-3">
              <Package size={40} className="text-nikou-textMuted opacity-30" />
              <h3 className="text-base font-bold text-nikou-dark">کالایی یافت نشد!</h3>
              <p className="text-xs text-nikou-textMuted">لطفاً فیلترها را تغییر دهید.</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("همه دسته‌ها"); setSelectedCity("همه شهرها"); }} className="mt-2 bg-[#F5F2EA] text-nikou-dark border border-[#DCDDD2] px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                حذف همه فیلترها
              </button>
            </div>
          ) : (
            /* 👈 گرید انعطاف‌پذیر (در زوم ۶۵٪ هم به هم نمی‌ریزه) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  key={p.id}
                >
                  <Link href={`/products/${p.id}`} className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-xl overflow-hidden flex flex-col group hover:shadow-md hover:border-nikou-green transition-all duration-300 h-full">
                    <div className="h-[180px] bg-[#F5F2EA] relative overflow-hidden flex items-center justify-center">
                      {p.media && p.media.length > 0 ? (
                        <img src={p.media[0].url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Package size={40} className="text-nikou-green opacity-20" />
                      )}
                      
                      <div className="absolute top-2 right-2 bg-[#FFFEFA]/90 backdrop-blur-sm text-nikou-dark text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        {p.category?.title || 'عمومی'}
                      </div>
                      
                      {p.stockQuantity > 0 && (
                        <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <CheckCircle2 size={10} /> موجود
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-nikou-textMuted text-[10px] flex items-center gap-1"><MapPin size={10}/> {p.seller?.profile?.city || 'ایران'}</span>
                      </div>
                      
                      <h3 className="font-bold text-nikou-dark text-[15px] leading-[1.6] text-right w-full line-clamp-1 mb-3 group-hover:text-nikou-green transition-colors">{p.title}</h3>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-end w-full">
                          <span className="text-nikou-textMuted text-[10px]">قیمت</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-nikou-dark text-[18px] font-black">{p.price ? p.price.toLocaleString() : '0'}</span>
                            <span className="text-nikou-textMuted text-[10px]">تومان</span>
                          </div>
                        </div>
                        
                        <div className="w-full h-px bg-[#F5F2EA] my-2"></div>
                        
                        <div className="flex justify-between items-center w-full">
                          <span className="text-nikou-textMuted text-[10px]">موجودی: {p.stockQuantity}</span>
                          <span className="text-nikou-green text-[11px] font-bold group-hover:underline">مشاهده</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}