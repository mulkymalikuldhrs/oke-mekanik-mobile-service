import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
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

// Loading spinner component for route guards
const RouteLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]" role="status" aria-label="Loading">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected route component using real auth
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <RouteLoadingSpinner />;
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// Role-based route guard
const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <RouteLoadingSpinner />;
  }
  
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return <Outlet />;
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
              <Route element={<RoleRoute allowedRoles={['customer', 'admin']} />}>
                <Route path="/customer/dashboard" element={<ErrorBoundary><CustomerDashboard /></ErrorBoundary>} />
                <Route path="/customer/booking" element={<ErrorBoundary><BookingPage /></ErrorBoundary>} />
                <Route path="/customer/tracking/:id" element={<ErrorBoundary><TrackingPage /></ErrorBoundary>} />
                <Route path="/customer/chat/:id" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
                <Route path="/customer/payment" element={<ErrorBoundary><PaymentPage /></ErrorBoundary>} />
              </Route>

              {/* Protected mechanic & workshop routes */}
              <Route element={<RoleRoute allowedRoles={['mechanic', 'workshop', 'admin']} />}>
                <Route path="/mechanic/dashboard" element={<ErrorBoundary><MechanicDashboard /></ErrorBoundary>} />
                <Route path="/workshop/dashboard" element={<ErrorBoundary><MechanicDashboard /></ErrorBoundary>} />
                <Route path="/mechanic/registration" element={<ErrorBoundary><MechanicRegistration /></ErrorBoundary>} />
                <Route path="/mechanic/chat/:id" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
              </Route>

              {/* Protected admin routes */}
              <Route element={<RoleRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
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
