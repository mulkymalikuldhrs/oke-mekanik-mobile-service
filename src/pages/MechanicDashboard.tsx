import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, Star, LogOut, LoaderCircle, AlertTriangle, TrendingUp, Navigation, Zap, Power, PowerOff, Users, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { mechanicApi, bookingApi, reviewApi } from '@/lib/api';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

const MechanicDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(true);
  const [incomingOrder, setIncomingOrder] = useState<any>(null);

  // Get mechanic profile
  const { data: mechanicData, isLoading } = useQuery({
    queryKey: ['mechanicDashboard', user?.id],
    queryFn: () => mechanicApi.getById(user?.id || ''),
    enabled: !!user?.id,
  });

  // Get mechanic bookings
  const { data: bookings = [] } = useQuery({
    queryKey: ['mechanicBookings', user?.id],
    queryFn: () => bookingApi.getByMechanic(user?.id || ''),
    enabled: !!user?.id,
    refetchInterval: 10000, // Poll every 10s for new orders
  });

  // Get reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['mechanicReviews', mechanicData?.id],
    queryFn: () => reviewApi.getByMechanicId(mechanicData?.id || ''),
    enabled: !!mechanicData?.id,
  });

  // Get pending bookings (new orders)
  const { data: pendingBookings = [] } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: mechanicApi.getPendingBookings,
    enabled: isOnline && !!user?.id,
    refetchInterval: 5000, // Check every 5s
  });

  // Active booking
  const activeBooking = bookings.find(b => ['accepted', 'otw', 'arrived', 'working'].includes(b.status));
  const pendingBooking = bookings.find(b => b.status === 'pending');

  // Stats
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.finalCost || b.estimatedCost || 0), 0);

  // Status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      bookingApi.updateStatus(id, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanicBookings'] });
      queryClient.invalidateQueries({ queryKey: ['pendingBookings'] });
    },
  });

  // Online/offline mutation
  const toggleOnlineMutation = useMutation({
    mutationFn: ({ id, online }: { id: string; online: boolean }) =>
      mechanicApi.updateStatus(id, online),
    onSuccess: (_, variables) => {
      setIsOnline(variables.online);
      toast.success(variables.online ? 'Anda sekarang ONLINE' : 'Anda sekarang OFFLINE');
    },
  });

  // Location tracking
  useEffect(() => {
    if (!user?.id || !isOnline || !mechanicData?.id) return;

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          mechanicApi.updateLocation(mechanicData.id, position.coords.latitude, position.coords.longitude);
        });
      }
    };

    updateLocation();
    const interval = setInterval(updateLocation, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [user?.id, isOnline, mechanicData?.id]);

  // Socket for real-time new orders
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
    const socket = io(apiUrl);

    socket.on('new_booking', (booking) => {
      if (isOnline) {
        setIncomingOrder(booking);
        toast.info('Pesanan baru masuk!', { duration: 10000 });
      }
    });

    socket.on('sos_booking', (booking) => {
      setIncomingOrder({ ...booking, isSOS: true });
      toast.error('🆘 PANGGILAN DARURAT MASUK!', { duration: 15000 });
    });

    return () => { socket.disconnect(); };
  }, [isOnline]);

  const handleAcceptOrder = (bookingId: string) => {
    updateStatusMutation.mutate({ id: bookingId, status: 'accepted' }, {
      onSuccess: () => {
        toast.success('Pesanan diterima!');
        setIncomingOrder(null);
      }
    });
  };

  const handleRejectOrder = () => {
    setIncomingOrder(null);
    toast.info('Pesanan ditolak');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { isError, error } = useQuery({
    queryKey: ['mechanicDashboard', user?.id],
    queryFn: () => mechanicApi.getById(user?.id || ''),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-xl font-bold mb-2">{t('error.load_failed')}</p>
        <p className="text-gray-500 mb-6">{(error as any)?.message || t('error.data_error')}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['mechanicDashboard'] })}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-2 rounded-xl">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">OKE MEKANIK v28.1</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                v5.8.2 ULTIMATE+ • {mechanicData?.name || 'Mekanik'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Online/Offline Toggle */}
        <Card className={`rounded-2xl overflow-hidden border ${isOnline ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {isOnline ? <Power className="h-5 w-5 text-green-400" /> : <PowerOff className="h-5 w-5 text-red-400" />}
                </div>
                <div>
                  <p className="font-black text-sm">{isOnline ? 'ONLINE' : 'OFFLINE'}</p>
                  <p className="text-xs text-gray-500">{isOnline ? 'Anda terlihat oleh pelanggan' : 'Tidak menerima pesanan'}</p>
                </div>
              </div>
              <Switch
                checked={isOnline}
                onCheckedChange={(checked) => {
                  if (mechanicData?.id) toggleOnlineMutation.mutate({ id: mechanicData.id, online: checked });
                }}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-white/5 border-white/5 rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-black text-green-400">{completedCount}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Selesai</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/5 rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-black text-blue-400">Rp {(totalEarnings/1000).toFixed(0)}K</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Pendapatan</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/5 rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-black text-yellow-400 flex items-center justify-center">
                <Star className="h-4 w-4 mr-1 fill-current" />{mechanicData?.rating || '4.5'}
              </p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Incoming Order Alert */}
        <AnimatePresence>
          {(incomingOrder || pendingBooking) && isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className={`rounded-2xl overflow-hidden border ${incomingOrder?.isSOS || incomingOrder?.isEmergency ? 'border-red-500/50 bg-red-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
                <CardHeader className="pb-2 pt-3 px-4">
                  <div className="flex items-center gap-2">
                    {(incomingOrder?.isSOS || incomingOrder?.isEmergency) && (
                      <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
                    )}
                    <CardTitle className="text-sm font-black uppercase">
                      {(incomingOrder?.isSOS || incomingOrder?.isEmergency) ? '🆘 PANGGILAN DARURAT!' : '📋 PESANAN MASUK'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span>{incomingOrder?.vehicle?.brand || incomingOrder?.vehicleBrand || '-'} {incomingOrder?.vehicle?.model || incomingOrder?.vehicleModel || ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{incomingOrder?.location?.address || incomingOrder?.locationAddress || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <span>{incomingOrder?.problem || '-'}</span>
                    </div>
                    {incomingOrder?.distance && (
                      <div className="flex items-center gap-2 text-green-400">
                        <Navigation className="h-4 w-4" />
                        <span>{incomingOrder.distance.toFixed(1)} km • ~{incomingOrder.etaMinutes} mnt</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-blue-400 font-bold">
                      <span>Rp {(incomingOrder?.estimatedCost || 0)?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl font-bold"
                      onClick={handleRejectOrder}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Tolak
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-500 rounded-xl font-bold"
                      onClick={() => handleAcceptOrder(incomingOrder?.id || pendingBooking?.id || '')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Terima
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Job */}
        {activeBooking && (
          <Card className="rounded-2xl border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-400" /> PEKERJAAN AKTIF
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2"><span className="text-gray-500">Status:</span> <Badge className="bg-blue-500/20 text-blue-400">{activeBooking.status.toUpperCase()}</Badge></div>
                <p><span className="text-gray-500">Pelanggan:</span> {activeBooking.customer?.name || '-'}</p>
                <p><span className="text-gray-500">Kendaraan:</span> {activeBooking.vehicle?.brand} {activeBooking.vehicle?.model}</p>
                <p><span className="text-gray-500">Masalah:</span> {activeBooking.problem}</p>
                <p><span className="text-gray-500">Lokasi:</span> {activeBooking.location?.address}</p>
              </div>
              
              {/* Status Action Buttons */}
              <div className="flex flex-col gap-2">
                {activeBooking.status === 'accepted' && (
                  <Button className="w-full bg-orange-600 hover:bg-orange-500 rounded-xl font-bold" onClick={() => updateStatusMutation.mutate({ id: activeBooking.id, status: 'otw' })}>
                    <Navigation className="h-4 w-4 mr-2" /> BERANGKAT (OTW)
                  </Button>
                )}
                {activeBooking.status === 'otw' && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl font-bold" onClick={() => updateStatusMutation.mutate({ id: activeBooking.id, status: 'arrived' })}>
                    <MapPin className="h-4 w-4 mr-2" /> TIBA DI LOKASI
                  </Button>
                )}
                {activeBooking.status === 'arrived' && (
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold" onClick={() => updateStatusMutation.mutate({ id: activeBooking.id, status: 'working' })}>
                    <Wrench className="h-4 w-4 mr-2" /> MULAI KERJA
                  </Button>
                )}
                {activeBooking.status === 'working' && (
                  <Button className="w-full bg-green-600 hover:bg-green-500 rounded-xl font-bold" onClick={() => updateStatusMutation.mutate({ id: activeBooking.id, status: 'completed' })}>
                    <CheckCircle className="h-4 w-4 mr-2" /> SELESAI
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-white/10 text-white rounded-xl" onClick={() => navigate(`/mechanic/chat/${activeBooking.id}`)}>
                  <MessageSquare className="h-4 w-4 mr-1" /> Chat
                </Button>
                <Button variant="outline" className="flex-1 border-white/10 text-white rounded-xl" onClick={() => navigate(`/customer/tracking/${activeBooking.id}`)}>
                  <MapPin className="h-4 w-4 mr-1" /> Lacak
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reviews */}
        {reviews.length > 0 && (
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 px-1">Ulasan Terbaru</h3>
            <div className="space-y-2">
              {reviews.slice(0, 3).map((rev: any) => (
                <Card key={rev.id} className="bg-white/5 border-white/5 rounded-xl">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-300">{rev.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Incoming Order Full-screen Dialog */}
      <AnimatePresence>
        {incomingOrder?.isSOS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-red-900/80 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-[#1a1a1a] rounded-3xl p-6 max-w-sm w-full border-2 border-red-500/50"
            >
              <div className="text-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto animate-pulse" />
                <h2 className="text-2xl font-black text-red-400 mt-2">🆘 SOS DARURAT!</h2>
                <p className="text-sm text-gray-400 mt-1">Pelanggan butuh bantuan segera!</p>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Lokasi:</strong> {incomingOrder?.location?.address || 'GPS Location'}</p>
                <p><strong>Masalah:</strong> {incomingOrder?.problem || 'Kendaraan mogok'}</p>
                {incomingOrder?.distance && <p><strong>Jarak:</strong> {incomingOrder.distance.toFixed(1)} km</p>}
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl" onClick={handleRejectOrder}>
                  <XCircle className="h-4 w-4 mr-1" /> Tolak
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl font-bold" onClick={() => handleAcceptOrder(incomingOrder?.id)}>
                  <Zap className="h-4 w-4 mr-1" /> TERIMA!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MechanicDashboard;
