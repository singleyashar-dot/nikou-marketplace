"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Package, UploadCloud, X, Loader2 } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // استیت‌های فرم
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("عدد");
  const [stockQuantity, setStockQuantity] = useState("");
  const [categoryId, setCategoryId] = useState(""); 
  
  // استیت‌های عکس
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch('/api/categories', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/products', { cache: 'no-store' }).then(res => res.json())
    ]).then(([catsData, productsData]) => {
      if (Array.isArray(catsData)) setCategories(catsData);
      
      if (Array.isArray(productsData)) {
        const product = productsData.find(p => p.id === id);
        if (product) {
          setTitle(product.title || "");
          setDescription(product.description || "");
          setPrice(product.price?.toString() || "");
          setUnit(product.unit || "عدد");
          setStockQuantity(product.stockQuantity?.toString() || "");
          setCategoryId(product.categoryId || "");
          if (product.media && product.media.length > 0) {
            setImagePreview(product.media[0].url);
          }
        }
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      let uploadedImageUrl = imagePreview;

      // آپلود عکس جدید در صورت انتخاب
      if (imageFile) {
        setMessage("در حال آپلود عکس جدید...");
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "خطا در آپلود عکس");
        
        uploadedImageUrl = uploadData.url;
      }

      setMessage("در حال ذخیره تغییرات...");

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          description,
          price: Number(price),
          unit,
          stockQuantity: Number(stockQuantity),
          categoryId,
          imageUrl: uploadedImageUrl 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ تغییرات با موفقیت ذخیره شد! در حال انتقال...");
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1500);
      } else {
        setMessage("❌ " + (data.error || "خطا در ویرایش کالا"));
      }
    } catch (error: any) {
      setMessage("❌ " + (error.message || "خطا در ارتباط با سرور"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nikou-cream text-nikou-textMuted">
        <Loader2 className="animate-spin mr-2" /> در حال دریافت اطلاعات کالا...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nikou-cream font-sans flex flex-col" dir="rtl">
      
      <header className="bg-[#FFFEFA] border-b border-[#DCDDD2] sticky top-0 z-50 h-24 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
          <Link href="/dashboard/products" className="flex items-center gap-2 text-nikou-textMuted hover:text-nikou-dark transition-colors">
            <ArrowRight size={20} />
            <span className="font-semibold text-sm">انصراف و بازگشت</span>
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
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-nikou-dark">ویرایش کالا</h1>
              <p className="text-sm text-nikou-textMuted mt-1">تغییرات مورد نظر را اعمال کنید.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-nikou-dark">عنوان کالا *</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-nikou-dark">دسته‌بندی *</label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]"
              >
                <option value="">بدون دسته‌بندی</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-nikou-dark">توضیحات</label>
              <textarea 
                rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors resize-none bg-[#F5F2EA]"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">قیمت (تومان) *</label>
                <input 
                  type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]" 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">واحد شمارش *</label>
                <input 
                  type="text" required value={unit} onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-nikou-dark">موجودی *</label>
                <input 
                  type="number" required value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] text-sm focus:outline-none focus:border-nikou-green transition-colors bg-[#F5F2EA]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-nikou-dark">عکس کالا</label>
              
              {imagePreview ? (
                <div className="relative w-full h-64 border border-[#DCDDD2] rounded-xl overflow-hidden bg-[#F5F2EA]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#DCDDD2] rounded-xl p-8 flex flex-col items-center justify-center text-nikou-textMuted bg-[#F5F2EA]/50 cursor-pointer hover:bg-[#F5F2EA] transition-colors">
                  <UploadCloud size={32} className="mb-3 opacity-50" />
                  <p className="text-sm font-semibold">برای انتخاب عکس جدید کلیک کنید</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-nikou-green text-white font-semibold text-[16px] py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-md mt-4 disabled:opacity-50"
            >
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}