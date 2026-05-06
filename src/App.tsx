import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
=======
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
>>>>>>> jules-1751083910730374172-8e0c37a0
      </div>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

<<<<<<< HEAD
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Oke Mekanik</Link>
        <div className="flex gap-4">
          <Link to="/customer/dashboard" className="hover:text-gray-300">Pelanggan</Link>
          <Link to="/mechanic/dashboard" className="hover:text-gray-300">Mekanik</Link>
        </div>
      </div>
    </nav>
    <main className="flex-grow">{children}</main>
  </div>
);

=======
>>>>>>> jules-1751083910730374172-8e0c37a0
const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
<<<<<<< HEAD
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
=======
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
>>>>>>> jules-1751083910730374172-8e0c37a0
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
