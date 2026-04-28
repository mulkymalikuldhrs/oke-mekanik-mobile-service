import { useState, useEffect } from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Plus, History, AlertTriangle, LogOut, LoaderCircle, CheckCircle2, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingApi, mechanicApi, reviewApi } from '@/lib/api';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const ServiceHistoryTimeline = ({ bookings, t, onReview }: { bookings: any[], t: any, onReview: (b: any) => void }) => {
  return (
    <div className="space-y-4 mt-4">
      {bookings.map((booking, idx) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative pl-6 border-l border-white/10 pb-4 last:pb-0"
        >
          <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xs font-mono text-gray-500 uppercase mb-1">{new Date(booking.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{booking.problem}</h4>
                <p className="text-xs text-gray-400 mt-1">{booking.vehicle?.brand} {booking.vehicle?.model} • {booking.vehicle?.licensePlate}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] uppercase font-black tracking-tighter">
                  Done
                </Badge>
                <Button
                  size="xs"
                  variant="ghost"
                  className="h-6 text-[9px] text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-0 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(booking);
                  }}
                >
                  {t('dashboard.customer.btn_review')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation({ lat: -6.2088, lng: 106.8456 });
        }
      );
    } else {
      setUserLocation({ lat: -6.2088, lng: 106.8456 });
    }
  }, []);

  const { data: bookings, isLoading: isLoadingBookings, error } = useQuery({
    queryKey: ['customerBookings', user?.id],
    queryFn: () => bookingApi.getByUser(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: nearbyMechanics, isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['nearbyMechanics', userLocation],
    queryFn: () => mechanicApi.getNearby(userLocation!.lat, userLocation!.lng, 15),
    enabled: !!userLocation,
  });

  const submitReviewMutation = useMutation({
    mutationFn: (data: any) => reviewApi.create(data),
    onSuccess: () => {
      toast.success(t('common.review_success'));
      setReviewDialogOpen(false);
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['customerBookings'] });
    },
    onError: () => {
      toast.error(t('common.review_error'));
    }
  });

  const handleOpenReview = (booking: any) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedBooking) return;
    submitReviewMutation.mutate({
      bookingId: selectedBooking.id,
      mechanicId: selectedBooking.mechanicId,
      rating,
      comment
    });
  };

  const activeBooking = bookings?.find(b => 
    ['pending', 'accepted', 'otw', 'arrived', 'working'].includes(b.status)
  );
  const recentBookings = bookings?.filter(b => b.status === 'completed').slice(0, 5) || [];

  if (isLoadingBookings) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-4 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-40 bg-white/5" />
          <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl bg-white/5" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
          <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-white">{t('error.load_failed')}</h2>
          <p className="text-gray-400">{t('error.data_error')}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>{t('common.retry')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 overflow-x-hidden">
      {/* Dynamic Futuristic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[160px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/5 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-[160px] border-b border-white/5 sticky top-0 z-50">
        <div className="flex justify-between items-center p-4 md:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-4"
          >
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">OKE MEKANIK</h1>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">{t('role.customer.title')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-4"
          >
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <p className="text-[10px] text-gray-500 font-mono">{user?.email}</p>
            </div>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-500/10 hover:text-red-500 text-gray-400 transition-all rounded-xl"
              onClick={() => { logout(); navigate('/'); }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </header>

      <motion.div
        className="container mx-auto p-4 md:p-8 space-y-8 relative z-10 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Banner / Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border border-white/10 backdrop-blur-[160px] shadow-2xl overflow-hidden group relative rounded-[2.5rem]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-all duration-700 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 uppercase tracking-widest font-black text-[10px] px-3 py-1">
                    System Ready v5.4.1
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-tight">
                    {t('dashboard.customer.help_title') || 'Butuh Mekanik?'}
                  </h2>
                  <p className="text-gray-400 text-lg font-medium max-w-xl">
                    {t('dashboard.customer.help_subtitle') || 'Pesan mekanik ahli langsung ke lokasi Anda dalam hitungan menit.'}
                  </p>
                </div>

                <div className="flex flex-col w-full md:w-auto gap-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-16 md:px-12 text-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 group/btn"
                    onClick={() => navigate('/customer/booking')}
                  >
                    <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                    {t('dashboard.customer.btn_call')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-red-500/5 hover:bg-red-500/10 text-red-500 border-red-500/20 font-black rounded-2xl h-16 md:px-12 text-xl backdrop-blur-[160px] transition-all active:scale-95"
                    onClick={() => navigate('/customer/booking')}
                  >
                    <AlertTriangle className="h-6 w-6 mr-3 animate-pulse" />
                    {t('dashboard.customer.btn_emergency')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (Left/Middle) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Service Status */}
            <AnimatePresence mode="wait">
              {activeBooking ? (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  variants={itemVariants}
                >
                  <Card className="border-orange-500/50 bg-orange-500/5 backdrop-blur-[160px] relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.15)] rounded-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-transparent animate-shimmer" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center text-orange-500 uppercase font-black tracking-tighter italic text-xl">
                          <Zap className="h-5 w-5 mr-2 fill-orange-500 animate-bounce" />
                          {t('dashboard.customer.active_service')}
                        </CardTitle>
                        <Badge className="bg-orange-600 text-white font-black uppercase tracking-widest text-[10px]">
                          {activeBooking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-2">
                        <div className="flex-1 space-y-2">
                          <h4 className="text-2xl font-black text-white">{activeBooking.problem}</h4>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Car className="h-4 w-4 mr-2" />
                            {activeBooking.vehicle?.brand} {activeBooking.vehicle?.model} • {activeBooking.vehicle?.licensePlate}
                          </div>
                          <div className="flex items-center text-blue-400 text-xs font-mono mt-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {activeBooking.location?.address?.substring(0, 50)}...
                          </div>
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 md:flex-none border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl"
                            onClick={() => navigate(`/customer/chat/${activeBooking.id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                            {t('dashboard.customer.btn_chat')}
                          </Button>
                          <Button
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20"
                            onClick={() => navigate(`/customer/tracking/${activeBooking.id}`)}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {t('dashboard.customer.btn_track')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                 <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 border-dashed border-white/10 backdrop-blur-[160px] rounded-3xl py-12 flex flex-col items-center justify-center text-center">
                       <div className="bg-white/5 p-4 rounded-full mb-4">
                          <CheckCircle2 className="h-8 w-8 text-gray-600" />
                       </div>
                       <h3 className="text-xl font-bold text-gray-400">{t('dashboard.customer.no_active') || 'Tidak ada layanan aktif'}</h3>
                       <p className="text-sm text-gray-600 mt-2">{t('dashboard.customer.no_active_desc') || 'Pesan sekarang untuk mendapatkan bantuan.'}</p>
                    </Card>
                 </motion.div>
              )}
            </AnimatePresence>

            {/* Nearby Mechanics */}
            <motion.div variants={itemVariants}>
              <Card className="bg-black/40 border border-white/10 backdrop-blur-[160px] rounded-[2rem] overflow-hidden shadow-2xl group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30 group-hover:bg-blue-500 transition-all" />
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-black text-white italic tracking-tight uppercase">
                    <MapPin className="h-6 w-6 mr-3 text-blue-400" />
                    {t('dashboard.customer.nearby_mech')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingMechanics ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white/5" />
                      ))}
                    </div>
                  ) : nearbyMechanics && nearbyMechanics.length > 0 ? (
                    nearbyMechanics.slice(0, 4).map((mechanic) => (
                      <div key={mechanic.id} className="group/item flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl bg-white/5 p-3 rounded-2xl group-hover/item:scale-110 transition-transform">{mechanic.avatar || '👨‍🔧'}</div>
                          <div>
                            <h3 className="font-bold text-lg text-white flex items-center">
                              {mechanic.name}
                              <Badge className="ml-2 bg-blue-500/10 text-blue-400 border-none text-[9px] uppercase tracking-tighter">Verified</Badge>
                            </h3>
                            <p className="text-xs text-gray-400">{mechanic.speciality?.join(', ')}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <div className="flex items-center">
                                <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                                <span className="text-xs ml-1 text-gray-300 font-bold">{mechanic.rating?.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                15m
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-blue-400 leading-none">Rp {mechanic.pricePerHour?.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-1 mb-3">per hour</p>
                          <Button
                            size="sm"
                            className="bg-white/10 hover:bg-blue-600 text-white rounded-xl px-4 transition-all"
                            onClick={() => navigate(`/customer/booking?mechanicId=${mechanic.id}`)}
                          >
                            {t('dashboard.customer.btn_select')}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 font-medium">{t('dashboard.customer.no_nearby')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar Content (Right) */}
          <div className="space-y-8">
            {/* Service History Timeline */}
            <motion.div variants={itemVariants}>
              <Card className="bg-black/40 border border-white/10 backdrop-blur-[160px] rounded-[2rem] overflow-hidden shadow-2xl h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-white uppercase font-black tracking-tight italic">
                    <History className="h-5 w-5 mr-2 text-green-400" />
                    {t('dashboard.customer.history')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingBookings ? (
                    <div className="flex justify-center py-10">
                       <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : recentBookings.length > 0 ? (
                    <ServiceHistoryTimeline bookings={recentBookings} t={t} onReview={handleOpenReview} />
                  ) : (
                    <p className="text-center text-gray-600 py-10 text-sm italic">{t('dashboard.customer.no_history')}</p>
                  )}

                  {recentBookings.length > 0 && (
                     <Button variant="ghost" className="w-full mt-6 text-xs text-gray-500 hover:text-white uppercase font-black tracking-widest">
                        View All History
                     </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Stats */}
            <motion.div variants={itemVariants}>
               <Card className="bg-gradient-to-br from-green-600/10 to-blue-600/10 border border-white/5 backdrop-blur-[160px] rounded-[2rem] p-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-2xl font-black text-white">{bookings?.length || 0}</p>
                        <p className="text-[9px] uppercase font-black text-gray-500 tracking-wider">Total Orders</p>
                     </div>
                     <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-2xl font-black text-green-400">4.9</p>
                        <p className="text-[9px] uppercase font-black text-gray-500 tracking-wider">Avg Rating</p>
                     </div>
                  </div>
               </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border border-white/10 text-white backdrop-blur-[160px] rounded-[2rem] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter text-blue-400 flex items-center uppercase">
              <Star className="mr-3 h-8 w-8 fill-blue-400 animate-pulse" />
              {t('dashboard.customer.review_title')}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-base">
              {t('dashboard.customer.review_desc') || 'Bagaimana pengalaman Anda dengan mekanik kami?'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-8">
            <div className="flex justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className="transition-all hover:scale-125 active:scale-90 p-1"
                >
                  <Star className={`h-12 w-12 transition-colors ${s <= rating ? 'fill-yellow-500 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'text-white/10'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/70 ml-1">{t('dashboard.customer.review_label') || 'KOMENTAR ANDA'}</label>
              <Textarea
                placeholder={t('dashboard.customer.review_placeholder') || 'Tulis ulasan Anda di sini...'}
                className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-[1.5rem] focus:ring-blue-500/50 resize-none transition-all focus:bg-white/10"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setReviewDialogOpen(false)} className="flex-1 text-gray-500 hover:text-white rounded-xl">
              {t('dashboard.customer.btn_cancel')}
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl h-12 shadow-lg shadow-blue-500/20"
              onClick={handleSubmitReview}
              disabled={submitReviewMutation.isPending}
            >
              {submitReviewMutation.isPending ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                t('dashboard.customer.btn_submit')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
