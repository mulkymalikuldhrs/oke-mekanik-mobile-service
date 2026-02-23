import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, Star, LogOut, LoaderCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { mechanicApi, bookingApi, reviewApi } from '@/lib/api';

const MechanicDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(true);

  const { data: mechanicData, isLoading, error } = useQuery({
    queryKey: ['mechanicDashboard'],
    queryFn: () => mechanicApi.getById(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: bookings } = useQuery({
    queryKey: ['mechanicBookings', user?.id],
    queryFn: () => bookingApi.getByMechanic(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['mechanicReviews', mechanicData?.id],
    queryFn: () => reviewApi.getByMechanicId(mechanicData?.id || ''),
    enabled: !!mechanicData?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      bookingApi.updateStatus(id, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanicBookings'] });
    },
  });

  const pendingOrders = bookings?.filter(b => b.status === 'pending') || [];
  const currentJob = bookings?.find(b => 
    ['accepted', 'otw', 'arrived', 'working'].includes(b.status)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-4 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-40 bg-white/5" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-20 bg-white/5" />
            <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full bg-white/5 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Gagal memuat data</h2>
          <p className="text-gray-600">Terjadi kesalahan saat mengambil data.</p>
        </div>
      </div>
    );
  }

  const handleAcceptOrder = (orderId: string) => {
    updateStatusMutation.mutate({ id: orderId, status: 'accepted' });
  };

  const handleRejectOrder = (orderId: string) => {
    updateStatusMutation.mutate({ id: orderId, status: 'cancelled' });
  };

  const handleCompleteJob = (orderId: string) => {
    updateStatusMutation.mutate({ id: orderId, status: 'completed' });
  };

  const completedJobs = bookings?.filter(b => b.status === 'completed') || [];
  const completedJobsCount = completedJobs.length;

  // Analytics data
  const chartData = [
    { name: 'Sen', value: 450000 },
    { name: 'Sel', value: 300000 },
    { name: 'Rab', value: 600000 },
    { name: 'Kam', value: 200000 },
    { name: 'Jum', value: 850000 },
    { name: 'Sab', value: 1200000 },
    { name: 'Min', value: 950000 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500 font-sans">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full"
        />
      </div>

      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="flex justify-between items-center p-4 md:px-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 p-2.5 rounded-2xl shadow-lg shadow-orange-500/30">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter">OKE MEKANIK</h1>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">{t('role.mechanic.title')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
              <span className={`text-xs font-black uppercase tracking-widest ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} className="data-[state=checked]:bg-green-500" />
            </div>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-500/10 hover:text-red-500 text-gray-400 transition-colors"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 relative z-10"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:border-orange-500/30 transition-all duration-500 group">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-black text-orange-400 group-hover:scale-110 transition-transform">{pendingOrders.length}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Pesanan Masuk</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:border-blue-500/30 transition-all duration-500 group">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-black text-blue-400 group-hover:scale-110 transition-transform">{currentJob ? '1' : '0'}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Pekerjaan Aktif</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:border-green-500/30 transition-all duration-500 group">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-black text-green-400 group-hover:scale-110 transition-transform">{completedJobsCount}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Selesai</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 hover:border-yellow-500/30 transition-all duration-500 group">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center items-center group-hover:scale-110 transition-transform">
                <p className="text-3xl font-black text-yellow-400 mr-1">{mechanicData?.rating?.toFixed(1) || '4.9'}</p>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Job */}
        {currentJob && (
          <Card className="mb-8 bg-orange-500/5 backdrop-blur-xl border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Wrench className="h-5 w-5 mr-2 text-orange-400" />
                Pekerjaan Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">{currentJob.vehicle?.brand} {currentJob.vehicle?.model}</p>
                  <p className="text-gray-400">{currentJob.problem}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {currentJob.location?.address}
                  </p>
                </div>
                <Badge className={
                  currentJob.status === 'working' ? 'bg-orange-500' :
                  currentJob.status === 'otw' ? 'bg-blue-500' : 'bg-gray-500'
                }>
                  {currentJob.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10" onClick={() => navigate(`/mechanic/chat/${currentJob.id}`)}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/10">
                  <Phone className="h-4 w-4 mr-1" />
                  Telepon
                </Button>
                {currentJob.status !== 'completed' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleCompleteJob(currentJob.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Selesai
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Earnings Chart */}
          <Card className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <TrendingUp className="h-6 w-6 text-orange-500 opacity-50" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-black text-white italic tracking-tight">ANALISIS PENDAPATAN</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      hide
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff20', borderRadius: '12px' }}
                      itemStyle={{ color: '#fb923c' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#f97316' : '#f9731640'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Minggu Ini</p>
                  <p className="text-2xl font-black text-white">Rp 4.550.000</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+12.5% vs minggu lalu</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-black text-white italic tracking-tight">ULASAN TERBARU</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 italic">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm italic">Belum ada ulasan.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Orders */}
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50" />
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-black text-white italic tracking-tight">
              <Clock className="h-6 w-6 mr-3 text-blue-400" />
              PESANAN MASUK ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <div key={order.id} className="border border-white/5 rounded-2xl p-4 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{order.vehicle?.brand} {order.vehicle?.model}</p>
                      <p className="text-gray-400">{order.problem}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {order.location?.address}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        onClick={() => handleRejectOrder(order.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terima
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Tidak ada pesanan masuk saat ini.</p>
            )}
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
};

export default MechanicDashboard;
