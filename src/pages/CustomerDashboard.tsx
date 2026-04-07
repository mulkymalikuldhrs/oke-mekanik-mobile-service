import { useState, useEffect } from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Plus, History, AlertTriangle, LogOut, LoaderCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
          // Fallback to Jakarta
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
      toast.success(t('dashboard.customer.review_success') || 'Review submitted!');
      setReviewDialogOpen(false);
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['customerBookings'] });
    },
    onError: () => {
      toast.error(t('dashboard.customer.review_error') || 'Failed to submit review.');
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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-[40px] border-b border-white/10 sticky top-0 z-50">
        <div className="flex justify-between items-center p-4 md:px-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">OKE MEKANIK</h1>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{t('role.customer.title')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-500/10 hover:text-red-500 text-gray-400 transition-colors"
              onClick={() => { logout(); navigate('/'); }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6 relative z-10">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-500/30 backdrop-blur-[40px] shadow-2xl overflow-hidden group relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[80px] -mr-20 -mt-20 group-hover:bg-blue-500/40 transition-all duration-700 animate-pulse" />
          <CardContent className="p-8 relative z-10">
            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tighter italic uppercase">{t('dashboard.customer.help_title')}</h2>
            <p className="mb-8 text-gray-300 text-lg font-medium">{t('dashboard.customer.help_subtitle')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-16 text-xl shadow-xl shadow-blue-500/30 transition-all active:scale-95"
                onClick={() => navigate('/customer/booking')}
              >
                <Plus className="h-7 w-7 mr-2" />
                {t('dashboard.customer.btn_call')}
              </Button>
              <Button 
                size="lg" 
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black rounded-2xl h-16 text-xl backdrop-blur-[40px] transition-all active:scale-95"
                onClick={() => navigate('/customer/booking')}
              >
                <AlertTriangle className="h-7 w-7 mr-2 animate-bounce" />
                {t('dashboard.customer.btn_emergency')}
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Active Service */}
        {activeBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
          <Card className="border-orange-500/50 bg-orange-500/10 backdrop-blur-[40px] relative overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse-border">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-transparent animate-shimmer" />
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400 uppercase">
                <Clock className="h-5 w-5 mr-2 animate-pulse" />
                {t('dashboard.customer.active_service')} - {activeBooking.status.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-semibold text-white">{t('dashboard.customer.heading_to_loc')}</p>
                  <p className="text-sm text-gray-400">{t('dashboard.customer.vehicle')} {activeBooking.vehicle?.brand} {activeBooking.vehicle?.model}</p>
                  <p className="text-sm text-gray-400">{t('dashboard.customer.problem')} {activeBooking.problem}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10"
                    onClick={() => navigate(`/customer/chat/${activeBooking.id}`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('dashboard.customer.btn_chat')}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                    onClick={() => navigate(`/customer/tracking/${activeBooking.id}`)}
                  >
                    {t('dashboard.customer.btn_track')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        )}

        {/* Nearby Mechanics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
        <Card className="glass-card relative overflow-hidden hover:border-blue-500/50 transition-all duration-500 backdrop-blur-[40px] border-white/10">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/50" />
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-black text-white italic tracking-tight uppercase">
              <MapPin className="h-6 w-6 mr-3 text-blue-400" />
              {t('dashboard.customer.nearby_mech')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingMechanics ? (
              <div className="space-y-4 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-xl bg-white/10" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-white/10" />
                        <Skeleton className="h-3 w-48 bg-white/5" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-20 rounded-xl bg-white/10" />
                  </div>
                ))}
              </div>
            ) : nearbyMechanics && nearbyMechanics.length > 0 ? (
              nearbyMechanics.slice(0, 5).map((mechanic) => (
                <div key={mechanic.id} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl bg-white/5 p-2 rounded-xl">{mechanic.avatar || '👨‍🔧'}</div>
                    <div>
                      <h3 className="font-semibold text-white">{mechanic.name}</h3>
                      <p className="text-sm text-gray-400">{mechanic.speciality?.join(', ')}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1 text-gray-300">{mechanic.rating?.toFixed(1)}</span>
                        </div>
                        {mechanic.isOnline && (
                          <Badge variant="outline" className="text-[10px] h-4 bg-green-500/10 text-green-400 border-green-500/20 uppercase font-black">{t('dashboard.mechanic.online')}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-400">Rp {mechanic.pricePerHour?.toLocaleString()}/jam</p>
                    <Button
                      size="sm"
                      className="mt-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl"
                      onClick={() => navigate(`/customer/booking?mechanicId=${mechanic.id}`)}
                    >
                      {t('dashboard.customer.btn_select')}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">{t('dashboard.customer.no_nearby')}</p>
            )}
          </CardContent>
        </Card>
        </motion.div>

        {/* Recent Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
        <Card className="glass-card backdrop-blur-[40px] border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white uppercase font-black tracking-tight italic">
              <History className="h-5 w-5 mr-2 text-green-400" />
              {t('dashboard.customer.history')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingBookings ? (
              <div className="flex items-center justify-center py-8">
                <LoaderCircle className="h-6 w-6 animate-spin text-green-400" />
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl">
                  <div>
                    <h3 className="font-semibold text-white">{booking.problem}</h3>
                    <p className="text-sm text-gray-400">{t('dashboard.customer.vehicle')} {booking.vehicle?.brand} {booking.vehicle?.model}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-green-400">Rp {booking.estimatedCost?.toLocaleString()}</p>
                    <Badge variant="outline" className="my-1 bg-green-500/10 text-green-400 border-green-500/20">{t('dashboard.customer.status_completed')}</Badge>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-[10px] h-6 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      onClick={() => handleOpenReview(booking)}
                    >
                      {t('dashboard.customer.btn_review')}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">{t('dashboard.customer.no_history')}</p>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white backdrop-blur-[40px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter text-blue-400 flex items-center uppercase">
              <Star className="mr-2 h-6 w-6 fill-blue-400" />
              {t('dashboard.customer.review_title')}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {t('dashboard.customer.review_desc')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className="transition-transform active:scale-90"
                >
                  <Star className={`h-10 w-10 ${s <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t('dashboard.customer.review_label')}</label>
              <Textarea
                placeholder={t('dashboard.customer.review_placeholder')}
                className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-2xl focus:ring-blue-500/50"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setReviewDialogOpen(false)} className="text-gray-400 hover:text-white">
              {t('dashboard.customer.btn_cancel')}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8"
              onClick={handleSubmitReview}
              disabled={submitReviewMutation.isPending}
            >
              {submitReviewMutation.isPending ? t('dashboard.customer.submitting') : t('dashboard.customer.btn_submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
