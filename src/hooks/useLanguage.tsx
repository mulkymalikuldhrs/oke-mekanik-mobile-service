
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
    'cta.mechanic': 'Mulai sebagai Mekanik',
    'dashboard.customer.help': 'BUTUH BANTUAN?',
    'dashboard.customer.help_desc': 'Panggil mekanik profesional dalam hitungan detik. Layanan 24/7 di lokasi Anda.',
    'dashboard.customer.call_now': 'PANGGIL SEKARANG',
    'dashboard.customer.emergency': 'DARURAT',
    'dashboard.customer.active_service': 'Layanan Aktif',
    'dashboard.customer.nearby_mechanics': 'MEKANIK TERDEKAT',
    'dashboard.customer.service_history': 'Riwayat Layanan',
    'dashboard.mechanic.orders': 'Pesanan Masuk',
    'dashboard.mechanic.active_job': 'Pekerjaan Aktif',
    'dashboard.mechanic.completed': 'Selesai',
    'dashboard.mechanic.rating': 'Rating',
    'dashboard.mechanic.earnings_analysis': 'ANALISIS PENDAPATAN',
    'dashboard.mechanic.performance_trends': 'TREN PERFORMA',
    'status.pending': 'MENUNGGU',
    'status.accepted': 'DITERIMA',
    'status.otw': 'DALAM PERJALANAN',
    'status.arrived': 'TIBA',
    'status.working': 'SEDANG DIKERJAKAN',
    'status.completed': 'SELESAI',
    'status.cancelled': 'DIBATALKAN',
    'booking.title': 'Pesan Layanan',
    'booking.vehicle_info': 'Informasi Kendaraan',
    'booking.location_info': 'Lokasi Servis',
    'booking.problem_info': 'Masalah Kendaraan',
    'booking.ai_diagnostic': 'AI DIAGNOSTIK',
    'booking.submit': 'Konfirmasi Pesanan',
    'tracking.title': 'Lacak Mekanik',
    'tracking.status': 'Status Pesanan'
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
    'cta.mechanic': 'Start as Mechanic',
    'dashboard.customer.help': 'NEED HELP?',
    'dashboard.customer.help_desc': 'Call professional mechanics in seconds. 24/7 service at your location.',
    'dashboard.customer.call_now': 'CALL NOW',
    'dashboard.customer.emergency': 'EMERGENCY',
    'dashboard.customer.active_service': 'Active Service',
    'dashboard.customer.nearby_mechanics': 'NEARBY MECHANICS',
    'dashboard.customer.service_history': 'Service History',
    'dashboard.mechanic.orders': 'Incoming Orders',
    'dashboard.mechanic.active_job': 'Active Job',
    'dashboard.mechanic.completed': 'Completed',
    'dashboard.mechanic.rating': 'Rating',
    'dashboard.mechanic.earnings_analysis': 'EARNINGS ANALYSIS',
    'dashboard.mechanic.performance_trends': 'PERFORMANCE TRENDS',
    'status.pending': 'PENDING',
    'status.accepted': 'ACCEPTED',
    'status.otw': 'ON THE WAY',
    'status.arrived': 'ARRIVED',
    'status.working': 'WORKING',
    'status.completed': 'COMPLETED',
    'status.cancelled': 'CANCELLED',
    'booking.title': 'Book Service',
    'booking.vehicle_info': 'Vehicle Information',
    'booking.location_info': 'Service Location',
    'booking.problem_info': 'Vehicle Problem',
    'booking.ai_diagnostic': 'AI DIAGNOSTIC',
    'booking.submit': 'Confirm Booking',
    'tracking.title': 'Track Mechanic',
    'tracking.status': 'Booking Status'
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
