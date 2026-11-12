"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, ChevronDown, MapPin, Package, ArrowLeft, 
  ClipboardList, ShieldCheck, Banknote, Contact,
  ChevronRight, ChevronLeft 
} from "lucide-react";

export default function PublicMarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه دسته‌ها");
  const [selectedCity, setSelectedCity] = useState("همه مناطق");
  const [sortOption, setSortOption] = useState("newest");
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});

    fetch('/api/cities', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCities(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStartBuying = () => {
    document.getElementById('market-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  let filtered = products.filter(p => {
    const categoryTitle = p.category?.title || "عمومی";
    
    const matchSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        categoryTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "همه دسته‌ها" ? true : categoryTitle === selectedCategory;
    const matchCity = selectedCity === "همه مناطق" ? true : p.seller?.profile?.city === selectedCity;
    
    return matchSearch && matchCategory && matchCity;
  });

  if (sortOption === "cheapest") {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "expensive") {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption === "inStock") {
    filtered = filtered.filter(p => p.stockQuantity > 0);
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <div className="min-h-screen bg-nikou-cream font-sans" dir="rtl">
      
      <header className="bg-nikou-dark text-white sticky top-0 z-50 h-24 flex items-center border-b border-white/10">
        <div className="max-w-360 mx-auto w-full px-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[25px] font-medium tracking-[3px] text-white">NIKOU</span>
            <div className="w-px h-6 bg-nikou-green"></div>
            <span className="text-[33px] font-extrabold text-white leading-none mt-2">نیکو</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[14px] text-nikou-textLight">
            <Link href="/about" className="hover:text-white transition-colors">درباره نیکو</Link>
            <Link href="/guide/buy" className="hover:text-white transition-colors">راهنمای خرید</Link>
            <Link href="/guide/sell" className="hover:text-white transition-colors">راهنمای فروش</Link>
            <Link href="/contact" className="hover:text-white transition-colors">تماس با ما</Link>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[14px] text-white hover:text-nikou-greenLight transition-colors">ورود</Link>
            <Link href="/dashboard/products/new" className="bg-nikou-green text-white px-6 py-3 rounded-lg text-[15px] font-semibold hover:bg-emerald-700 transition-colors">ثبت آگهی</Link>
          </div>
        </div>
      </header>

      <section className="bg-nikou-dark text-white pt-12 pb-20">
        <div className="max-w-360 mx-auto px-16 flex flex-col gap-12">
          <div className="flex flex-col lg:flex-row items-center gap-14">
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full lg:w-171.5 flex flex-col items-end gap-6">
              <div className="flex items-center gap-2 text-nikou-greenLight text-[14px]">
                <span>بازارگاه تخصصی تجارت B2B</span>
                <span className="w-1.5 h-1.5 bg-nikou-greenLight rounded-full"></span>
              </div>
              <h1 className="text-[62px] font-bold leading-normal text-right text-nikou-cream">
                بازارگاه جامع تجارت <br /> برای رشد کسب‌وکار شما
              </h1>
              <p className="text-[18px] text-nikou-textLight text-right leading-relaxed">
                اتصال امن خریداران و فروشندگان در بزرگترین انبار مجازی. تجربه‌ای متفاوت از معامله عمده با تضمین کیفیت و امنیت.
              </p>
              <div className="flex gap-4 mt-4">
                <button onClick={handleStartBuying} className="bg-nikou-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all">شروع خرید</button>
                <Link href="/dashboard/products/new" className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/5 transition-all">شروع فروش</Link>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full lg:w-142.5 h-112 rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#14251E] via-[#1B3026] to-[#087F5B] border border-white/10 group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-nikou-green rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-5 right-5 left-5 bg-[#14251E]/80 backdrop-blur-md p-5 rounded-xl flex justify-between items-center border border-white/10">
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold text-white">محصولات صنعتی</span>
                  <span className="text-[12px] text-nikou-textLight">کیفیت تضمین شده</span>
                </div>
                <span className="bg-nikou-green/20 text-nikou-greenLight px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-nikou-green/30">
                  تصویر منتخب بازار
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full bg-[#FFFEFA] rounded-2xl p-5 flex items-center gap-4 shadow-xl relative z-30">
            <button className="bg-nikou-green text-white px-6 py-3 rounded-lg font-semibold whitespace-nowrap">جستجو</button>
            
            <div className="relative" ref={categoryRef}>
              <div onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsCityOpen(false); }} className="flex items-center gap-3 px-4 border-l border-gray-300 cursor-pointer hover:text-nikou-green transition-colors">
                <ChevronDown size={16} className="text-nikou-dark" />
                <span className="text-[14px] text-nikou-dark">{selectedCategory}</span>
              </div>
              {isCategoryOpen && (
                <div className="absolute top-10 right-0 w-48 bg-white border border-[#DCDDD2] rounded-xl shadow-xl py-2 z-50 max-h-60 overflow-y-auto text-nikou-dark">
                  <div onClick={() => { setSelectedCategory("همه دسته‌ها"); setIsCategoryOpen(false); }} className="px-4 py-2 hover:bg-nikou-cream cursor-pointer text-sm text-nikou-dark">همه دسته‌ها</div>
                  {categories.map((cat: any, i) => (
                    <div key={i} onClick={() => { setSelectedCategory(cat.title); setIsCategoryOpen(false); }} className="px-4 py-2 hover:bg-nikou-cream cursor-pointer text-sm text-nikou-dark">{cat.title}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={cityRef}>
              <div onClick={() => { setIsCityOpen(!isCityOpen); setIsCategoryOpen(false); }} className="flex items-center gap-3 px-4 border-l border-gray-300 cursor-pointer hover:text-nikou-green transition-colors">
                <ChevronDown size={16} className="text-nikou-dark" />
                <span className="text-[14px] text-nikou-dark">{selectedCity}</span>
                <MapPin size={16} className="text-nikou-dark" />
              </div>
              {isCityOpen && (
                <div className="absolute top-10 right-0 w-48 bg-white border border-[#DCDDD2] rounded-xl shadow-xl py-2 z-50 text-nikou-dark">
                  <div onClick={() => { setSelectedCity("همه مناطق"); setIsCityOpen(false); }} className="px-4 py-2 hover:bg-nikou-cream cursor-pointer text-sm text-nikou-dark">همه مناطق</div>
                  {cities.map((city: any, i) => (
                    <div key={i} onClick={() => { setSelectedCity(city.name); setIsCityOpen(false); }} className="px-4 py-2 hover:bg-nikou-cream cursor-pointer text-sm text-nikou-dark">{city.name}</div>
                  ))}
                </div>
              )}
            </div>

            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی محصول، خدمت یا کسب‌وکار..." 
              className="flex-1 bg-transparent outline-none text-[16px] text-nikou-dark placeholder:text-nikou-textMuted px-4" 
            />
            <Search size={20} className="text-nikou-textMuted ml-2" />
          </motion.div>
        </div>
      </section>

      <section className="max-w-360 mx-auto px-16 py-10 w-full">
        <div className="flex justify-between items-center mb-6 w-full">
          <h2 className="text-[28px] font-semibold text-nikou-dark">خرید بر اساس دسته‌بندی</h2>
          
          <div className="flex gap-2">
            <button onClick={() => scrollSlider('right')} className="w-10 h-10 flex items-center justify-center bg-[#FFFEFA] text-nikou-dark rounded-full border border-[#DCDDD2] hover:bg-nikou-green hover:text-white hover:border-nikou-green transition-colors shadow-sm">
              <ChevronRight size={20} />
            </button>
            <button onClick={() => scrollSlider('left')} className="w-10 h-10 flex items-center justify-center bg-[#FFFEFA] text-nikou-dark rounded-full border border-[#DCDDD2] hover:bg-nikou-green hover:text-white hover:border-nikou-green transition-colors shadow-sm">
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
        
        <div ref={sliderRef} className="flex overflow-x-auto gap-4 pb-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.length > 0 ? categories.map((cat: any, i) => (
            <div 
              key={i} 
              onClick={() => { setSelectedCategory(cat.title); handleStartBuying(); }}
              className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:border-nikou-green hover:shadow-md transition-all cursor-pointer group w-[150px] shrink-0 snap-start"
            >
              <div className="w-12 h-12 bg-[#F5F2EA] rounded-full flex items-center justify-center text-nikou-green group-hover:bg-[#E8EFE6] transition-colors duration-300">
                <Package size={24} />
              </div>
              <h3 className="font-semibold text-nikou-dark text-[14px] text-center w-full truncate leading-relaxed">{cat.title}</h3>
            </div>
          )) : (
            <div className="w-full text-center text-nikou-textMuted py-4">هنوز دسته‌بندی‌ای ثبت نشده است.</div>
          )}
        </div>
      </section>

      <section id="market-products" className="max-w-360 mx-auto px-16 py-8 w-full">
        <div className="flex justify-between items-end mb-8 w-full">
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-nikou-textMuted text-[13px]">آخرین کالاهای ثبت شده توسط فروشندگان</span>
            <h2 className="text-[32px] font-semibold text-nikou-dark">تازه‌های بازار</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-nikou-textMuted text-[13px]">مرتب‌سازی:</span>
            <div className="flex gap-2">
              <span onClick={() => setSortOption("newest")} className={`${sortOption === "newest" ? "bg-nikou-dark text-white" : "bg-nikou-cream text-nikou-textMuted hover:bg-gray-200"} px-5 py-2 rounded-full text-[13px] cursor-pointer transition-colors`}>جدیدترین</span>
              <span onClick={() => setSortOption("cheapest")} className={`${sortOption === "cheapest" ? "bg-nikou-dark text-white" : "bg-nikou-cream text-nikou-textMuted hover:bg-gray-200"} px-5 py-2 rounded-full text-[13px] cursor-pointer transition-colors`}>ارزان‌ترین</span>
              <span onClick={() => setSortOption("expensive")} className={`${sortOption === "expensive" ? "bg-nikou-dark text-white" : "bg-nikou-cream text-nikou-textMuted hover:bg-gray-200"} px-5 py-2 rounded-full text-[13px] cursor-pointer transition-colors`}>گران‌ترین</span>
              <span onClick={() => setSortOption("inStock")} className={`${sortOption === "inStock" ? "bg-nikou-dark text-white" : "bg-nikou-cream text-nikou-textMuted hover:bg-gray-200"} px-5 py-2 rounded-full text-[13px] cursor-pointer transition-colors`}>موجود در انبار</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-nikou-textMuted">در حال بارگذاری کالاها...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl text-center py-20 text-nikou-textMuted flex flex-col items-center gap-3">
            <Package size={48} className="opacity-20 text-nikou-green" />
            <p>{searchQuery || selectedCategory !== "همه دسته‌ها" || selectedCity !== "همه مناطق" ? "کالایی با این مشخصات یافت نشد." : "هنوز کالایی ثبت نشده است."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <Link href={`/products/${p.id}`} key={p.id} className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                <div className="h-[222px] bg-nikou-greenLight relative overflow-hidden flex items-center justify-center">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package size={48} className="text-nikou-green opacity-30" />
                  )}
                  <div className="absolute top-4 right-4 bg-nikou-greenLight text-nikou-green text-[12px] px-3 py-1 rounded-full">
                    {p.category?.title || 'عمومی'}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow items-end">
                  <span className="text-nikou-textMuted text-[12px] mb-2">{p.seller?.email || 'فروشنده'}</span>
                  <h3 className="font-semibold text-nikou-dark text-[20px] leading-[1.8] text-right w-full truncate">{p.title}</h3>
                  <div className="flex justify-end items-baseline gap-2 mt-1 w-full">
                    <span className="text-nikou-textMuted text-[12px]">تومان</span>
                    <span className="text-nikou-dark text-[24px] font-semibold">{p.price ? p.price.toLocaleString() : '0'}</span>
                  </div>
                  <div className="w-full h-px bg-[#DCDDD2] my-4"></div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-nikou-textMuted text-[12px]">موجودی: {p.stockQuantity} {p.unit || 'عدد'}</span>
                    <span className="text-nikou-green text-[13px] font-medium group-hover:underline">مشاهده آگهی</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-nikou-dark py-16 w-full mt-10">
        <div className="max-w-360 mx-auto px-16 flex flex-col gap-10">
          <div className="flex justify-between items-center w-full">
            <span className="text-nikou-textLight text-[14px]">اصول بازار نیکو</span>
            <h2 className="text-[34px] font-semibold text-nikou-cream">چرا به نیکو اعتماد کنید؟</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#182720] p-6 rounded-lg flex flex-col items-end gap-3">
              <ShieldCheck size={26} className="text-nikou-greenLight" />
              <h3 className="font-semibold text-white text-[20px]">امنیت معاملات</h3>
              <p className="text-nikou-textLight text-[14px] leading-relaxed text-right">تمامی معاملات تحت نظارت قرار دارند و اطلاعات شما محافظت می‌شود.</p>
            </div>
            <div className="bg-[#182720] p-6 rounded-lg flex flex-col items-end gap-3">
              <Banknote size={26} className="text-nikou-greenLight" />
              <h3 className="font-semibold text-white text-[20px]">تضمین پرداخت</h3>
              <p className="text-nikou-textLight text-[14px] leading-relaxed text-right">پرداخت‌ها از طریق درگاه‌های امن انجام می‌شود و تا تحویل کالا نزد ما می‌ماند.</p>
            </div>
            <div className="bg-[#182720] p-6 rounded-lg flex flex-col items-end gap-3">
              <Contact size={26} className="text-nikou-greenLight" />
              <h3 className="font-semibold text-white text-[20px]">پشتیبانی ۲۴/۷</h3>
              <p className="text-nikou-textLight text-[14px] leading-relaxed text-right">تیم پشتیبانی ما در تمام ساعات شبانه‌روز آماده پاسخگویی به شماست.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-nikou-greenLight py-10">
        <div className="max-w-360 mx-auto px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-end gap-2 text-right">
            <h2 className="text-[27px] font-semibold text-nikou-dark">کالای مورد نظر خود را پیدا نکردید؟</h2>
            <p className="text-[16px] text-nikou-textMuted">درخواست خرید خود را ثبت کنید تا فروشندگان به شما پیشنهاد قیمت بدهند.</p>
          </div>
          <Link href="/dashboard/requests/new" className="bg-nikou-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 shrink-0">
            ثبت درخواست خرید
            <ClipboardList size={20} />
          </Link>
        </div>
      </section>

      <footer className="bg-nikou-dark text-white py-16">
        <div className="max-w-360 mx-auto px-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[25px] font-medium tracking-[3px]">NIKOU</span>
              <div className="w-px h-6 bg-nikou-green"></div>
              <span className="text-[33px] font-extrabold leading-none mt-2">نیکو</span>
            </div>
            <p className="text-nikou-textLight text-sm leading-relaxed max-w-md">
              بازارگاه جامع تجارت نیکو، بستری امن و حرفه‌ای برای اتصال خریداران و فروشندگان عمده در سراسر کشور است. ما با ارائه ابزارهای مدرن، تجارت شما را متحول می‌کنیم.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-nikou-textLight">
              <li><Link href="/about" className="hover:text-nikou-green transition-colors">درباره ما</Link></li>
              <li><Link href="/contact" className="hover:text-nikou-green transition-colors">تماس با ما</Link></li>
              <li><Link href="#" className="hover:text-nikou-green transition-colors">قوانین و مقررات</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">خدمات مشتریان</h4>
            <ul className="space-y-2 text-sm text-nikou-textLight">
              <li><Link href="#" className="hover:text-nikou-green transition-colors">پرسش‌های متداول</Link></li>
              <li><Link href="/guide/buy" className="hover:text-nikou-green transition-colors">راهنمای خرید امن</Link></li>
              <li><Link href="#" className="hover:text-nikou-green transition-colors">شرایط بازگشت کالا</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-360 mx-auto px-16 mt-12 pt-8 border-t border-white/10 text-center text-xs text-nikou-textMuted">
          تمامی حقوق مادی و معنوی این سایت متعلق به بازارگاه نیکو می‌باشد. © ۱۴۰۳
        </div>
      </footer>
    </div>
  );
}