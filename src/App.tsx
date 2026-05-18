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

const queryClient = new QueryClient();

// Protected route component using real auth
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
    {/* Global Sticky Navigation with Glassmorphism */}
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-[160px] supports-[backdrop-filter]:bg-black/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            O
          </div>
          <span className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            OKE MEKANIK <span className="text-[10px] font-medium text-blue-400 ml-1">v28.1</span>
          </span>
        </div>
      </div>
    </nav>

    {/* Main Content Area */}
    <main className="pt-16 pb-20">
      {children}
    </main>

    {/* Global Background Elements */}
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
    </div>
  </div>
);

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
