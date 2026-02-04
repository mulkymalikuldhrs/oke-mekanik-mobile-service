import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider } from "@/contexts/AuthContext";
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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
>>>>>>> origin/feat/project-revamp-10664209957500258455
=======
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399

const queryClient = new QueryClient();

// Mock authentication check
const useAuth = () => {
  // Replace with actual authentication logic
  return { isAuthenticated: true };
};

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="font-bold">Oke Mekanik</Link>
        <div>
          <Link to="/customer/dashboard" className="mr-4">Customer</Link>
          <Link to="/mechanic/dashboard" className="mr-4">Mechanic</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
    <main className="flex-grow">{children}</main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/booking" element={<BookingPage />} />
              <Route path="/customer/tracking" element={<TrackingPage />} />
              <Route path="/customer/chat" element={<ChatPage />} />
              <Route path="/customer/payment" element={<PaymentPage />} />
              <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
              <Route path="/mechanic/registration" element={<MechanicRegistration />} />
              <Route path="/mechanic/chat" element={<ChatPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
=======
    <LanguageProvider>
<<<<<<< HEAD
<<<<<<< HEAD
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route path="/" element={<Index />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/booking" element={<BookingPage />} />
                <Route path="/customer/tracking/:id" element={<TrackingPage />} />
                <Route path="/customer/chat/:id" element={<ChatPage />} />
                <Route path="/customer/payment" element={<PaymentPage />} />
                <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
                <Route path="/mechanic/registration" element={<MechanicRegistration />} />
                <Route path="/mechanic/chat/:id" element={<ChatPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
=======
=======
>>>>>>> origin/jules-9588893365322302084-daabd2d3
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/booking" element={<BookingPage />} />
              <Route path="/customer/tracking" element={<TrackingPage />} />
              <Route path="/customer/chat" element={<ChatPage />} />
              <Route path="/customer/payment" element={<PaymentPage />} />
              <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
              <Route path="/mechanic/registration" element={<MechanicRegistration />} />
              <Route path="/mechanic/chat" element={<ChatPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
<<<<<<< HEAD
>>>>>>> origin/feature/project-upgrade-and-integration-15484867582762648399
=======
>>>>>>> origin/jules-9588893365322302084-daabd2d3
    </LanguageProvider>
>>>>>>> origin/feat/project-revamp-10664209957500258455
  </QueryClientProvider>
);

export default App;
