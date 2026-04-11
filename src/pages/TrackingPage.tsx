import { useState, useEffect } from 'react';
import { MapPin, Phone, MessageSquare, CheckCircle, AlertCircle, Navigation, ShieldCheck, ArrowLeft, LoaderCircle, Star, Clock, Wrench } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/useLanguage';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '@/lib/api';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const statusSteps = [
  { key: 'pending', label: 'Antre', icon: Clock, color: 'bg-gray-500' },
  { key: 'accepted', label: 'Dikonfirmasi', icon: ShieldCheck, color: 'bg-blue-500' },
  { key: 'otw', label: 'Menuju Lokasi', icon: Navigation, color: 'bg-orange-500' },
  { key: 'arrived', label: 'Tiba', icon: MapPin, color: 'bg-indigo-500' },
  { key: 'working', label: 'Dikerjakan', icon: Wrench, color: 'bg-yellow-500' },
  { key: 'completed', label: 'Selesai', icon: CheckCircle, color: 'bg-green-500' },
];

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MechanicIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png', // Mechanic/Wrench icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const UserIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Location pin icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

L.Marker.prototype.options.icon = DefaultIcon;

const TrackingPage = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [realtimeLocation, setRealtimeLocation] = useState<[number, number] | null>(null);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getById(id || ''),
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) return;

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001');

    socket.emit('join_booking', id);

    socket.on('location_updated', (data: { lat: number, lng: number }) => {
      setRealtimeLocation([data.lat, data.lng]);
    });

    socket.on('status_updated', (data: { status: string }) => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      toast.info(`${t('tracking.status_updated')}${data.status.toUpperCase()}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, queryClient]);

  const mechanicPos: [number, number] | null = realtimeLocation || (booking?.mechanicLocation
    ? [booking.mechanicLocation.lat, booking.mechanicLocation.lng]
    : null);

  const getCurrentStepIndex = () => {
    if (!booking) return 0;
    const statusIndex = statusSteps.findIndex(s => s.key === booking.status);
    return statusIndex >= 0 ? statusIndex : 0;
  };

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  useEffect(() => {
    if (booking?.status === 'completed' && !showArrivalModal) {
      setShowArrivalModal(true);
    }
  }, [booking?.status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-4 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-40 bg-white/5" />
          <Skeleton className="h-8 w-24 bg-white/5" />
        </div>
        <Skeleton className="h-96 w-full rounded-3xl bg-white/5" />
        <Skeleton className="h-40 w-full rounded-2xl bg-white/5" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full rounded-2xl bg-white/5" />
          <Skeleton className="h-64 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="max-w-md bg-white/5 border-white/10 backdrop-blur-2xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">{t('common.data_not_found')}</h2>
            <p className="text-gray-400 mb-6 font-medium">{t('common.load_order_error')}</p>
            <Button className="w-full bg-blue-600 font-bold" onClick={() => navigate(-1)}>{t('common.back')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[160px] rounded-full" />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-[40px] border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">{t('tracking.title')}</h1>
          </div>
          <Badge variant="outline" className="border-blue-500/50 text-blue-400 font-black uppercase tracking-widest px-3 py-1">
            {booking.id}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Real-time Map Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-[40px] shadow-2xl overflow-hidden group rounded-[2.5rem] relative glass-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-orange-600 opacity-50 z-20" />
          <CardHeader className="relative z-20 bg-black/40 backdrop-blur-md border-b border-white/5">
            <CardTitle className="flex items-center text-lg font-black italic tracking-tight uppercase">
              <MapPin className="h-5 w-5 mr-3 text-blue-400" />
              {t('tracking.map_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-96 relative z-10">
              {booking?.location?.lat && booking?.location?.lng ? (
                <MapContainer
                  center={[booking.location.lat, booking.location.lng]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />

                  {/* User Location */}
                  <Marker position={[booking.location.lat, booking.location.lng]} icon={UserIcon}>
                    <Popup className="custom-popup">
                      <div className="text-xs font-bold uppercase">{t('tracking.user_loc')}</div>
                    </Popup>
                  </Marker>

                  {/* Mechanic Location (Real-time Tracking) */}
                  {mechanicPos && ['otw', 'arrived', 'working'].includes(booking.status) ? (
                    <Marker
                      position={mechanicPos}
                      icon={MechanicIcon}
                    >
                      <Popup className="custom-popup">
                        <div className="text-xs font-bold uppercase text-orange-500">{t('tracking.mech_loc')}</div>
                      </Popup>
                    </Marker>
                  ) : null}
                </MapContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-black/40">
                   <LoaderCircle className="h-10 w-10 text-blue-500 animate-spin" />
                </div>
              )}

              {/* Status Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-[1000] pointer-events-none">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl pointer-events-auto">
                  <h3 className="text-sm font-black italic tracking-tighter uppercase text-white mb-1">
                    {booking.status === 'otw' ? t('tracking.status.otw') :
                     booking.status === 'accepted' ? t('tracking.status.preparing') :
                     booking.status === 'arrived' ? t('tracking.status.arrived') :
                     booking.status === 'working' ? t('tracking.status.working') :
                     booking.status === 'completed' ? t('tracking.status.completed') : t('tracking.status.pending')}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 font-medium italic">
                      {t('tracking.eta')} <span className="text-orange-400 font-bold">~12 {t('tracking.eta').includes('tiba') ? 'Menit' : 'Min'}</span>
                    </p>
                    <div className="flex items-center space-x-1">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">{t('common.live_gps')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <style>{`
            .leaflet-container {
              background: #0a0a0a !important;
            }
            .custom-popup .leaflet-popup-content-wrapper {
              background: #1a1a1a;
              color: white;
              border: 1px solid rgba(255,255,255,0.1);
              border-radius: 12px;
            }
            .custom-popup .leaflet-popup-tip {
              background: #1a1a1a;
            }
          `}</style>
        </Card>

        {/* Status Progress */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-[40px] shadow-xl rounded-[2rem] glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-black italic tracking-tight uppercase">{t('tracking.progress_title')}</CardTitle>
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
              <CardTitle className="text-lg font-black italic tracking-tight uppercase">{t('tracking.info_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-5 p-4 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-5xl bg-white/5 p-3 rounded-2xl">👨‍🔧</div>
                <div>
                  <h3 className="font-black text-xl italic uppercase text-white tracking-tight">{t('tracking.mech_prof')}</h3>
                  <div className="flex items-center mt-1">
                    <ShieldCheck className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{t('tracking.verified')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs font-black tracking-widest">{t('tracking.vehicle')}</span>
                  <span className="font-bold text-white">{booking.vehicle?.brand} {booking.vehicle?.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs font-black tracking-widest">{t('tracking.problem')}</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{booking.problem}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs font-black tracking-widest">{t('tracking.cost')}</span>
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
                  {t('tracking.btn_chat')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
                >
                  <Phone className="h-5 w-5 mr-2 text-green-400" />
                  {t('tracking.btn_phone')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {booking.status === 'completed' ? (
            <Card className="bg-green-500/10 border-green-500/30 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 duration-500">
              <CardHeader>
                <CardTitle className="text-2xl font-black italic tracking-tighter text-green-400 uppercase">{t('tracking.job_done')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="bg-green-500/20 p-6 rounded-full w-fit mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="h-20 w-20 text-green-500" />
                </div>
                <p className="text-gray-300 font-medium italic">{t('tracking.job_done_desc')}</p>
                <Button
                  className="w-full h-16 bg-green-600 hover:bg-green-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-95"
                  onClick={() => navigate(`/customer/payment?bookingId=${booking.id}`)}
                >
                  {t('tracking.btn_payment')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-2xl">
              <CardContent className="p-8">
                <h4 className="text-lg font-black italic text-red-400 uppercase mb-4 tracking-tighter">{t('tracking.help_title')}</h4>
                <p className="text-gray-400 text-sm mb-6 italic">{t('tracking.help_desc')}</p>
                <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 transition-all">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {t('tracking.btn_support')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Arrival Success Modal */}
      <Dialog open={showArrivalModal} onOpenChange={setShowArrivalModal}>
        <DialogContent className="bg-[#0a0a0a]/90 backdrop-blur-3xl border-white/10 text-white p-0 overflow-hidden max-w-sm rounded-3xl">
           <div className="bg-gradient-to-b from-green-500/20 to-transparent p-8 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                 <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse" />
                 <div className="relative bg-black/40 border border-green-500/30 p-5 rounded-3xl shadow-2xl">
                    <CheckCircle className="h-full w-full text-green-500" />
                 </div>
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">{t('tracking.job_done')}</h2>
              <p className="text-gray-400 text-sm italic font-medium">{t('tracking.job_done_desc')}</p>
           </div>
           <div className="p-6 space-y-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{t('tracking.total_cost')}</p>
                 <p className="text-2xl font-black text-white italic">Rp {booking?.estimatedCost?.toLocaleString()}</p>
              </div>
              <Button
                className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-600/20"
                onClick={() => navigate(`/customer/payment?bookingId=${booking?.id}`)}
              >
                {t('tracking.btn_pay_now')}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-500 hover:text-white"
                onClick={() => setShowArrivalModal(false)}
              >
                {t('tracking.btn_view_detail')}
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Footer Meta */}
      <footer className="mt-12 p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-gray-400">
            <ShieldCheck className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-xs font-bold uppercase tracking-widest">{t('tracking.footer.secure')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-black text-gray-500 uppercase tracking-tighter italic">{t('tracking.footer.pickup')}</span>
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
