import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Car, MapPin, Star, Clock, Bell, Settings,
  Search, ChevronRight, Phone, MessageSquare, Wrench, Navigation, History,
  LogOut, User as UserIcon, StarHalf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { mechanicApi, bookingApi, reviewApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const { data: nearbyMechanics = [], isLoading: loadingMechanics } = useQuery({
    queryKey: ['mechanics-nearby'],
    queryFn: () => mechanicApi.getAll(),
  });

  const { data: activeServices = [] } = useQuery({
    queryKey: ['active-services'],
    queryFn: () => bookingApi.getActiveServices(),
    enabled: !!user,
  });

  const { data: bookingHistory = [] } = useQuery({
      queryKey: ['booking-history', user?.id],
      queryFn: () => bookingApi.getByUser(user?.id || ''),
      enabled: !!user,
  });

  const filteredMechanics = nearbyMechanics.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.speciality?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const reviewMutation = useMutation({
    mutationFn: (data: { bookingId: string; mechanicId: string; rating: number; comment: string }) =>
      reviewApi.create(data),
    onSuccess: () => {
        toast({ title: 'Ulasan Terkirim', description: 'Terima kasih atas masukan Anda!' });
        setIsReviewOpen(false);
        setReviewComment('');
        queryClient.invalidateQueries({ queryKey: ['booking-history'] });
    },
    onError: (error: any) => {
        toast({ title: 'Gagal Mengirim Ulasan', description: error.message, variant: 'destructive' });
    }
  });

  const handleReviewSubmit = () => {
      if (!selectedBookingForReview) return;

      reviewMutation.mutate({
          bookingId: selectedBookingForReview.id,
          mechanicId: selectedBookingForReview.mechanicId,
          rating: reviewRating,
          comment: reviewComment
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 pb-20 relative overflow-hidden">
      {/* Background Holographic Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      {/* Futuristic Nav */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-ultra border-b border-white/10 px-4 py-4 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter">OKE MEKANIK</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-black" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 relative z-10">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
          {/* Welcome Card */}
          <motion.div variants={itemVariants} className="glass-card rounded-[2rem] p-8 border-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-colors" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 border-2 border-blue-500/30 p-1 bg-white/5">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-600/20 text-blue-400 font-black text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-1">Halo, {user?.name}!</h2>
                  <p className="text-gray-400 font-medium">Kendaran Anda butuh bantuan apa hari ini?</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/customer/booking')}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-black rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                PANGGIL SEKARANG <Navigation className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Active Services */}
          <AnimatePresence>
            {activeServices.length > 0 && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                   <Clock className="h-5 w-5 text-blue-400" />
                   <h3 className="text-xl font-black uppercase tracking-widest text-blue-400 italic">Layanan Aktif</h3>
                </div>
                {activeServices.map(service => (
                  <motion.div
                    key={service.id}
                    layoutId={service.id}
                    className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500 flex items-center justify-between group cursor-pointer"
                    onClick={() => navigate(`/customer/tracking/${service.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600/10 p-4 rounded-xl">
                        <Car className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-bold text-lg">{service.vehicle.brand} {service.vehicle.model}</h4>
                          <Badge className="bg-blue-500/20 text-blue-400 border-none capitalize">{service.status}</Badge>
                        </div>
                        <p className="text-gray-400 text-sm">Sedang ditangani oleh {nearbyMechanics.find(m => m.id === service.mechanicId)?.name || 'Mekanik'}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                  </motion.div>
                ))}
              </motion.section>
            )}
          </AnimatePresence>

          {/* Search & Mechanics */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                 <Wrench className="h-5 w-5 text-blue-400" />
                 <h3 className="text-xl font-black uppercase tracking-widest text-blue-400 italic">MEKANIK TERDEKAT</h3>
              </div>
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari mekanik atau layanan..."
                  className="pl-10 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingMechanics ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-64 glass-card rounded-2xl animate-pulse" />
                ))
              ) : (
                filteredMechanics.map(mechanic => (
                  <motion.div
                    key={mechanic.id}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/customer/booking?mechanicId=${mechanic.id}`)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-4xl bg-white/5 p-4 rounded-2xl group-hover:scale-110 transition-transform">{mechanic.avatar || '👨‍🔧'}</div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">ONLINE</Badge>
                      </div>
                      <h4 className="text-xl font-bold mb-1">{mechanic.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mechanic.speciality?.map(s => (
                          <Badge key={s} variant="secondary" className="bg-white/5 text-gray-400 text-[10px]">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center text-yellow-500">
                             <Star className="h-4 w-4 fill-current mr-1" />
                             <span className="font-bold text-gray-300">{mechanic.rating}</span>
                          </div>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400">ETA 15m</span>
                        </div>
                        <p className="font-black text-blue-400">Rp {mechanic.pricePerHour?.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* History */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
               <History className="h-5 w-5 text-blue-400" />
               <h3 className="text-xl font-black uppercase tracking-widest text-blue-400 italic">Riwayat Layanan</h3>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">KENDARAAN</th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">TANGGAL</th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">TOTAL</th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingHistory.filter(b => b.status === 'completed').length === 0 ? (
                        <tr>
                           <td colSpan={4} className="p-10 text-center text-gray-500 italic">Belum ada riwayat layanan</td>
                        </tr>
                    ) : (
                        bookingHistory.filter(b => b.status === 'completed').map(booking => (
                            <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                              <td className="p-4">
                                <div className="font-bold">{booking.vehicle.brand} {booking.vehicle.model}</div>
                                <div className="text-[10px] text-gray-500 font-mono">{booking.vehicle.licensePlate}</div>
                              </td>
                              <td className="p-4 text-sm text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</td>
                              <td className="p-4 font-bold text-blue-400">Rp {booking.estimatedCost?.toLocaleString()}</td>
                              <td className="p-4 text-right">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-[10px] h-7"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedBookingForReview(booking);
                                        setIsReviewOpen(true);
                                    }}
                                >
                                    Beri Ulasan
                                </Button>
                              </td>
                            </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </motion.div>
      </main>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="glass-card border-none text-white max-w-md">
            <DialogHeader>
                <DialogTitle className="text-2xl font-black italic tracking-tighter text-blue-400">BERI ULASAN</DialogTitle>
                <DialogDescription className="text-gray-400">Bantu kami meningkatkan layanan dengan memberikan feedback Anda.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
                <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-8 w-8 cursor-pointer transition-all ${star <= reviewRating ? 'text-yellow-500 fill-current scale-110' : 'text-gray-600'}`}
                            onClick={() => setReviewRating(star)}
                        />
                    ))}
                </div>
                <Textarea
                    placeholder="Ceritakan pengalaman Anda..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                />
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsReviewOpen(false)}>Batal</Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 font-bold px-8"
                    onClick={handleReviewSubmit}
                    disabled={reviewMutation.isPending}
                >
                    {reviewMutation.isPending ? 'Mengirim...' : 'Kirim Ulasan'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Futuristic Bottom Bar (Mobile) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-card rounded-3xl p-4 flex justify-between items-center border-white/10 z-50 shadow-2xl">
        <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-white/5">
          <Car className="h-6 w-6" />
        </Button>
        <Button
            onClick={() => navigate('/customer/booking')}
            className="bg-blue-600 hover:bg-blue-700 h-12 w-12 rounded-2xl shadow-lg shadow-blue-900/40 p-0"
        >
          <Navigation className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-white/5">
          <UserIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
