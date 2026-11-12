"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BarChart3, Package, ShoppingCart, MessageSquare, 
  LogOut, RefreshCw, ShieldCheck, User, Send,
  MessageCircle, UserCircle, ClipboardList
} from "lucide-react";

export default function MessagesPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
    setCurrentUserId(id);
    setUserRole(role);

    if (id) {
      fetch(`/api/profile?userId=${id}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && data.isVerified) setIsVerified(true);
          if (data && data.displayName) setDisplayName(data.displayName);
          if (data && data.avatarUrl) setAvatarUrl(data.avatarUrl);
        })
        .catch(() => {});
    }

    if (id && role) {
      fetch(`/api/orders?userId=${id}&role=${role}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOrders(data);
            if (data.length > 0) setSelectedOrder(data[0]);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      fetch(`/api/messages?orderId=${selectedOrder.id}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data);
        });
    }
  }, [selectedOrder]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedOrder || !currentUserId) return;

    const receiverId = userRole === 'SELLER' ? selectedOrder.buyerId : selectedOrder.sellerId;
    
    const tempMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUserId,
      receiverId: receiverId,
      createdAt: new Date().toISOString()
    };

    setMessages([...messages, tempMessage]);
    setNewMessage("");

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          content: tempMessage.content,
          senderId: tempMessage.senderId,
          receiverId: tempMessage.receiverId
        }),
      });
    } catch (error) {
      alert("خطا در ارسال پیام");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const switchRole = async () => {
    const currentRole = localStorage.getItem('nikou_user_role') || 'BUYER';
    const nextRole = currentRole === 'SELLER' ? 'BUYER' : 'SELLER';
    const currentId = localStorage.getItem('nikou_user_id');

    if (currentId) {
      await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentId, role: nextRole })
      });
      localStorage.setItem('nikou_user_role', nextRole);
      window.location.reload(); 
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-nikou-textMuted bg-nikou-cream">در حال بارگذاری...</div>;

  return (
    <div className="flex h-screen bg-nikou-cream font-sans overflow-hidden" dir="rtl">
      
      {/* سایدبار */}
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
          <Link href="/dashboard/requests" className="flex items-center gap-3 text-nikou-textLight hover:bg-white/5 hover:text-white px-4 py-3 rounded-xl transition-colors">
            <ClipboardList size={20} /><span className="text-sm">{userRole === 'SELLER' ? 'درخواست‌های بازار' : 'درخواست‌های خرید من'}</span>
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 bg-white/10 text-white px-4 py-3 rounded-xl cursor-pointer">
            <MessageSquare size={20} className="text-nikou-green" /><span className="font-semibold text-sm">پیام‌ها</span>
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
                {displayName || 'کاربر نیکو'}
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

      {/* بخش اصلی چت */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* لیست گفتگوها */}
        <div className="w-80 bg-[#FFFEFA] border-l border-[#DCDDD2] flex flex-col shrink-0 hidden sm:flex">
          <div className="h-24 border-b border-[#DCDDD2] flex items-center px-6 bg-[#FFFEFA]">
            <h2 className="text-xl font-bold text-nikou-dark flex items-center gap-2">
              <MessageCircle size={22} className="text-nikou-green" />
              گفتگوها
            </h2>
          </div>
          
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {orders.length === 0 ? (
              <div className="text-center text-nikou-textMuted mt-10 text-sm">هیچ گفتگویی یافت نشد.</div>
            ) : (
              orders.map((o) => {
                const firstItem = o.items && o.items.length > 0 ? o.items[0] : null;
                const listing = firstItem ? firstItem.listing : null;
                const mediaUrl = listing && listing.media && listing.media.length > 0 ? listing.media[0].url : null;
                const isSelected = selectedOrder?.id === o.id;

                return (
                  <div 
                    key={o.id} 
                    onClick={() => setSelectedOrder(o)}
                    className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                      isSelected 
                        ? 'bg-[#E8EFE6] border-nikou-green shadow-sm' 
                        : 'bg-[#F5F2EA] border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-[#DCDDD2] shrink-0">
                      {mediaUrl ? (
                        <img src={mediaUrl} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} className="text-nikou-green opacity-40" />
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <h3 className="font-bold text-nikou-dark text-sm truncate">{listing?.title || "کالا"}</h3>
                      <span className="text-[11px] text-nikou-textMuted mt-1">سفارش #{o.id.slice(0, 6)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* محیط چت */}
        <div className="flex-1 flex flex-col bg-[#F5F2EA] relative">
          {selectedOrder ? (
            <>
              <div className="h-24 bg-[#FFFEFA] border-b border-[#DCDDD2] flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8EFE6] rounded-xl flex items-center justify-center border border-[#DCDDD2]">
                    <Package size={24} className="text-nikou-green" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold text-nikou-dark text-lg">{selectedOrder.items?.[0]?.listing?.title || "کالا"}</h2>
                    <span className="text-xs text-nikou-textMuted mt-1">شناسه سفارش: #{selectedOrder.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-5">
                {messages.length === 0 ? (
                  <div className="text-center text-nikou-textMuted text-sm mt-20 bg-[#FFFEFA] p-6 rounded-2xl max-w-sm mx-auto border border-[#DCDDD2]">
                    هنوز پیامی رد و بدل نشده است. اولین پیام را بفرستید!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-[14px] shadow-sm ${
                          isMine 
                            ? 'bg-nikou-green text-white rounded-tr-sm' 
                            : 'bg-[#FFFEFA] text-nikou-dark border border-[#DCDDD2] rounded-tl-sm'
                        }`}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <span className={`text-[10px] block mt-2 text-left ${isMine ? 'text-emerald-100' : 'text-nikou-textMuted'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-5 bg-[#FFFEFA] border-t border-[#DCDDD2] shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 px-5 py-4 text-sm bg-[#F5F2EA] rounded-xl border border-[#DCDDD2] outline-none focus:border-nikou-green transition-all"
                  />
                  <button type="submit" className="bg-nikou-green hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2">
                    <Send size={18} />
                    <span className="hidden sm:block">ارسال</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-nikou-textMuted gap-4">
              <MessageCircle size={64} className="text-nikou-green opacity-20" />
              <p className="text-lg">برای مشاهده گفتگو، یک مورد را از لیست انتخاب کنید.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}