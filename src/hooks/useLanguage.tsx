
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    'hero.title': 'Bengkel Keliling Terpercaya',
    'hero.subtitle': 'Panggil mekanik profesional ke lokasi Anda kapan saja, dimana saja',
    'role.customer.title': 'Saya Pelanggan',
    'role.customer.desc': 'Butuh bantuan mekanik? Panggil sekarang juga!',
    'role.customer.button': 'Panggil Mekanik',
    'role.mechanic.title': 'Saya Mekanik',
    'role.mechanic.desc': 'Bergabung sebagai mitra mekanik profesional',
    'role.mechanic.button': 'Daftar Mekanik',
    'features.title': 'Mengapa Pilih Oke Mekanik?',
    'feature.location.title': 'Lokasi Real-time',
    'feature.location.desc': 'Lacak mekanik menuju lokasi Anda secara real-time',
    'feature.realtime.title': 'Respon Cepat',
    'feature.realtime.desc': 'Mekanik terdekat akan segera merespon panggilan Anda',
    'feature.rating.title': 'Mekanik Terpercaya',
    'feature.rating.desc': 'Semua mekanik telah diverifikasi dan memiliki rating tinggi',
    'feature.verified.title': 'Identitas Terverifikasi',
    'feature.verified.desc': 'Keamanan terjamin dengan verifikasi identitas lengkap',
    'cta.title': 'Siap Memulai?',
    'cta.subtitle': 'Bergabunglah dengan ribuan pengguna yang puas',
    'cta.customer': 'Mulai sebagai Pelanggan',
    'cta.mechanic': 'Mulai sebagai Mekanik'
  },
  en: {
    'hero.title': 'Trusted Mobile Mechanic',
    'hero.subtitle': 'Call professional mechanics to your location anytime, anywhere',
    'role.customer.title': "I'm a Customer",
    'role.customer.desc': 'Need mechanic help? Call now!',
    'role.customer.button': 'Call Mechanic',
    'role.mechanic.title': "I'm a Mechanic",
    'role.mechanic.desc': 'Join as a professional mechanic partner',
    'role.mechanic.button': 'Register as Mechanic',
    'features.title': 'Why Choose Oke Mekanik?',
    'feature.location.title': 'Real-time Location',
    'feature.location.desc': 'Track mechanics heading to your location in real-time',
    'feature.realtime.title': 'Quick Response',
    'feature.realtime.desc': 'Nearest mechanics will respond to your call immediately',
    'feature.rating.title': 'Trusted Mechanics',
    'feature.rating.desc': 'All mechanics are verified and have high ratings',
    'feature.verified.title': 'Verified Identity',
    'feature.verified.desc': 'Security guaranteed with complete identity verification',
    'cta.title': 'Ready to Start?',
    'cta.subtitle': 'Join thousands of satisfied users',
    'cta.customer': 'Start as Customer',
    'cta.mechanic': 'Start as Mechanic'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
