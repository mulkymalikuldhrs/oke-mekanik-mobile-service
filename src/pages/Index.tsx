import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, MapPin, Star, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'mechanic' | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer/dashboard');
      } else if (user.role === 'mechanic') {
        navigate('/mechanic/dashboard');
      }
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: t('feature.location.title'),
      description: t('feature.location.desc')
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: t('feature.realtime.title'),
      description: t('feature.realtime.desc')
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: t('feature.rating.title'),
      description: t('feature.rating.desc')
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: t('feature.verified.title'),
      description: t('feature.verified.desc')
    }
  ];

  const handleRoleSelection = (role: 'customer' | 'mechanic') => {
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer/dashboard');
      } else {
        navigate('/mechanic/dashboard');
      }
      return;
    }

    setSelectedRole(role);
    navigate('/login');
  };

  // Simple Badge component
  const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 sticky top-0 bg-black/40 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter italic">OKE MEKANIK</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <Button variant="outline" className="hidden sm:flex" onClick={() => navigate('/login')}>
            Masuk
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="text-center mb-16 space-y-6">
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1 mb-4 backdrop-blur-sm">
            #1 Bengkel Panggilan Indonesia
          </Badge>
          <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-tight tracking-tighter">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            {t('hero.subtitle')}
          </p>
          <div className="flex justify-center pt-4">
             <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all" onClick={() => navigate('/register')}>
               Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
             </Button>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
          <Card 
            className="group cursor-pointer overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-500"
            onClick={() => handleRoleSelection('customer')}
          >
            <div className="h-1 bg-gradient-to-r from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-10 text-center relative">
              <div className="bg-blue-500/10 p-6 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <Car className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {t('role.customer.title')}
              </h3>
              <p className="text-gray-400 mb-8 text-lg">
                {t('role.customer.desc')}
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 h-14 text-lg font-black rounded-2xl shadow-lg shadow-blue-500/20">
                {t('role.customer.button')}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl hover:bg-white/10 hover:border-orange-500/50 transition-all duration-500"
            onClick={() => handleRoleSelection('mechanic')}
          >
            <div className="h-1 bg-gradient-to-r from-orange-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-10 text-center">
              <div className="bg-orange-500/10 p-6 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <Wrench className="h-12 w-12 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {t('role.mechanic.title')}
              </h3>
              <p className="text-gray-400 mb-8 text-lg">
                {t('role.mechanic.desc')}
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-500 h-14 text-lg font-black rounded-2xl shadow-lg shadow-orange-500/20">
                {t('role.mechanic.button')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h3 className="text-4xl font-black text-center text-gray-900 mb-16">
            {t('features.title')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 bg-white p-12 rounded-3xl shadow-lg border">
          <div className="text-center">
            <p className="text-4xl font-black text-blue-600 mb-2">10k+</p>
            <p className="text-gray-600 font-medium">Pengguna Aktif</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-orange-600 mb-2">500+</p>
            <p className="text-gray-600 font-medium">Mitra Mekanik</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-green-600 mb-2">4.9</p>
            <p className="text-gray-600 font-medium">Rating Rata-rata</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-purple-600 mb-2">15m</p>
            <p className="text-gray-600 font-medium">Estimasi Tiba</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-900 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full" />
          <h3 className="text-4xl md:text-5xl font-black mb-6 relative z-10">
            {t('cta.title')}
          </h3>
          <p className="text-xl mb-10 opacity-80 max-w-2xl mx-auto relative z-10">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-10 text-lg font-bold"
              onClick={() => handleRoleSelection('customer')}
            >
              {t('cta.customer')}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 h-14 px-10 text-lg font-bold"
              onClick={() => handleRoleSelection('mechanic')}
            >
              {t('cta.mechanic')}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-4">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">OKE MEKANIK</h1>
            </div>
            <p className="text-gray-600 max-w-sm">
              Solusi terpercaya untuk segala kendala kendaraan Anda. Mekanik profesional, harga transparan, dan layanan cepat langsung ke lokasi.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Panggil Mekanik</li>
              <li>Servis Rutin</li>
              <li>Ganti Oli</li>
              <li>Emergency 24/7</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>support@okemekanik.com</li>
              <li>0800-1-OKEMEK</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t text-center text-gray-500 text-xs">
          © 2024 Oke Mekanik. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
