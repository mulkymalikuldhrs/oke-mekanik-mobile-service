import { useState, useEffect } from 'react';
import { MapPin, Car, Clock, Star, Plus, History, AlertTriangle, LogOut, LoaderCircle, CheckCircle2, Phone, Navigation, Wrench, Zap, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingApi, mechanicApi, reviewApi, serviceApi } from '@/lib/api';
import { toast } from 'sonner';

// Custom map icons
const mechanicIcon = L.divIcon({
  html: `<div style="background:#f97316;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="font-size:18px">🔧</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  className: '',
});

const workshopIcon = L.divIcon({
  html: `<div style="background:#3b82f6;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="font-size:20px">🏭</span></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  className: '',
});

const userIcon = L.divIcon({
  html: `<div style="background:#22c55e;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="font-size:16px">📍</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  className: '',
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: -6.2088, lng: 106.8456 });
  const [locationReady, setLocationReady] = useState(false);
  const [reviewDialog, setReviewDialog] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Get user's GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationReady(true);
        },
        () => {
          setLocationReady(true); // Use default Jakarta location
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationReady(true);
    }
  }, []);

  // Fetch nearby mechanics
  const { data: nearbyMechanics = [], isLoading: mechanicsLoading } = useQuery({
    queryKey: ['nearbyMechanics', userLocation.lat, userLocation.lng],
    queryFn: () => mechanicApi.getNearby(userLocation.lat, userLocation.lng, 15),
    enabled: locationReady,
  });

  // Fetch user bookings
  const { data: bookings = [] } = useQuery({
    queryKey: ['userBookings', user?.id],
    queryFn: () => bookingApi.getByUser(user?.id || ''),
    enabled: !!user?.id,
  });

  // Active booking
  const activeBooking = bookings.find(b => !['completed', 'cancelled'].includes(b.status));

  // Completed bookings without review
  const completedBookings = bookings.filter(b => b.status === 'completed');

  // Services
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: serviceApi.getAll,
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { bookingId: string; mechanicId: string; rating: number; comment: string }) => reviewApi.create(data),
    onSuccess: () => {
      toast.success(t('common.review_success'));
      setReviewDialog(null);
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
    onError: () => toast.error(t('common.review_error')),
  });

  const handleSOS = async () => {
    try {
      const booking = await bookingApi.sos({
        location: { lat: userLocation.lat, lng: userLocation.lng, address: 'Lokasi GPS saat ini' },
      });
      toast.success('Panggilan darurat terkirim! Mekanik terdekat sedang menuju Anda.');
      navigate(`/customer/tracking/${booking.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim panggilan darurat');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const emergencyServices = services.filter(s => s.isEmergencyAvailable);
  const regularServices = services.filter(s => !s.isEmergencyAvailable);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-2 rounded-xl">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">OKE MEKANIK</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {user?.name || t('role.customer.title')}
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
        {/* SOS Emergency Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-orange-600/30 animate-pulse" />
          <div className="relative p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-3 rounded-xl shadow-lg shadow-red-500/30">
                <AlertTriangle className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-red-400 text-sm uppercase">SOS Darurat</h3>
                <p className="text-xs text-gray-400">Mogok di jalan? Tekan tombol ini!</p>
              </div>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-500 text-white font-black px-6 rounded-xl shadow-lg shadow-red-500/30"
              onClick={handleSOS}
            >
              <Zap className="h-4 w-4 mr-2" /> SOS
            </Button>
          </div>
        </motion.div>

        {/* Active Booking Status */}
        {activeBooking && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-blue-600/10 border-blue-500/20 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Navigation className="h-5 w-5 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-400 font-bold uppercase">{t('dashboard.customer.active_service')}</p>
                      <p className="text-sm font-bold text-white">{activeBooking.problem}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    {activeBooking.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Car className="h-3 w-3" />
                  <span>{activeBooking.vehicle?.brand} {activeBooking.vehicle?.model}</span>
                  <span className="text-gray-600">|</span>
                  <Clock className="h-3 w-3" />
                  <span>ETA {activeBooking.etaMinutes || 15} min</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-500 rounded-xl" onClick={() => navigate(`/customer/tracking/${activeBooking.id}`)}>
                    <MapPin className="h-4 w-4 mr-1" /> {t('dashboard.customer.btn_track')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-white/10 text-white rounded-xl" onClick={() => navigate(`/customer/chat/${activeBooking.id}`)}>
                    <MessageSquare className="h-4 w-4 mr-1" /> {t('dashboard.customer.btn_chat')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Map Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card rounded-2xl overflow-hidden">
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  {t('dashboard.customer.nearby_mech')}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                  {nearbyMechanics.length} online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] md:h-[350px] relative">
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={[userLocation.lat, userLocation.lng]} />
                  
                  {/* User location marker */}
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup className="custom-popup">
                      <div className="text-center p-1">
                        <strong>Lokasi Anda</strong>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Nearby mechanics */}
                  {nearbyMechanics.map((mech) => (
                    <Marker
                      key={mech.id}
                      position={[mech.lat, mech.lng]}
                      icon={mech.isWorkshop ? workshopIcon : mechanicIcon}
                    >
                      <Popup className="custom-popup">
                        <div className="p-2 min-w-[180px]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{mech.avatar || '🔧'}</span>
                            <div>
                              <p className="font-bold text-sm">{mech.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{mech.rating}</span>
                                {mech.distance && (
                                  <span className="text-xs text-gray-500">• {mech.distance.toFixed(1)}km</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{mech.speciality?.join(', ')}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-green-600">Rp {mech.pricePerHour?.toLocaleString()}/jam</span>
                            {mech.etaMinutes && (
                              <span className="text-xs text-blue-600">~{mech.etaMinutes}m</span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg h-7"
                            onClick={() => navigate(`/customer/booking?mechanicId=${mech.id}`)}
                          >
                            Pilih Mekanik
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Service Buttons */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 px-1">Layanan Populer</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '🆘', label: 'Darak/SOS', svcId: 'svc-darurat', color: 'from-red-600 to-red-500' },
              { icon: '🔧', label: 'Ganti Oli', svcId: 'svc-1', color: 'from-blue-600 to-blue-500' },
              { icon: '🛞', label: 'Ban Kempes', svcId: 'svc-3', color: 'from-green-600 to-green-500' },
              { icon: '⚡', label: 'Aki Soak', svcId: 'svc-7', color: 'from-yellow-600 to-yellow-500' },
              { icon: '🛑', label: 'Rem', svcId: 'svc-6', color: 'from-purple-600 to-purple-500' },
              { icon: '❄️', label: 'AC', svcId: 'svc-8', color: 'from-cyan-600 to-cyan-500' },
              { icon: '🔊', label: 'Tune Up', svcId: 'svc-4', color: 'from-orange-600 to-orange-500' },
              { icon: '📋', label: 'Servis', svcId: 'svc-2', color: 'from-pink-600 to-pink-500' },
            ].map((item) => (
              <motion.button
                key={item.svcId}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                onClick={() => navigate(`/customer/booking?serviceId=${item.svcId}`)}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-gray-300">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Nearby Mechanics List */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 px-1">
            {t('dashboard.customer.nearby_mech')} ({nearbyMechanics.length})
          </h3>
          <div className="space-y-2">
            {mechanicsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoaderCircle className="h-6 w-6 text-blue-500 animate-spin" />
              </div>
            ) : nearbyMechanics.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">{t('dashboard.customer.no_nearby')}</p>
            ) : (
              nearbyMechanics.slice(0, 5).map((mech) => (
                <motion.div
                  key={mech.id}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => navigate(`/customer/booking?mechanicId=${mech.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{mech.avatar || '🔧'}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{mech.name}</span>
                        {mech.isWorkshop && (
                          <Badge className="bg-blue-500/20 text-blue-400 text-[8px] border-blue-500/20">BENGKEL</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{mech.speciality?.join(', ')}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs ml-0.5">{mech.rating}</span>
                        </div>
                        {mech.distance !== undefined && (
                          <span className="text-[10px] text-gray-500">{mech.distance.toFixed(1)} km</span>
                        )}
                        {mech.etaMinutes && (
                          <span className="text-[10px] text-green-400">~{mech.etaMinutes} mnt</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-400">Rp {mech.pricePerHour?.toLocaleString()}</p>
                    <Button size="sm" className="mt-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] rounded-lg h-6 px-3">
                      {t('dashboard.customer.btn_select')}
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Service History */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 px-1">{t('dashboard.customer.history')}</h3>
          {completedBookings.length === 0 ? (
            <p className="text-center text-gray-600 text-sm py-6">{t('dashboard.customer.no_history')}</p>
          ) : (
            <div className="space-y-2">
              {completedBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{booking.problem}</p>
                      <p className="text-xs text-gray-500">{booking.vehicle?.brand} {booking.vehicle?.model} • {new Date(booking.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-400">Rp {(booking.finalCost || booking.estimatedCost)?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        {!activeBooking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-2 pb-8"
          >
            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 h-14 rounded-2xl text-lg font-black shadow-xl shadow-blue-500/20"
              onClick={() => navigate('/customer/booking')}
            >
              <Wrench className="h-5 w-5 mr-2" />
              {t('dashboard.customer.btn_call')}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('dashboard.customer.review_title')}</DialogTitle>
            <DialogDescription className="text-gray-400">{t('dashboard.customer.review_desc')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map((star) => (
                <button key={star} onClick={() => setReviewRating(star)} className="text-3xl transition-transform hover:scale-110">
                  {star <= reviewRating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <Textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={t('dashboard.customer.review_placeholder')}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-white/10 text-white" onClick={() => setReviewDialog(null)}>
              {t('dashboard.customer.btn_cancel')}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500"
              onClick={() => reviewDialog && reviewMutation.mutate({
                bookingId: reviewDialog.id,
                mechanicId: reviewDialog.mechanicId,
                rating: reviewRating,
                comment: reviewComment,
              })}
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? '...' : t('dashboard.customer.btn_submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
