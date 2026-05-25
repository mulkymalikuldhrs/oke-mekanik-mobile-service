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
import AdminDashboard from "./pages/AdminDashboard";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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

              {/* Protected mechanic & workshop routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
                <Route path="/workshop/dashboard" element={<MechanicDashboard />} />
                <Route path="/mechanic/registration" element={<MechanicRegistration />} />
                <Route path="/mechanic/chat/:id" element={<ChatPage />} />
              </Route>

              {/* Protected admin routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
