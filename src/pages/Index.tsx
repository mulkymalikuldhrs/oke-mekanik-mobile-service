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
  const [systemStatus, setSystemStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${apiUrl}/health`);
        if (res.ok) setSystemStatus('online');
        else setSystemStatus('offline');
      } catch {
        setSystemStatus('offline');
      }
    };
    checkSystem();
    const interval = setInterval(checkSystem, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer/dashboard');
      } else if (user.role === 'mechanic') {
        navigate('/mechanic/dashboard');
      } else if (user.role === 'workshop') {
        navigate('/workshop/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
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
      <header className="flex justify-between items-center p-6 sticky top-0 bg-black/40 backdrop-blur-[160px] z-50 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-2.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            OKE MEKANIK v28.1
          </h1>
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/30 text-[10px] font-black text-blue-400 tracking-widest uppercase">
              v5.8.1 ULTIMATE+
            </span>
            <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full border ${
              systemStatus === 'online' ? 'bg-green-500/10 border-green-500/30' :
              systemStatus === 'offline' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                systemStatus === 'online' ? 'bg-green-500 animate-pulse' :
                systemStatus === 'offline' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${
                systemStatus === 'online' ? 'text-green-400' :
                systemStatus === 'offline' ? 'text-red-400' : 'text-gray-500'
              }`}>
                {systemStatus === 'online' ? 'System Live' : systemStatus === 'offline' ? 'System Down' : 'Checking'}
              </span>
            </div>
          </div>
        </motion.div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex"
            onClick={() => navigate('/login')}
          >
            {t('nav.login')}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            onClick={() => navigate('/register')}
          >
            {t('nav.register')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-[160px] mb-6"
          >
            <ShieldCheck className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-100">{t('landing.badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight text-white"
          >
            {t('hero.title.v28')}
            <span className="block text-3xl md:text-4xl mt-4 text-blue-500 font-bold tracking-normal italic uppercase">
              {t('common.analyzing')}
            </span>
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
               {t('common.call_now')} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
             </Button>
             <Button
               size="lg"
               variant="outline"
               className="border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-[160px] h-16 px-10 text-lg font-bold rounded-2xl"
               onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
             >
               {t('common.learn_more')}
             </Button>
          </motion.div>
        </div>

        {/* Role Selection */}
        <div className="grid lg:grid-cols-2 gap-10 mb-40 max-w-6xl mx-auto">
          <motion.div
            whileHover={{ y: -10 }}
            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-blue-500/20 to-transparent"
          >
            <div className="glass-card p-12 rounded-[2.4rem] h-full transition-colors group-hover:bg-white/5">
              <div className="bg-blue-500/10 p-6 rounded-3xl w-24 h-24 mb-10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                <Car className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-4xl font-black mb-6">{t('role.customer.title')}</h3>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">{t('role.customer.desc')}</p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 h-14 rounded-2xl text-lg font-bold"
                onClick={() => handleRoleSelection('customer')}
              >
                {t('role.customer.btn_start')}
              </Button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-orange-500/20 to-transparent"
          >
            <div className="glass-card p-12 rounded-[2.4rem] h-full transition-colors group-hover:bg-white/5">
              <div className="bg-orange-500/10 p-6 rounded-3xl w-24 h-24 mb-10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <Wrench className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-4xl font-black mb-6">{t('role.mechanic.title')}</h3>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">{t('role.mechanic.desc')}</p>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-500 h-14 rounded-2xl text-lg font-bold"
                onClick={() => handleRoleSelection('mechanic')}
              >
                {t('role.mechanic.btn_start')}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mb-40">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase">{t('landing.why')}</h3>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-[160px] hover:bg-white/10 transition-colors"
              >
                <div className="mb-6">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-40 p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-[160px]">
          {[
            { label: t('stats.active_users'), value: '50K+', color: 'text-blue-500' },
            { label: t('stats.mechanic_partners'), value: '2.5K+', color: 'text-orange-500' },
            { label: t('stats.avg_rating'), value: '4.9/5', color: 'text-yellow-500' },
            { label: t('stats.repair_time'), value: '<45m', color: 'text-green-500' }
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
            <h3 className="text-5xl md:text-7xl font-black mb-8 leading-tight uppercase">{t('landing.cta_title')}</h3>
            <p className="text-xl text-gray-400 mb-12 italic">{t('landing.cta_quote')}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-16 px-12 rounded-2xl text-xl font-black" onClick={() => navigate('/login')}>
                {t('login.button')}
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 h-16 px-12 rounded-2xl text-xl font-black" onClick={() => navigate('/register')}>
                {t('landing.be_partner')}
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
              <h1 className="text-2xl font-black tracking-tighter uppercase">OKE MEKANIK</h1>
            </div>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black tracking-widest text-white/40 mb-6 uppercase">{t('footer.ecosystem')}</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li className="hover:text-blue-500 cursor-pointer transition-colors">{t('footer.ai_diag')}</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">{t('footer.fleet')}</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">{t('footer.emergency_hub')}</li>
              <li className="hover:text-blue-500 cursor-pointer transition-colors">{t('footer.roadside')}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black tracking-widest text-white/40 mb-6 uppercase">{t('footer.global_support')}</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li>HQ: {t('footer.location')}</li>
              <li>24/7 Hotline: 0800-MEKANIK</li>
              <li>support@okemekanik.v28.ai</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center text-gray-600 text-sm text-center">
          <p>{t('footer.rights')}</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
            <span>{t('footer.ethics')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
