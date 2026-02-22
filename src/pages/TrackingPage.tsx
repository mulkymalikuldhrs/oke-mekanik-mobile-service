import { useState, useEffect } from 'react';
import { MapPin, Phone, MessageSquare, CheckCircle, AlertCircle, Navigation, ShieldCheck, ArrowLeft, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingApi, mechanicApi } from '@/lib/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icons
import 'leaflet/dist/leaflet.css';
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: AlertCircle, color: 'bg-gray-500' },
  { key: 'accepted', label: 'Diterima', icon: CheckCircle, color: 'bg-blue-500' },
  { key: 'otw', label: 'Perjalanan', icon: Navigation, color: 'bg-orange-500' },
  { key: 'working', label: 'Pengerjaan', icon: MapPin, color: 'bg-yellow-500' },
  { key: 'completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' },
];

// Helper to update map center
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

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

  const { data: mechanic } = useQuery({
    queryKey: ['mechanic', booking?.mechanicId],
    queryFn: () => mechanicApi.getById(booking?.mechanicId || ''),
    enabled: !!booking?.mechanicId,
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
            <p className="text-gray-400 mb-6 font-medium">Gagal memuat rincian pesanan Anda.</p>
            <Button className="w-full bg-blue-600 font-bold" onClick={() => navigate(-1)}>KEMBALI</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customerPos: [number, number] = [booking.location?.lat || -6.2, booking.location?.lng || 106.8];
  // Simulate mechanic moving towards customer if 'otw'
  const mechanicPos: [number, number] = booking.status === 'otw'
    ? [(customerPos[0] + 0.01), (customerPos[1] + 0.01)]
    : (mechanic?.lat ? [mechanic.lat, mechanic.lng] : [customerPos[0] + 0.005, customerPos[1] + 0.005]);

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
        {/* Real Map Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-orange-600 opacity-50 z-20" />
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-black italic tracking-tight uppercase">
              <MapPin className="h-5 w-5 mr-3 text-blue-400" />
              LOKASI MEKANIK REAL-TIME
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-96 relative border-t border-white/10">
               <MapContainer center={customerPos} zoom={13} style={{ height: '100%', width: '100%', filter: 'invert(1) hue-rotate(180deg)' }} zoomControl={false}>
                <ChangeView center={customerPos} zoom={13} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={customerPos}>
                  <Popup>Lokasi Anda</Popup>
                </Marker>
                {booking.status !== 'pending' && (
                  <Marker position={mechanicPos}>
                    <Popup>Mekanik: {mechanic?.name || 'Mekanik Sedang Menuju'}</Popup>
                  </Marker>
                )}
              </MapContainer>

              <div className="absolute bottom-4 left-4 z-[1000] bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <h3 className="text-sm font-black italic tracking-tighter uppercase text-white mb-1">
                  {booking.status === 'otw' ? 'MEKANIK SEDANG MENUJU ANDA' :
                   booking.status === 'accepted' ? 'MEKANIK MENYIAPKAN PERALATAN' :
                   booking.status === 'working' ? 'PERBAIKAN SEDANG BERLANGSUNG' :
                   booking.status === 'completed' ? 'PERBAIKAN SELESAI' : 'MENUNGGU KONFIRMASI'}
                </h3>
                <p className="text-xs text-gray-400 font-medium italic">
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
                    <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 ${
                      isActive ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110' : 'bg-white/5 text-gray-500'
                    } ${isCurrent ? 'animate-pulse' : ''}`}>
                      <StepIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : ''}`} />
                    </div>
                    <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
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
                <div className="text-4xl bg-white/5 p-3 rounded-2xl">{mechanic?.avatar || '👨‍🔧'}</div>
                <div>
                  <h3 className="font-black text-lg italic uppercase text-white tracking-tight">{mechanic?.name || 'Mekanik Kami'}</h3>
                  <div className="flex items-center mt-1">
                    <ShieldCheck className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">TERVERIFIKASI</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Kendaraan</span>
                  <span className="font-bold text-white">{booking.vehicle?.brand} {booking.vehicle?.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Masalah</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{booking.problem}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest">Biaya Estimasi</span>
                  <span className="font-black text-xl text-orange-400">Rp {booking.estimatedCost?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
                  onClick={() => navigate(`/customer/chat/${booking.id}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                  CHAT
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
                >
                  <Phone className="h-4 w-4 mr-2 text-green-400" />
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
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <p className="text-gray-300 font-medium italic">Kendaraan Anda telah selesai diperbaiki dan siap digunakan kembali.</p>
                <Button
                  className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-95"
                  onClick={() => navigate(`/customer/payment?bookingId=${booking.id}`)}
                >
                  LANJUT KE PEMBAYARAN
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-2xl">
              <CardContent className="p-8">
                <h4 className="text-md font-black italic text-red-400 uppercase mb-4 tracking-tighter">BUTUH BANTUAN DARURAT?</h4>
                <p className="text-gray-400 text-xs mb-6 italic">Jika terjadi kendala mendesak, hubungi pusat bantuan kami segera.</p>
                <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 transition-all">
                  <AlertCircle className="h-4 w-4 mr-2" />
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
            <span className="text-[10px] font-bold uppercase tracking-widest">TRANSAKSI AMAN & TERPROTEKSI</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter italic">LOKASI PENJEMPUTAN:</span>
            <Badge variant="outline" className="border-white/10 text-white bg-white/5 font-bold text-[10px]">
              {booking.location?.address}
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrackingPage;
