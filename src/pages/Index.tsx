import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, MapPin, Star, Users, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

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
      icon: <MapPin className="h-8 w-8 text-blue-500" />,
      title: t('feature.location.title'),
      description: t('feature.location.desc')
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: t('feature.realtime.title'),
      description: t('feature.realtime.desc')
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: t('feature.rating.title'),
      description: t('feature.rating.desc')
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: t('feature.verified.title'),
      description: t('feature.verified.desc')
    }
  ];

  const handleRoleSelection = (role: 'customer' | 'mechanic') => {
    if (user) {
      navigate(user.role === 'customer' ? '/customer/dashboard' : '/mechanic/dashboard');
      return;
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[160px] rounded-full" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 sticky top-0 bg-black/40 backdrop-blur-[40px] z-50 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-2.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            OKE MEKANIK
          </h1>
        </motion.div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex"
            onClick={() => navigate('/login')}
          >
            Masuk
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            onClick={() => navigate('/register')}
          >
            Daftar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6"
          >
            <ShieldCheck className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-100">#1 Bengkel Panggilan Indonesia v27</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight"
          >
            Bengkel <span className="text-blue-500 italic">Masa Depan</span><br />
            Dalam Genggaman.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
          >
             <Button
               size="lg"
               className="bg-blue-600 hover:bg-blue-500 h-16 px-10 text-lg font-bold rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] group"
               onClick={() => navigate('/register')}
             >
               PANGGIL SEKARANG <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
             </Button>
             <Button
               size="lg"
               variant="outline"
               className="border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl h-16 px-10 text-lg font-bold rounded-2xl"
               onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
             >
               PELAJARI LEBIH LANJUT
             </Button>
          </motion.div>
        </div>

        {/* Role Selection */}
        <div className="grid lg:grid-cols-2 gap-10 mb-40 max-w-6xl mx-auto">
          <motion.div
            whileHover={{ y: -10 }}
            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-blue-500/20 to-transparent"
          >
            <div className="bg-black/60 backdrop-blur-[40px] border border-white/10 p-12 rounded-[2.4rem] h-full transition-colors group-hover:bg-black/40">
              <div className="bg-blue-500/10 p-6 rounded-3xl w-24 h-24 mb-10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                <Car className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-4xl font-black mb-6">{t('role.customer.title')}</h3>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">{t('role.customer.desc')}</p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 h-14 rounded-2xl text-lg font-bold"
                onClick={() => handleRoleSelection('customer')}
              >
                MULAI SEBAGAI PELANGGAN
              </Button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-orange-500/20 to-transparent"
          >
            <div className="bg-black/60 backdrop-blur-[40px] border border-white/10 p-12 rounded-[2.4rem] h-full transition-colors group-hover:bg-black/40">
              <div className="bg-orange-500/10 p-6 rounded-3xl w-24 h-24 mb-10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <Wrench className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-4xl font-black mb-6">{t('role.mechanic.title')}</h3>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">{t('role.mechanic.desc')}</p>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-500 h-14 rounded-2xl text-lg font-bold"
                onClick={() => handleRoleSelection('mechanic')}
              >
                MULAI SEBAGAI MITRA
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mb-40">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-black mb-6">MENGAPA OKE MEKANIK?</h3>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors"
              >
                <div className="mb-6">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-40 p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-2xl">
          {[
            { label: 'PENGGUNA AKTIF', value: '50K+', color: 'text-blue-500' },
            { label: 'MITRA MEKANIK', value: '2.5K+', color: 'text-orange-500' },
            { label: 'RATING LAYANAN', value: '4.9/5', color: 'text-yellow-500' },
            { label: 'REPAIR TIME', value: '<45m', color: 'text-green-500' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}>{stat.value}</p>
              <p className="text-xs font-bold tracking-widest text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="relative rounded-[4rem] p-12 md:p-24 overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black to-orange-900/20" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <Zap className="h-12 w-12 text-blue-500 mx-auto mb-8 animate-bounce" />
            <h3 className="text-5xl md:text-7xl font-black mb-8 leading-tight">SIAP UNTUK PERJALANAN MULUS?</h3>
            <p className="text-xl text-gray-400 mb-12 italic">"The only platform where technology meets mechanical mastery."</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-16 px-12 rounded-2xl text-xl font-black">
                MASUK SEKARANG
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 h-16 px-12 rounded-2xl text-xl font-black">
                JADI MITRA
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-20 px-6 bg-black/60 relative z-10">
        <div className="container mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter">OKE MEKANIK</h1>
            </div>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed">
              Platform revolusioner yang mendefinisikan ulang standar perawatan kendaraan di Indonesia. Kecepatan, Kepercayaan, dan Keunggulan.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black tracking-widest text-white/40 mb-6 uppercase">Ekosistem</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">AI Diagnostic</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Fleet Management</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Emergency Hub</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">Roadside Assist</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black tracking-widest text-white/40 mb-6 uppercase">Global Support</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li>HQ: Jakarta, ID</li>
              <li>24/7 Hotline: 0800-MEKANIK</li>
              <li>support@okemekanik.v27.ai</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center text-gray-600 text-sm">
          <p>© 2024 OKE MEKANIK MASTERPIECE v27. ENGINEERED FOR EXCELLENCE.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <span>Privacy Protocol</span>
            <span>Service Terms</span>
            <span>Neural Ethics</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
