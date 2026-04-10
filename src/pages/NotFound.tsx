import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="text-center relative z-10 max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl">
          <div className="bg-red-500/10 p-6 rounded-full w-fit mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertCircle className="h-20 w-20 text-red-500" />
          </div>
          <h1 className="text-8xl font-black text-white italic tracking-tighter mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-300 uppercase tracking-widest mb-8">{t('notfound.title')}</h2>
          <p className="text-gray-500 mb-10 italic">
            {t('notfound.desc')}
          </p>
          <Button
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('notfound.back')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
