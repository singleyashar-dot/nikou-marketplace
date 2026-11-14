"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, ClipboardList, 
  Plus, Search, UserCircle, X, CheckCircle2
} from "lucide-react";

export default function RequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [myListings, setMyListings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedListingId, setSelectedListingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchRequests = (id: string, role: string) => {
    fetch(`/api/requests?userId=${id}&role=${role}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRequests(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
    setCurrentUserId(id);
    setUserRole(role);

    if (!id) {
      router.push('/login');
      return;
    }

    fetch(`/api/profile?userId=${id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setIsVerified(data.isVerified || false);
          setDisplayName(data.displayName || 'کاربر نیکو');
          setAvatarUrl(data.avatarUrl || '');
        }
      })
      .catch(() => {});

    fetchRequests(id, role || 'BUYER');

    if (role === 'SELLER') {
      fetch('/api/products', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setMyListings(data.filter((p: any) => p.sellerId === id));
          }
        }).catch(() => {});
    }
  }, [router]);

  const handleSendOffer = async () => {
    if (!selectedListingId) return alert("لطفا یکی از کالاهای خود را انتخاب کنید.");
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/requests/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: selectedRequest.id, listingId: selectedListingId })
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setSuccessMessage("✅ پیشنهاد شما با موفقیت ارسال شد.");
        
        if (currentUserId && userRole) {
          fetchRequests(currentUserId, userRole);
        }
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        alert("❌ " + (data.error || "خطا در ارسال پیشنهاد"));
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
      setSelectedListingId("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const switchRole = async () => {
    const currentRole = localStorage.getItem('nikou_user_role') || 'BUYER';
    const nextRole = currentRole === 'SELLER' ? 'BUYER' : 'SELLER';
    
    if (currentUserId) {
      await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, role: nextRole })
      });
      localStorage.setItem('nikou_user_role', nextRole);
      window.location.reload(); 
    }
  };

  const filteredRequests = requests.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 👈 فیلتر کردن کالاهای فروشنده بر اساس دسته‌بندی درخواست
  const availableListings = selectedRequest?.categoryId 
    ? myListings.filter(l => l.categoryId === selectedRequest.categoryId)
    : myListings;

  return (
    <div className="flex h-screen bg-nikou-cream font-sans" dir="rtl">
      
      <aside className="w-64 bg-nikou-dark text-white flex flex-col shadow-2xl z-20 hidden md:flex shrink-0">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[20px] font-medium tracking-[2px] text-white">NIKOU</span>
            <div className="w-px h-5 bg-nikou-green"></div>
            <span className="text-[28px] font-extrabold text-white leading-none mt-1">نیکو</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <BarChart3 size={20} /><span className="text-sm">داشبورد</span>
          </Link>
          {userRole === 'SELLER' && (
            <>
              <Link href="/dashboard/products" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
                <Package size={20} /><span className="text-sm">مدیریت کالاها</span>
              </Link>
              <Link href="/dashboard/verification" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
                <ShieldCheck size={20} /><span className="text-sm">احراز هویت</span>
              </Link>
            </>
          )}
          <Link href="/dashboard/orders" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ShoppingCart size={20} /><span className="text-sm">{userRole === 'SELLER' ? 'سفارشات دریافتی' : 'سفارشات من'}</span>
          </Link>
          <Link href="/dashboard/requests" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <ClipboardList size={20} className="text-nikou-green" /><span className="font-semibold text-sm">{userRole === 'SELLER' ? 'درخواست‌های بازار' : 'درخواست‌های خرید من'}</span>
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <MessageSquare size={20} /><span className="text-sm">پیام‌ها</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <UserCircle size={20} /><span className="text-sm">پروفایل من</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="w-10 h-10 bg-nikou-green rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={20} />}
            </div>
            <div>
              <p className="text-sm font-bold flex items-center gap-1">
                {displayName}
                {userRole === 'SELLER' && isVerified && <span className="text-blue-400 text-xs">✔️</span>}
              </p>
              <p className="text-xs text-nikou-textLight mt-1">{userRole === 'SELLER' ? 'فروشنده' : 'خریدار'}</p>
            </div>
          </div>

          <button onClick={switchRole} className="flex items-center justify-center gap-2 w-full bg-nikou-green hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl transition-all font-semibold text-xs">
            <RefreshCw size={14} /><span>{userRole === 'SELLER' ? "ورود به پنل خریدار" : "ورود به پنل فروشنده"}</span>
          </button>
          
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2.5 rounded-xl transition-all font-medium text-xs">
            <LogOut size={14} /><span>خروج از حساب</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 shrink-0 relative">
          <h1 className="text-2xl font-bold text-nikou-dark flex items-center gap-2">
            <ClipboardList size={24} className="text-nikou-green" />
            {userRole === 'SELLER' ? 'درخواست‌های بازار' : 'درخواست‌های خرید من'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="جستجوی درخواست..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-nikou-cream rounded-xl border border-[#DCDDD2] outline-none focus:border-nikou-green transition-all"
              />
              <Search size={18} className="absolute left-3 top-3 text-nikou-textMuted" />
            </div>
            {userRole === 'BUYER' && (
              <Link href="/dashboard/requests/new" className="bg-nikou-green text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md">
                <Plus size={18} /> ثبت درخواست جدید
              </Link>
            )}
          </div>

          {successMessage && (
            <div className="absolute top-full right-8 mt-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2 animate-bounce z-50">
              <CheckCircle2 size={18} />
              {successMessage}
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-20 text-nikou-textMuted">در حال دریافت درخواست‌ها...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="col-span-full bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl text-center py-20 text-nikou-textMuted flex flex-col items-center gap-3">
                <ClipboardList size={48} className="text-nikou-green opacity-20" />
                <p>هیچ درخواستی یافت نشد.</p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div key={req.id} className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-2 h-full bg-nikou-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="bg-[#F5F2EA] text-nikou-dark px-3 py-1 rounded-lg text-xs font-semibold w-fit">
                        {req.quantity} {req.unit}
                      </span>
                      <span className="text-[11px] text-nikou-green font-bold bg-[#E8EFE6] px-2 py-0.5 rounded w-fit">{req.categoryName}</span>
                    </div>
                    <span className="text-[11px] text-nikou-textMuted">
                      {new Date(req.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-bold text-nikou-dark mb-2">{req.title}</h3>
                    <p className="text-sm text-[#59675E] leading-relaxed line-clamp-3">{req.description || 'بدون توضیحات'}</p>
                  </div>

                  {userRole === 'BUYER' && req.matches && req.matches.length > 0 && (
                    <div className="mt-2 pt-4 border-t border-[#DCDDD2]">
                      <p className="text-xs font-bold text-nikou-textMuted mb-3 flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-nikou-green" /> پیشنهادهای دریافتی:
                      </p>
                      <div className="flex flex-col gap-2">
                        {req.matches.map((match: any) => (
                          <div key={match.id} className="flex justify-between items-center bg-[#F5F2EA] p-3 rounded-xl border border-[#DCDDD2]">
                            <div className="flex items-center gap-3">
                              {match.listing?.media?.[0]?.url ? (
                                <img src={match.listing.media[0].url} className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center"><Package size={16} /></div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-nikou-dark truncate max-w-[120px]">{match.listing?.title}</span>
                                <span className="text-[11px] text-nikou-textMuted">از طرف {match.listing?.seller?.profile?.displayName || match.listing?.seller?.email}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-nikou-green font-bold text-sm">{match.listing?.price?.toLocaleString()} تومان</span>
                              <Link href={`/products/${match.listing?.id}`} className="text-[10px] text-blue-500 hover:underline">مشاهده کالا</Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="w-full h-px bg-[#DCDDD2] my-2"></div>

                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs">
                        {req.buyerName.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-nikou-dark">{req.buyerName}</span>
                    </div>
                    {userRole === 'SELLER' && (
                      <button 
                        onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                        className="bg-[#E8EFE6] text-nikou-green hover:bg-nikou-green hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        ارسال پیشنهاد
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* مودال ارسال پیشنهاد */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 left-4 text-nikou-textMuted hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-nikou-dark mb-2">ارسال پیشنهاد</h2>
            <p className="text-sm text-nikou-textMuted mb-6">برای درخواست: <span className="font-bold text-nikou-dark">{selectedRequest?.title}</span></p>
            
            {/* 👈 اینجا فیلتر اعمال شده است */}
            {availableListings.length === 0 ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex flex-col gap-2">
                <p>شما هیچ کالایی در دسته‌بندی «{selectedRequest?.categoryName}» ندارید. برای ارسال پیشنهاد ابتدا باید یک کالا در این دسته‌بندی ثبت کنید.</p>
                <Link href="/dashboard/products/new" className="text-blue-500 hover:underline font-bold">ثبت کالای جدید</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-nikou-dark">کالای خود را برای این درخواست انتخاب کنید:</label>
                <select 
                  value={selectedListingId} 
                  onChange={e => setSelectedListingId(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#DCDDD2] bg-[#F5F2EA] text-sm focus:outline-none focus:border-nikou-green"
                >
                  <option value="">انتخاب کنید...</option>
                  {availableListings.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.title} ({l.price?.toLocaleString()} تومان)</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-[#DCDDD2] text-nikou-dark text-sm font-semibold hover:bg-gray-50">انصراف</button>
              <button 
                onClick={handleSendOffer} 
                disabled={isSubmitting || availableListings.length === 0}
                className="bg-nikou-green text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "در حال ارسال..." : "ارسال پیشنهاد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}