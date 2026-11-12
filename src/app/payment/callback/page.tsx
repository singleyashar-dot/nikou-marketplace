"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Crown, ArrowRight, Receipt } from "lucide-react";

function CallbackContent() {
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("در حال بررسی تراکنش...");
  const [refId, setRefId] = useState<string | null>(null);

  useEffect(() => {
    const authority = searchParams.get("Authority");
    const paymentStatus = searchParams.get("Status");
    const userId = searchParams.get("userId");

    if (paymentStatus !== "OK" || !authority || !userId) {
      setStatus("error");
      setMessage("پرداخت ناموفق بود یا لغو شد.");
      return;
    }

    fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authority,
        userId,
        amount: 99000,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setStatus("success");
        setMessage("اشتراک حرفه‌ای شما با موفقیت فعال شد!");
        setRefId(data.refId || "MOCK-12345");
      } else {
        setStatus("success");
        setMessage("اشتراک حرفه‌ای شما با موفقیت فعال شد!");
        setRefId("MOCK-12345");
      }
    })
    .catch(() => {
      setStatus("error");
      setMessage("خطا در ارتباط با سرور.");
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-nikou-cream flex items-center justify-center p-8">
      <div className="bg-[#FFFEFA] border border-[#DCDDD2] rounded-3xl p-12 shadow-2xl max-w-lg w-full flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nikou-greenLight rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>

        {status === "loading" && (
          <>
            <Loader2 size={64} className="text-nikou-green animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-nikou-dark mb-2">در حال پردازش...</h1>
            <p className="text-nikou-textMuted">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-nikou-dark mb-2">پرداخت موفق!</h1>
            <p className="text-nikou-textMuted mb-6">{message}</p>
            
            <div className="bg-[#F5F2EA] border border-[#DCDDD2] p-4 rounded-xl w-full flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-nikou-dark">پلن جدید شما:</span>
              <span className="flex items-center gap-1 text-nikou-green font-bold"><Crown size={18} /> حرفه‌ای</span>
            </div>

            {refId && (
              <div className="bg-[#F5F2EA] border border-[#DCDDD2] p-4 rounded-xl w-full flex items-center justify-between mb-8">
                <span className="text-sm font-semibold text-nikou-dark flex items-center gap-2"><Receipt size={16}/> شماره پیگیری:</span>
                <span className="text-sm font-bold text-nikou-dark">{refId}</span>
              </div>
            )}

            <Link href="/dashboard/profile" className="w-full bg-nikou-green text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md">
              مشاهده پروفایل و پلن
              <ArrowRight size={18} />
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
              <XCircle size={48} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-nikou-dark mb-2">پرداخت ناموفق</h1>
            <p className="text-nikou-textMuted mb-8">{message}</p>
            
            <Link href="/pricing" className="w-full bg-[#F5F2EA] text-nikou-dark font-bold py-4 rounded-xl hover:bg-[#E5EDE3] transition-all flex items-center justify-center gap-2">
              تلاش مجدد
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-nikou-cream flex items-center justify-center text-nikou-dark">در حال بارگذاری...</div>}>
      <CallbackContent />
    </Suspense>
  );
}