import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, Star, LogOut, LoaderCircle, AlertTriangle, TrendingUp, Navigation, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
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

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, lat, lng }: { id: string; lat: number; lng: number }) =>
      mechanicApi.updateLocation(id, lat, lng),
  });

  useEffect(() => {
    if (!user?.id || !isOnline) return;

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          updateLocationMutation.mutate({
            id: user.id,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        });
      }
    };

    updateLocation();
    const interval = setInterval(updateLocation, 30000);
    return () => clearInterval(interval);
  }, [user?.id, isOnline]);

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

  const getChartData = () => {
    const days = [
      t('days.sen'),
      t('days.sel'),
      t('days.rab'),
      t('days.kam'),
      t('days.jum'),
      t('days.sab'),
      t('days.min')
    ];
    const weeklyData = days.map(day => ({ name: day, value: 0 }));

    if (!completedJobs || completedJobs.length === 0) return weeklyData;

    completedJobs.forEach(job => {
      if (!job.createdAt) return;
      const jobDate = new Date(job.createdAt);
      const dayIndex = jobDate.getDay();
      const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      weeklyData[mappedIndex].value += (job.estimatedCost || 0);
    });

    return weeklyData;
  };

  const chartData = getChartData();
  const totalEarnings = completedJobs.reduce((acc, job) => acc + (job.estimatedCost || 0), 0);

  const getRatingTrends = () => {
    if (!reviews || reviews.length === 0) {
      return [];
    }

    const months = [
      t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
      t('months.mei'), t('months.jun'), t('months.jul'), t('months.agu'),
      t('months.sep'), t('months.okt'), t('months.nov'), t('months.des')
    ];
    const monthlyRating: Record<number, { sum: number, count: number }> = {};

    reviews.forEach(r => {
      const date = new Date(r.createdAt);
      const month = date.getMonth();
      if (!monthlyRating[month]) monthlyRating[month] = { sum: 0, count: 0 };
      monthlyRating[month].sum += r.rating;
      monthlyRating[month].count += 1;
    });

    return Object.entries(monthlyRating)
      .map(([month, data]) => ({
        name: months[parseInt(month)],
        rating: parseFloat((data.sum / data.count).toFixed(1))
      }))
      .sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name));
  };

  const ratingTrends = getRatingTrends();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[160px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-orange-600/5 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <header className="bg-black/40 backdrop-blur-[160px] border-b border-white/5 sticky top-0 z-50">
        <div className="flex justify-between items-center p-4 md:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-4"
          >
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">OKE MEKANIK</h1>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mt-1">{t('role.mechanic.title')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-4"
          >
            <div className="hidden md:flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-[160px]">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                {isOnline ? t('dashboard.mechanic.online') : t('dashboard.mechanic.offline')}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} className="data-[state=checked]:bg-green-500 scale-75" />
            </div>
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-500/10 hover:text-red-500 text-gray-400 transition-all rounded-xl"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </header>

      <motion.main
        className="container mx-auto p-4 md:p-8 space-y-8 relative z-10 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t('dashboard.mechanic.orders_in'), value: pendingOrders.length, color: 'text-orange-500', icon: Clock },
            { label: t('dashboard.mechanic.active_job'), value: currentJob ? '1' : '0', color: 'text-blue-500', icon: Zap },
            { label: t('dashboard.mechanic.completed'), value: completedJobsCount, color: 'text-green-500', icon: CheckCircle },
            { label: t('dashboard.mechanic.rating'), value: mechanicData?.rating?.toFixed(1) || '4.9', color: 'text-yellow-500', icon: Star }
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="bg-black/40 border border-white/5 backdrop-blur-[160px] rounded-[2rem] p-6 hover:border-white/10 transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                   <stat.icon className={`h-24 w-24 ${stat.color.replace('text-', 'fill-')}`} />
                </div>
                <div className="relative z-10">
                  <p className={`text-4xl font-black ${stat.color} tracking-tighter mb-2 group-hover:scale-110 origin-left transition-transform`}>{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Current Job (Main Action) */}
        <AnimatePresence mode="wait">
          {currentJob && (
            <motion.div
              key="current-job"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="bg-gradient-to-br from-orange-600/20 to-orange-900/40 border border-orange-500/30 backdrop-blur-[160px] shadow-2xl overflow-hidden group relative rounded-[2.5rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                <CardContent className="p-8 md:p-12 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] px-3 py-1">
                          Active Mission
                        </Badge>
                        <span className="text-[10px] font-mono text-orange-400/70">ID: {currentJob.id}</span>
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-tight">
                        {currentJob.vehicle?.brand} {currentJob.vehicle?.model}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-gray-300">
                        <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                           <MapPin className="h-4 w-4 mr-2 text-orange-400" />
                           <span className="text-sm font-medium">{currentJob.location?.address}</span>
                        </div>
                        <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                           <Wrench className="h-4 w-4 mr-2 text-orange-400" />
                           <span className="text-sm font-medium">{currentJob.problem}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col w-full md:w-auto gap-3">
                      <div className="flex gap-3">
                         <Button variant="outline" className="flex-1 bg-white/5 border-white/10 text-white rounded-2xl h-14" onClick={() => navigate(`/mechanic/chat/${currentJob.id}`)}>
                            <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                            Chat
                         </Button>
                         <Button variant="outline" className="flex-1 bg-white/5 border-white/10 text-white rounded-2xl h-14">
                            <Phone className="h-5 w-5 mr-2 text-green-400" />
                            Call
                         </Button>
                      </div>

                      {currentJob.status === 'accepted' && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-16 text-xl shadow-xl shadow-blue-500/20" onClick={() => updateStatusMutation.mutate({ id: currentJob.id, status: 'otw' })}>
                          <Navigation className="h-6 w-6 mr-3 animate-pulse" />
                          {t('dashboard.mechanic.btn_otw')}
                        </Button>
                      )}
                      {currentJob.status === 'otw' && (
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-black rounded-2xl h-16 text-xl shadow-xl shadow-yellow-500/20" onClick={() => updateStatusMutation.mutate({ id: currentJob.id, status: 'working' })}>
                          <CheckCircle className="h-6 w-6 mr-3" />
                          {t('dashboard.mechanic.btn_arrived')}
                        </Button>
                      )}
                      {currentJob.status === 'working' && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl h-16 text-xl shadow-xl shadow-green-500/20" onClick={() => handleCompleteJob(currentJob.id)}>
                          <Sparkles className="h-6 w-6 mr-3" />
                          {t('dashboard.mechanic.btn_done')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Analytics (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-black/40 border border-white/5 backdrop-blur-[160px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="flex flex-row justify-between items-center p-8 pb-4">
                  <CardTitle className="text-2xl font-black text-white italic tracking-tight uppercase">
                    {t('dashboard.mechanic.analytics')}
                  </CardTitle>
                  <div className="flex items-center text-xs font-black text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                     <TrendingUp className="h-3 w-3 mr-1" />
                     +12.5% this week
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="h-[300px] w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 800 }}
                        />
                        <YAxis hide />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                          itemStyle={{ color: '#f97316', fontWeight: 900 }}
                          labelStyle={{ color: '#6b7280', fontSize: 10, marginBottom: 4 }}
                        />
                        <Bar dataKey="value" radius={[12, 12, 4, 4]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 5 ? '#f97316' : 'rgba(249, 115, 22, 0.15)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                     <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('dashboard.mechanic.earnings_label')}</p>
                        <p className="text-3xl font-black text-white">Rp {totalEarnings.toLocaleString()}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Efficiency Rate</p>
                        <p className="text-3xl font-black text-blue-400">94%</p>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pending Orders */}
            <motion.div variants={itemVariants}>
              <Card className="bg-black/40 border border-white/5 backdrop-blur-[160px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="flex items-center text-2xl font-black text-white italic tracking-tight uppercase">
                    <Clock className="h-6 w-6 mr-3 text-orange-400" />
                    Incoming Requests
                    <Badge className="ml-3 bg-white/5 text-gray-400 border-white/10">{pendingOrders.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-4">
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map((order) => (
                      <div key={order.id} className="group bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                             <h3 className="font-black text-xl text-white uppercase italic">{order.vehicle?.brand} {order.vehicle?.model}</h3>
                             <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] uppercase tracking-tighter">New Mission</Badge>
                          </div>
                          <p className="text-sm text-gray-400 font-medium">{order.problem}</p>
                          <div className="flex items-center text-gray-500 text-xs font-mono">
                            <MapPin className="h-3 w-3 mr-1.5 text-orange-500" />
                            {order.location?.address?.substring(0, 60)}...
                          </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                          <Button
                            variant="ghost"
                            className="flex-1 md:flex-none text-red-500 hover:bg-red-500/10 rounded-xl px-6"
                            onClick={() => handleRejectOrder(order.id)}
                          >
                            Decline
                          </Button>
                          <Button
                            className="flex-1 md:flex-none bg-white text-black hover:bg-orange-500 hover:text-white rounded-xl px-8 font-black transition-all"
                            onClick={() => handleAcceptOrder(order.id)}
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl">
                      <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">{t('dashboard.mechanic.no_orders')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Performance & Reviews (Right) */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-black/40 border border-white/5 backdrop-blur-[160px] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-lg font-black text-white italic tracking-tight uppercase">Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="h-[120px] w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ratingTrends}>
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="#fbbf24"
                          strokeWidth={4}
                          dot={{ fill: '#fbbf24', r: 4, strokeWidth: 2, stroke: '#000' }}
                          activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5 pb-3">Latest Reviews</h4>
                    {reviews && reviews.length > 0 ? (
                      reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="space-y-2 group">
                          <div className="flex justify-between items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/5'}`} />
                              ))}
                            </div>
                            <span className="text-[9px] font-mono text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-400 group-hover:text-white transition-colors italic leading-relaxed">"{review.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-center py-4 text-[10px] uppercase font-black tracking-widest">{t('dashboard.mechanic.no_reviews')}</p>
                    )}

                    <Button variant="ghost" className="w-full text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest pt-4">
                       View All Reviews <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
               <Card className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 text-center group hover:bg-white/10 transition-all">
                  <div className="bg-orange-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Wrench className="h-8 w-8 text-orange-500" />
                  </div>
                  <h4 className="font-black text-white italic uppercase tracking-tighter text-xl mb-2">Inventory</h4>
                  <p className="text-xs text-gray-500 font-medium mb-6">Manage your tools and spare parts availability.</p>
                  <Button className="w-full bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 uppercase font-black text-[10px] tracking-widest">
                     Manage Supply
                  </Button>
               </Card>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default MechanicDashboard;
