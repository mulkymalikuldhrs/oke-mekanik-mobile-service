import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import MechanicDashboard from "./pages/MechanicDashboard";
import MechanicRegistration from "./pages/MechanicRegistration";
import BookingPage from "./pages/BookingPage";
import TrackingPage from "./pages/TrackingPage";
import ChatPage from "./pages/ChatPage";
import PaymentPage from "./pages/PaymentPage";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { Wrench, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const queryClient = new QueryClient();

// Protected route component using real auth
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/40 backdrop-blur-[160px]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter uppercase leading-none">OKE MEKANIK</span>
                <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Masterpiece v28.1</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-[10px] font-black tracking-widest uppercase border-l border-white/10 pl-6">
              <Link to="/customer/dashboard" className="text-white/50 hover:text-white transition-colors">Pelanggan</Link>
              <Link to="/mechanic/dashboard" className="text-white/50 hover:text-white transition-colors">Mekanik</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {user ? (
              <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-xs font-black uppercase tracking-tight">{user.name}</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{user.role}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="pt-20">{children}</main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected customer routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="/customer/booking" element={<BookingPage />} />
                  <Route path="/customer/tracking/:id" element={<TrackingPage />} />
                  <Route path="/customer/chat/:id" element={<ChatPage />} />
                  <Route path="/customer/payment" element={<PaymentPage />} />
                </Route>

                {/* Protected mechanic routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
                  <Route path="/mechanic/registration" element={<MechanicRegistration />} />
                  <Route path="/mechanic/chat/:id" element={<ChatPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
