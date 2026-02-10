import { useState, useEffect } from 'react';
import { MapPin, Phone, MessageSquare, CheckCircle, AlertCircle, Navigation, ShieldCheck } from 'lucide-react';
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
        <LoaderCircle className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="max-w-md bg-white/5 border-red-500/20 backdrop-blur-2xl">
          <CardContent className="p-8 text-center">
            <div className="bg-red-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Gagal memuat data</h2>
            <p className="text-gray-400 mb-6">Booking tidak ditemukan atau terjadi kesalahan jaringan.</p>
            <Button onClick={() => navigate('/customer/dashboard')} className="w-full bg-blue-600">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black italic tracking-tighter">LACAK PESANAN</h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">ID: {booking.id}</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* Map Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-white">
              <MapPin className="h-5 w-5 mr-2 text-blue-400" />
              Lokasi Mekanik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-72 bg-white/5 rounded-3xl flex items-center justify-center relative overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-blue-600/5 flex items-center justify-center">
                <div className="w-full h-full opacity-20 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i2658!3i1616!2m3!1e0!2sm!3i407105189!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1f0!23i1301875')] bg-cover" />
              </div>
              <div className="z-10 text-center">
                <div className="bg-blue-600 p-5 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] inline-block mb-4 animate-pulse">
                  <Navigation className="h-10 w-10 text-white" />
                </div>
                <p className="text-xl font-bold text-white mb-1">
                  {booking.status === 'otw' ? 'Sedang Menuju Lokasi' : 'Menunggu Konfirmasi'}
                </p>
                <p className="text-sm text-gray-400">Estimasi tiba: 12 menit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Progress */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-white">Status Pekerjaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <Progress value={getProgress()} className="h-3 bg-white/5" />
            <div className="grid grid-cols-5 gap-1">
              {statusSteps.map((step, index) => {
                const isActive = index <= getCurrentStepIndex();
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' : 'bg-white/5 text-gray-500'}`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>{step.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info and Actions */}
        <div className="grid md:grid-cols-2 gap-6 pb-24">
          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-white">Informasi Layanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-5">
                <div className="text-5xl bg-white/5 p-3 rounded-2xl">👨‍🔧</div>
                <div>
                  <h3 className="font-black text-xl text-white">Budi Mekanik</h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified Partner</Badge>
                </div>
              </div>
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Kendaraan</span>
                  <span className="text-white font-medium">{booking.vehicle?.brand} {booking.vehicle?.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Layanan</span>
                  <span className="text-white font-medium">{booking.problem}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Biaya</span>
                  <span className="text-blue-400 font-black">Rp {booking.estimatedCost?.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 bg-white/5 border-white/10 text-white h-12 rounded-xl" onClick={() => navigate(`/customer/chat/${booking.id}`)}>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black h-12 rounded-xl">
                  <Phone className="h-5 w-5 mr-2" />
                  Panggil
                </Button>
              </div>
            </CardContent>
          </Card>

          {booking.status === 'completed' ? (
            <Card className="bg-green-600/10 border-green-500/20 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              <CardHeader>
                <CardTitle className="text-green-400 font-black text-2xl text-center">Pekerjaan Selesai! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 py-8">
                <div className="text-center relative">
                  <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20" />
                  <CheckCircle className="h-24 w-24 text-green-500 mx-auto relative z-10" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-black h-14 rounded-2xl shadow-lg shadow-green-500/20" onClick={() => navigate(`/customer/payment?bookingId=${booking.id}`)}>
                  LANJUT KE PEMBAYARAN
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-600/5 border-red-500/10 backdrop-blur-2xl rounded-[2rem]">
              <CardContent className="p-8">
                <p className="text-gray-400 text-sm text-center mb-6">Butuh bantuan mendesak terkait pesanan ini?</p>
                <Button variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 h-14 rounded-2xl font-bold">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  PUSAT BANTUAN
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer Status Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-black/60 backdrop-blur-3xl border-t border-white/10 p-4 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Secure Service Layer Active</span>
          </div>
          <Badge className="bg-white/10 text-white border-white/20 px-3 py-1">
            {booking.vehicle?.licensePlate}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
