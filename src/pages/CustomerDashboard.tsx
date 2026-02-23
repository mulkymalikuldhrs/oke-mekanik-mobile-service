import { useState, useEffect } from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Plus, History, AlertTriangle, LogOut, LoaderCircle, CheckCircle2 } from 'lucide-react';
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

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: bookings, isLoading: isLoadingBookings, error } = useQuery({
    queryKey: ['customerBookings', user?.id],
    queryFn: () => bookingApi.getByUser(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: nearbyMechanics, isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['nearbyMechanics'],
    queryFn: () => mechanicApi.getNearby(-6.2088, 106.8456, 15), // Jakarta default
  });

  const submitReviewMutation = useMutation({
    mutationFn: (data: any) => reviewApi.create(data),
    onSuccess: () => {
      toast.success('Ulasan berhasil dikirim!');
      setReviewDialogOpen(false);
      setComment('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['customerBookings'] });
    },
    onError: () => {
      toast.error('Gagal mengirim ulasan.');
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
      userId: user?.id,
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
          <h2 className="mt-4 text-xl font-semibold text-white">Gagal memuat data</h2>
          <p className="text-gray-400">Terjadi kesalahan saat mengambil data.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 font-sans">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"
        />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="flex justify-between items-center p-4 md:px-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter">OKE MEKANIK</h1>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 space-y-6 relative z-10"
      >
        {/* Quick Actions */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden group relative rounded-[2rem]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[80px] -mr-20 -mt-20 group-hover:bg-blue-500/40 transition-all duration-700 animate-pulse" />
            <CardContent className="p-8 relative z-10">
              <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tighter italic">BUTUH BANTUAN?</h2>
              <p className="mb-8 text-gray-300 text-lg font-medium">Panggil mekanik profesional dalam hitungan detik. Layanan 24/7 di lokasi Anda.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-16 text-xl shadow-xl shadow-blue-500/30 transition-all active:scale-95"
                  onClick={() => navigate('/customer/booking')}
                >
                  <Plus className="h-7 w-7 mr-2" />
                  PANGGIL SEKARANG
                </Button>
                <Button
                  size="lg"
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black rounded-2xl h-16 text-xl backdrop-blur-md transition-all active:scale-95"
                  onClick={() => navigate('/customer/booking')}
                >
                  <AlertTriangle className="h-7 w-7 mr-2 animate-bounce" />
                  DARURAT
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Service */}
        <AnimatePresence>
          {activeBooking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-orange-500/30 bg-orange-500/5 backdrop-blur-3xl relative overflow-hidden rounded-[1.5rem] shadow-orange-500/10 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-transparent" />
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-400 font-black tracking-tight italic">
                    <Clock className="h-6 w-6 mr-2 animate-pulse" />
                    LAYANAN AKTIF • {activeBooking.status.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="font-bold text-xl text-white">Mekanik Sedang Menuju Lokasi</p>
                      <p className="text-gray-400">Kendaraan: <span className="text-white font-semibold">{activeBooking.vehicle?.brand} {activeBooking.vehicle?.model}</span></p>
                      <p className="text-gray-400">Masalah: <span className="text-white">{activeBooking.problem}</span></p>
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none border-white/10 text-white hover:bg-white/10 rounded-xl h-12 px-6 font-bold"
                        onClick={() => navigate(`/customer/chat/${activeBooking.id}`)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button
                        className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-blue-500/20"
                        onClick={() => navigate(`/customer/tracking/${activeBooking.id}`)}
                      >
                        Lacak Lokasi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nearby Mechanics */}
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-black text-white italic tracking-tight">
              <MapPin className="h-6 w-6 mr-3 text-blue-400" />
              MEKANIK TERDEKAT
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
                          <Badge variant="outline" className="text-[10px] h-4 bg-green-500/10 text-green-400 border-green-500/20">Online</Badge>
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
                      Pilih
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Tidak ada mekanik tersedia saat ini</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white">
              <History className="h-5 w-5 mr-2 text-green-400" />
              Riwayat Layanan
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
                    <p className="text-sm text-gray-400">Kendaraan: {booking.vehicle?.brand} {booking.vehicle?.model}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-bold text-green-400">Rp {booking.estimatedCost?.toLocaleString()}</p>
                    <Badge variant="outline" className="my-1 bg-green-500/10 text-green-400 border-green-500/20">Selesai</Badge>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-[10px] h-6 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      onClick={() => handleOpenReview(booking)}
                    >
                      Beri Ulasan
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada riwayat layanan</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white backdrop-blur-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter text-blue-400 flex items-center">
              <Star className="mr-2 h-6 w-6 fill-blue-400" />
              BERI ULASAN
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Bagaimana pengalaman Anda dengan layanan ini?
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
              <label className="text-sm font-bold uppercase tracking-widest text-gray-500">Komentar Anda</label>
              <Textarea
                placeholder="Ceritakan pengalaman Anda..."
                className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-2xl focus:ring-blue-500/50"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setReviewDialogOpen(false)} className="text-gray-400 hover:text-white">
              Batal
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8"
              onClick={handleSubmitReview}
              disabled={submitReviewMutation.isPending}
            >
              {submitReviewMutation.isPending ? 'Mengirim...' : 'Kirim Ulasan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
