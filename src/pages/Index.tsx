import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Wrench, MapPin, Star, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-400" />,
      title: t('feature.location.title'),
      description: t('feature.location.desc')
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-400" />,
      title: t('feature.realtime.title'),
      description: t('feature.realtime.desc')
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: t('feature.rating.title'),
      description: t('feature.rating.desc')
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
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
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Futuristic Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              OKE MEKANIK
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Button
              variant="ghost"
              className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/10 rounded-xl px-6 font-bold uppercase tracking-tighter"
              onClick={() => navigate('/login')}
            >
              {t('nav.login')}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 rounded-xl h-12 shadow-xl shadow-blue-500/20 uppercase tracking-tight holographic-glow transition-all active:scale-95"
              onClick={() => navigate('/register')}
            >
              {t('nav.register')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                #1 Bengkel Panggilan Indonesia
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30"
            >
              {t('hero.title')}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button
                 size="lg"
                 className="bg-blue-600 hover:bg-blue-500 h-20 px-12 text-2xl font-black rounded-[1.5rem] shadow-2xl shadow-blue-500/30 group transition-all holographic-glow uppercase tracking-tighter"
                 onClick={() => navigate('/register')}
               >
                 {t('hero.cta')}
                 <ArrowRight className="ml-3 h-8 w-8 group-hover:translate-x-2 transition-transform" />
               </Button>
            </motion.div>
          </div>

          {/* Role Selection Glass Cards */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-32">
            <motion.div variants={itemVariants}>
              <Card
                className="group relative overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-[40px] hover:bg-white/[0.07] hover:border-blue-500/40 transition-all duration-500 rounded-[2.5rem] cursor-pointer"
                onClick={() => handleRoleSelection('customer')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-12 text-center">
                  <div className="bg-blue-500/10 p-8 rounded-3xl w-28 h-28 mx-auto mb-10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-blue-500/10">
                    <Car className="h-14 w-14 text-blue-400" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6 tracking-tight">
                    {t('role.customer.title')}
                  </h3>
                  <p className="text-white/40 mb-10 text-lg font-medium">
                    {t('role.customer.desc')}
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 h-16 text-lg font-black rounded-2xl shadow-xl shadow-blue-500/20 uppercase tracking-tight holographic-glow">
                    {t('role.customer.button')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                className="group relative overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-[40px] hover:bg-white/[0.07] hover:border-orange-500/40 transition-all duration-500 rounded-[2.5rem] cursor-pointer"
                onClick={() => handleRoleSelection('mechanic')}
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-12 text-center">
                  <div className="bg-orange-500/10 p-8 rounded-3xl w-28 h-28 mx-auto mb-10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-2xl shadow-orange-500/10">
                    <Wrench className="h-14 w-14 text-orange-400" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6 tracking-tight">
                    {t('role.mechanic.title')}
                  </h3>
                  <p className="text-white/40 mb-10 text-lg font-medium">
                    {t('role.mechanic.desc')}
                  </p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-500 h-16 text-lg font-black rounded-2xl shadow-xl shadow-orange-500/20 uppercase tracking-tight">
                    {t('role.mechanic.button')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features - Holographic Grid */}
          <div className="mb-32">
            <motion.h3
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black text-center text-white mb-20 tracking-tighter"
            >
              {t('features.title')}
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 group rounded-3xl h-full">
                    <CardContent className="p-10 text-center flex flex-col items-center">
                      <div className="mb-8 p-5 bg-white/5 rounded-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                        {feature.icon}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">
                        {feature.title}
                      </h4>
                      <p className="text-white/40 leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Production Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 bg-white/[0.03] backdrop-blur-[40px] p-16 rounded-[4rem] border border-white/5 shadow-inner"
          >
            {[
              { val: "10k+", label: t('stats.active_users'), color: "text-blue-400" },
              { val: "500+", label: t('stats.mechanic_partners'), color: "text-orange-400" },
              { val: "4.9", label: t('stats.avg_rating'), color: "text-green-400" },
              { val: "15m", label: t('stats.arrival_eta'), color: "text-purple-400" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className={`text-5xl font-black ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>{stat.val}</p>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Final CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center bg-gradient-to-br from-blue-600/20 to-orange-600/20 backdrop-blur-[60px] rounded-[4rem] p-16 md:p-24 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

            <h3 className="text-5xl md:text-7xl font-black mb-8 relative z-10 tracking-tighter">
              {t('cta.title')}
            </h3>
            <p className="text-2xl text-white/60 mb-14 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 h-18 px-14 text-xl font-black rounded-2xl transition-all"
                onClick={() => handleRoleSelection('customer')}
              >
                {t('cta.customer')}
              </Button>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 h-18 px-14 text-xl font-black rounded-2xl transition-all"
                onClick={() => handleRoleSelection('mechanic')}
              >
                {t('cta.mechanic')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-black/80 border-t border-white/5 py-20 px-4 relative z-10">
        <div className="container mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tighter italic">OKE MEKANIK</h1>
            </div>
            <p className="text-white/40 text-lg max-w-sm leading-relaxed font-medium">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-sm">{t('footer.services')}</h4>
            <ul className="space-y-4 text-white/40 font-medium">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">{t('footer.panggil')}</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">{t('footer.servis')}</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">{t('footer.oli')}</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">{t('footer.emergency')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-sm">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-white/40 font-medium">
              <li>support@okemekanik.com</li>
              <li>0800-1-OKEMEK</li>
              <li>{t('footer.location')}</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-10 border-t border-white/5 text-center text-white/20 text-sm font-bold tracking-widest uppercase">
          {t('footer.rights')}
        </div>
      </footer>
    </div>
  );
};

export default Index;
