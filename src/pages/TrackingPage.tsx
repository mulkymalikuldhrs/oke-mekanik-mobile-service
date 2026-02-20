import { useState, useEffect } from 'react';
import { MapPin, Phone, MessageSquare, CheckCircle, AlertCircle, Navigation, ShieldCheck, ArrowLeft, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: AlertCircle, color: 'bg-gray-500' },
  { key: 'accepted', label: 'Diterima', icon: CheckCircle, color: 'bg-blue-500' },
  { key: 'otw', label: 'Perjalanan', icon: Navigation, color: 'bg-orange-500' },
  { key: 'working', label: 'Pengerjaan', icon: MapPin, color: 'bg-yellow-500' },
  { key: 'completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' },
];

const TrackingPage = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getById(id || ''),
    enabled: !!id,
    refetchInterval: 3000,
  });

  const getCurrentStepIndex = () => {
    if (!booking) return 0;
    const statusIndex = statusSteps.findIndex(s => s.key === booking.status);
    return statusIndex >= 0 ? statusIndex : 0;
  };

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoaderCircle className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="max-w-md bg-white/5 border-white/10 backdrop-blur-2xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">DATA TIDAK DITEMUKAN</h2>
            <p className="text-gray-400 mb-6 font-medium">Gagal memuat detail pesanan Anda.</p>
            <Button className="w-full bg-blue-600 font-bold" onClick={() => navigate(-1)}>KEMBALI</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">LACAK PESANAN</h1>
          </div>
          <Badge variant="outline" className="border-blue-500/50 text-blue-400 font-black uppercase tracking-widest px-3 py-1">
            {booking.id}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Map Placeholder Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-orange-600 opacity-50" />
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-black italic tracking-tight uppercase">
              <MapPin className="h-5 w-5 mr-3 text-blue-400" />
              LOKASI MEKANIK REAL-TIME
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80 bg-black/40 rounded-3xl flex items-center justify-center relative overflow-hidden border border-white/5 shadow-inner">
              {/* Fake Map Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/20" />
                <div className="absolute top-0 left-1/3 w-px h-full bg-white/20" />
                <div className="absolute top-0 left-2/3 w-px h-full bg-white/20" />
              </div>

              <div className="z-10 text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-ping" />
                  <div className="bg-blue-600 p-4 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] relative">
                    <Navigation className="h-10 w-10 text-white animate-bounce" />
                  </div>
                </div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase text-white mb-2">
                  {booking.status === 'otw' ? 'MEKANIK SEDANG MENUJU ANDA' :
                   booking.status === 'accepted' ? 'MEKANIK MENYIAPKAN PERALATAN' :
                   booking.status === 'working' ? 'PERBAIKAN SEDANG BERLANGSUNG' :
                   booking.status === 'completed' ? 'PERBAIKAN SELESAI' : 'MENUNGGU KONFIRMASI'}
                </h3>
                <p className="text-gray-400 font-medium italic">
                  Estimasi tiba: <span className="text-orange-400 font-bold">~12 Menit</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Progress */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-black italic tracking-tight uppercase">STATUS PEKERJAAN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="relative">
               <Progress value={getProgress()} className="h-3 bg-white/5" />
               <div className="absolute top-0 left-0 h-full bg-blue-500/20 blur-md w-full pointer-events-none" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {statusSteps.map((step, index) => {
                const isActive = index <= getCurrentStepIndex();
                const isCurrent = index === getCurrentStepIndex();
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="text-center group">
                    <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 ${
                      isActive ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110' : 'bg-white/5 text-gray-500'
                    } ${isCurrent ? 'animate-pulse' : ''}`}>
                      <StepIcon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info and Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-black italic tracking-tight uppercase">INFORMASI LAYANAN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-5 p-4 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-5xl bg-white/5 p-3 rounded-2xl">👨‍🔧</div>
                <div>
                  <h3 className="font-black text-xl italic uppercase text-white tracking-tight">Mekanik Profesional</h3>
                  <div className="flex items-center mt-1">
                    <ShieldCheck className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">TERVERIFIKASI</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs font-black tracking-widest">Kendaraan</span>
                  <span className="font-bold text-white">{booking.vehicle?.brand} {booking.vehicle?.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs font-black tracking-widest">Masalah</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{booking.problem}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs font-black tracking-widest">Biaya Estimasi</span>
                  <span className="font-black text-xl text-orange-400">Rp {booking.estimatedCost?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
                  onClick={() => navigate(`/customer/chat/${booking.id}`)}
                >
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                  CHAT
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
                >
                  <Phone className="h-5 w-5 mr-2 text-green-400" />
                  TELEPON
                </Button>
              </div>
            </CardContent>
          </Card>

          {booking.status === 'completed' ? (
            <Card className="bg-green-500/10 border-green-500/30 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 duration-500">
              <CardHeader>
                <CardTitle className="text-2xl font-black italic tracking-tighter text-green-400 uppercase">PEKERJAAN SELESAI! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="bg-green-500/20 p-6 rounded-full w-fit mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="h-20 w-20 text-green-500" />
                </div>
                <p className="text-gray-300 font-medium italic">Kendaraan Anda telah selesai diperbaiki dan siap digunakan kembali.</p>
                <Button
                  className="w-full h-16 bg-green-600 hover:bg-green-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-95"
                  onClick={() => navigate(`/customer/payment?bookingId=${booking.id}`)}
                >
                  LANJUT KE PEMBAYARAN
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-2xl">
              <CardContent className="p-8">
                <h4 className="text-lg font-black italic text-red-400 uppercase mb-4 tracking-tighter">BUTUH BANTUAN DARURAT?</h4>
                <p className="text-gray-400 text-sm mb-6 italic">Jika terjadi kendala mendesak, hubungi pusat bantuan kami segera.</p>
                <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 transition-all">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  HUBUNGI SUPPORT
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="mt-12 p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-gray-400">
            <ShieldCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-xs font-bold uppercase tracking-widest">TRANSAKSI AMAN & TERPROTEKSI</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-black text-gray-500 uppercase tracking-tighter italic">LOKASI PENJEMPUTAN:</span>
            <Badge variant="outline" className="border-white/10 text-white bg-white/5 font-bold">
              {booking.location?.address}
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackingPage;
