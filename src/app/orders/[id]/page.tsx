"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BuyerOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userId = localStorage.getItem('nikou_user_id');
    const role = localStorage.getItem('nikou_user_role');
    setCurrentUserId(userId);

    if (orderId && userId && role) {
      Promise.all([
        // ارسال شناسه کاربر به API سفارشات
        fetch(`/api/orders?userId=${userId}&role=${role}`).then(res => res.json()),
        fetch(`/api/messages?orderId=${orderId}`).then(res => res.json())
      ]).then(([ordersData, msgsData]) => {
        if (Array.isArray(ordersData)) {
          const foundOrder = ordersData.find((o: any) => o.id === orderId);
          setOrder(foundOrder);
        }
        if (Array.isArray(msgsData)) setMessages(msgsData);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !orderId || !order || !currentUserId) return;

    const tempMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUserId,
      receiverId: order.sellerId,
      createdAt: new Date().toISOString()
    };

    setMessages([...messages, tempMessage]);
    setNewMessage("");

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          content: tempMessage.content,
          senderId: tempMessage.senderId,
          receiverId: tempMessage.receiverId
        }),
      });
    } catch (error) {
      alert("خطا در ارسال پیام");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">در حال بارگذاری...</div>;
  
  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500 gap-4">
      <p className="text-xl font-bold">سفارش یافت نشد.</p>
      <Link href="/dashboard" className="bg-emerald-600 text-white px-6 py-2 rounded-lg mt-4">بازگشت به داشبورد</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col" dir="rtl">
      
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-emerald-600">NIKOU</Link>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-slate-500 hover:text-slate-800 font-medium">بازگشت به داشبورد</button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        {/* خلاصه سفارش */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {order.items?.[0]?.listing?.media?.[0]?.url ? (
              <img src={order.items[0].listing.media[0].url} alt="کالا" className="w-16 h-16 object-cover rounded-xl border" />
            ) : (
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">بدون عکس</div>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-800">{order.items?.[0]?.listing?.title || "کالا"}</h2>
              <p className="text-sm text-slate-500 mt-1">تعداد: {order.items?.[0]?.quantity || 1} {order.snapshotUnit || 'عدد'}</p>
            </div>
          </div>
          <div>
            <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
              order.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 
              order.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {order.status === 'ACCEPTED' ? 'تایید شده' : order.status === 'REJECTED' ? 'رد شده' : 'در انتظار تایید'}
            </span>
          </div>
        </div>

        {/* محیط چت */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[400px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 text-sm">گفتگو با فروشنده</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 text-sm mt-10">هنوز پیامی رد و بدل نشده است.</div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm ${
                      isMine 
                        ? 'bg-emerald-600 text-white rounded-tr-sm' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                    }`}>
                      <p>{msg.content}</p>
                      <span className={`text-[10px] block mt-1.5 ${isMine ? 'text-emerald-100 text-left' : 'text-slate-400 text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 px-4 py-3 text-sm bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md">
                ارسال
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}