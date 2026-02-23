import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, MapPin, Star, Users, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white overflow-x-hidden font-sans">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[140px] rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/20 blur-[140px] rounded-full"
        />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 sticky top-0 bg-black/60 backdrop-blur-2xl z-50 border-b border-white/5">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 space-y-8"
        >
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-6 py-2 mb-4 backdrop-blur-md text-sm tracking-widest uppercase font-black">
            #1 Future of Maintenance
          </Badge>
          <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 leading-[0.9] tracking-tighter italic">
            {t('hero.title')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium tracking-tight">
            {t('hero.subtitle')}
          </p>
          <div className="flex justify-center pt-8">
             <Button size="lg" className="bg-blue-600 hover:bg-blue-500 h-16 px-10 text-xl font-black rounded-2xl shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 group" onClick={() => navigate('/register')}>
               START NOW <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
             </Button>
          </div>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-10 mb-32 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card
              className="group cursor-pointer overflow-hidden border border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-2xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-700 rounded-[3rem]"
              onClick={() => handleRoleSelection('customer')}
            >
              <div className="h-1.5 bg-gradient-to-r from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-12 text-center relative">
                <div className="bg-blue-500/10 p-8 rounded-[2rem] w-28 h-28 mx-auto mb-10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl shadow-blue-500/10 border border-blue-500/20">
                  <Car className="h-14 w-14 text-blue-400" />
                </div>
                <h3 className="text-4xl font-black text-white mb-6 tracking-tight italic uppercase">
                  {t('role.customer.title')}
                </h3>
                <p className="text-gray-400 mb-10 text-xl font-medium tracking-tight">
                  {t('role.customer.desc')}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 h-16 text-xl font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all group">
                  {t('role.customer.button')}
                  <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card
              className="group cursor-pointer overflow-hidden border border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-2xl hover:bg-white/[0.08] hover:border-orange-500/30 transition-all duration-700 rounded-[3rem]"
              onClick={() => handleRoleSelection('mechanic')}
            >
              <div className="h-1.5 bg-gradient-to-r from-orange-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-12 text-center">
                <div className="bg-orange-500/10 p-8 rounded-[2rem] w-28 h-28 mx-auto mb-10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700 shadow-2xl shadow-orange-500/10 border border-orange-500/20">
                  <Wrench className="h-14 w-14 text-orange-400" />
                </div>
                <h3 className="text-4xl font-black text-white mb-6 tracking-tight italic uppercase">
                  {t('role.mechanic.title')}
                </h3>
                <p className="text-gray-400 mb-10 text-xl font-medium tracking-tight">
                  {t('role.mechanic.desc')}
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-500 h-16 text-xl font-black rounded-2xl shadow-xl shadow-orange-600/20 transition-all group">
                  {t('role.mechanic.button')}
                  <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h3 className="text-4xl font-black text-center text-white mb-16">
            {t('features.title')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-white/10 shadow-2xl hover:border-blue-500/50 transition-all duration-500 bg-white/5 backdrop-blur-2xl">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 bg-white/5 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl border border-white/10">
          <div className="text-center">
            <p className="text-4xl font-black text-blue-400 mb-2">10k+</p>
            <p className="text-gray-400 font-medium">Pengguna Aktif</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-orange-400 mb-2">500+</p>
            <p className="text-gray-400 font-medium">Mitra Mekanik</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-green-400 mb-2">4.9</p>
            <p className="text-gray-400 font-medium">Rating Rata-rata</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-purple-400 mb-2">15m</p>
            <p className="text-gray-400 font-medium">Estimasi Tiba</p>
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
      <footer className="bg-black/80 border-t border-white/10 py-12 px-4 relative z-10">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight italic">OKE MEKANIK</h1>
            </div>
            <p className="text-gray-400 max-w-sm">
              Solusi terpercaya untuk segala kendala kendaraan Anda. Mekanik profesional, harga transparan, dan layanan cepat langsung ke lokasi.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Layanan</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Panggil Mekanik</li>
              <li>Servis Rutin</li>
              <li>Ganti Oli</li>
              <li>Emergency 24/7</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Hubungi Kami</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>support@okemekanik.com</li>
              <li>0800-1-OKEMEK</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2024 Oke Mekanik. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
