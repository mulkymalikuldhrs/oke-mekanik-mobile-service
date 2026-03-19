import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Wrench, Star, Clock, DollarSign, MessageSquare,
  MapPin, CheckCircle, XCircle, Bell, Settings,
  BarChart3, User, LogOut, ChevronRight, Car, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { mechanicApi, bookingApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const MechanicDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(true);

  const { data: mechanicProfile = {} } = useQuery({
    queryKey: ['mechanic-profile', user?.id],
    queryFn: () => mechanicApi.getById(user?.id || ''),
    enabled: !!user,
  });

  const { data: pendingBookings = [] } = useQuery({
    queryKey: ['pending-bookings'],
    queryFn: () => bookingApi.getByMechanic(user?.id || ''),
    enabled: !!user,
    select: (data) => data.filter(b => b.status === 'pending')
  });

  const { data: activeBookings = [] } = useQuery({
    queryKey: ['active-bookings'],
    queryFn: () => bookingApi.getByMechanic(user?.id || ''),
    enabled: !!user,
    select: (data) => data.filter(b => ['accepted', 'arrived', 'in_progress'].includes(b.status))
  });

  const { data: bookingHistory = [] } = useQuery({
      queryKey: ['mechanic-history', user?.id],
      queryFn: () => bookingApi.getByMechanic(user?.id || ''),
      enabled: !!user,
      select: (data) => data.filter(b => b.status === 'completed')
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      bookingApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['active-bookings'] });
      toast({ title: 'Status Diperbarui', description: 'Permintaan berhasil diproses.' });
    }
  });

  const revenueData = [
    { name: 'Sen', amount: 450000 },
    { name: 'Sel', amount: 320000 },
    { name: 'Rab', amount: 580000 },
    { name: 'Kam', amount: 420000 },
    { name: 'Jum', amount: 650000 },
    { name: 'Sab', amount: 890000 },
    { name: 'Min', amount: 750000 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 pb-20 relative overflow-hidden">
      {/* Background Holographic Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
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
            <h1 className="text-xl font-black italic tracking-tighter">OKE MEKANIK PRO</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white/5 p-1 rounded-full border border-white/10 px-3">
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-bold text-gray-400">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] bg-white/5 hover:bg-white/10"
                onClick={() => setIsOnline(!isOnline)}
              >
                GANTI
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <Bell className="h-5 w-5" />
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
          {/* Pro Mechanic Profile Card */}
          <motion.div variants={itemVariants} className="glass-card rounded-[2rem] p-8 border-blue-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-colors" />
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
               <div className="flex items-center space-x-6">
                 <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-blue-500/30 p-1 bg-white/5">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-600/20 text-blue-400 font-black text-3xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-4 border-[#050505] rounded-full" />
                 </div>
                 <div>
                   <h2 className="text-3xl font-black tracking-tight mb-1">{user?.name}</h2>
                   <div className="flex items-center space-x-4">
                     <div className="flex items-center text-yellow-500">
                       <Star className="h-4 w-4 fill-current mr-1" />
                       <span className="font-bold text-gray-300">{mechanicProfile.rating || 4.8}</span>
                     </div>
                     <span className="text-gray-500">•</span>
                     <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-none capitalize">{mechanicProfile.speciality?.join(', ') || 'Senior Mechanic'}</Badge>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">TOTAL JOBS</p>
                    <p className="text-2xl font-black text-white">{bookingHistory.length + 15}</p>
                 </div>
                 <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 text-center">
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">REVENUE</p>
                    <p className="text-2xl font-black text-blue-400">Rp 4.2M</p>
                 </div>
               </div>
             </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Requests */}
            <div className="lg:col-span-2 space-y-6">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-orange-400" />
                    <h3 className="text-xl font-black uppercase tracking-widest text-orange-400 italic">Antrean Masuk</h3>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-400 border-none">{pendingBookings.length} Baru</Badge>
                </div>

                <AnimatePresence mode="popLayout">
                  {pendingBookings.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 glass-card rounded-2xl text-center text-gray-500 italic">
                      Menunggu permintaan layanan baru...
                    </motion.div>
                  ) : (
                    pendingBookings.map(booking => (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="glass-card p-6 rounded-2xl border-l-4 border-l-orange-500 group"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex items-start space-x-4">
                            <div className="bg-orange-500/10 p-4 rounded-xl">
                              <Car className="h-8 w-8 text-orange-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg mb-1">{booking.vehicle.brand} {booking.vehicle.model}</h4>
                              <div className="flex items-center text-gray-400 text-sm mb-3">
                                <MapPin className="h-4 w-4 mr-1 text-blue-400" />
                                {booking.location.address}
                              </div>
                              <div className="bg-white/5 p-3 rounded-xl border border-white/5 italic text-sm text-gray-300">
                                "{booking.problem}"
                              </div>
                            </div>
                          </div>
                          <div className="flex md:flex-col gap-2 justify-end">
                            <Button
                                className="bg-green-600 hover:bg-green-700 font-bold px-6"
                                onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'accepted' })}
                            >
                                TERIMA
                            </Button>
                            <Button
                                variant="outline"
                                className="border-red-500/50 text-red-500 hover:bg-red-500/10 font-bold"
                                onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'cancelled' })}
                            >
                                TOLAK
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </section>

              {/* Active Jobs */}
              <section className="space-y-4">
                <div className="flex items-center space-x-2">
                   <Clock className="h-5 w-5 text-blue-400" />
                   <h3 className="text-xl font-black uppercase tracking-widest text-blue-400 italic">Pekerjaan Aktif</h3>
                </div>
                {activeBookings.length === 0 ? (
                    <div className="p-10 glass-card rounded-2xl text-center text-gray-500 italic border-white/5">
                        Belum ada pekerjaan yang sedang berjalan
                    </div>
                ) : (
                    activeBookings.map(booking => (
                        <div key={booking.id} className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500">
                           <div className="flex justify-between items-center mb-4">
                                <div>
                                    <Badge className="bg-blue-500/20 text-blue-400 border-none mb-2 capitalize">{booking.status.replace('_', ' ')}</Badge>
                                    <h4 className="font-bold text-lg">{booking.vehicle.brand} {booking.vehicle.model}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">ESTIMASI</p>
                                    <p className="font-black text-blue-400">Rp {booking.estimatedCost?.toLocaleString()}</p>
                                </div>
                           </div>
                           <div className="flex gap-2">
                                <Button className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10" onClick={() => navigate(`/mechanic/chat/${booking.id}`)}>
                                    <MessageSquare className="h-4 w-4 mr-2" /> CHAT
                                </Button>
                                {booking.status === 'accepted' && (
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'arrived' })}>
                                        SAYA SUDAH TIBA
                                    </Button>
                                )}
                                {booking.status === 'arrived' && (
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'in_progress' })}>
                                        MULAI PENGERJAAN
                                    </Button>
                                )}
                                {booking.status === 'in_progress' && (
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 font-bold" onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'completed' })}>
                                        SELESAIKAN
                                    </Button>
                                )}
                           </div>
                        </div>
                    ))
                )}
              </section> section
            </div>

            {/* Analytics Sidebar */}
            <div className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center space-x-2">
                   <BarChart3 className="h-5 w-5 text-blue-400" />
                   <h3 className="text-xl font-black uppercase tracking-widest text-blue-400 italic">Statistik</h3>
                </div>
                <Card className="glass-card border-none rounded-2xl overflow-hidden p-6">
                   <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Pendapatan Mingguan</p>
                   <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={revenueData}>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                         <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }}
                         />
                         <YAxis hide />
                         <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                         />
                         <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                            {revenueData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 4 ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)'} className="animate-shimmer" />
                            ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                </Card>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-2">
                   <History className="h-5 w-5 text-blue-400" />
                   <h3 className="text-xl font-black uppercase tracking-widest text-blue-400 italic">Riwayat Terkini</h3>
                </div>
                <div className="space-y-3">
                  {bookingHistory.length === 0 ? (
                      <div className="p-6 glass-card rounded-2xl text-center text-gray-500 text-xs italic">Belum ada riwayat</div>
                  ) : (
                    bookingHistory.slice(0, 3).map(booking => (
                        <div key={booking.id} className="glass-card p-4 rounded-xl flex items-center justify-between border-white/5">
                           <div>
                             <h5 className="font-bold text-sm">{booking.vehicle.brand}</h5>
                             <p className="text-[10px] text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                           </div>
                           <p className="font-black text-blue-400 text-sm">Rp {booking.estimatedCost?.toLocaleString()}</p>
                        </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Futuristic Bottom Bar (Mobile) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-card rounded-3xl p-4 flex justify-between items-center border-white/10 z-50 shadow-2xl">
        <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-white/5">
          <BarChart3 className="h-6 w-6" />
        </Button>
        <div className="relative">
            <Button
                className="bg-blue-600 hover:bg-blue-700 h-12 w-12 rounded-2xl shadow-lg shadow-blue-900/40 p-0"
            >
            <Bell className="h-6 w-6" />
            </Button>
            {pendingBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black animate-bounce">
                    {pendingBookings.length}
                </span>
            )}
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-white/5">
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MechanicDashboard;
