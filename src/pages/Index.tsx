
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
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'customer') {
        navigate('/customer/dashboard');
      } else if (user?.role === 'mechanic') {
        navigate('/mechanic/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

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
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">OKE MEKANIK</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <Button variant="outline" className="hidden sm:flex" onClick={() => navigate('/login')}>
            Masuk
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-16 space-y-6">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1 mb-4">
            #1 Bengkel Panggilan Indonesia
          </Badge>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
            className="group cursor-pointer overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500"
            onClick={() => handleRoleSelection('customer')}
          >
            <div className="h-2 bg-blue-600" />
            <CardContent className="p-10 text-center relative">
              <div className="bg-blue-50 p-6 rounded-2xl w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                <Car className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('role.customer.title')}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {t('role.customer.desc')}
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold">
                {t('role.customer.button')}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500"
            onClick={() => handleRoleSelection('mechanic')}
          >
            <div className="h-2 bg-orange-600" />
            <CardContent className="p-10 text-center">
              <div className="bg-orange-50 p-6 rounded-2xl w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-500">
                <Wrench className="h-12 w-12 text-orange-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('role.mechanic.title')}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {t('role.mechanic.desc')}
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-bold">
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

// Simple Badge component since it might not be in the UI components
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
);

export default Index;
