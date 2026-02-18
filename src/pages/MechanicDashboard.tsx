import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, Star, LogOut, LoaderCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { mechanicApi, bookingApi } from '@/lib/api';

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

  const completedJobs = bookings?.filter(b => b.status === 'completed').length || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
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

      <main className="container mx-auto px-4 py-8 relative z-10">
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
              <p className="text-3xl font-black text-green-400 group-hover:scale-110 transition-transform">{completedJobs}</p>
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
      </main>
    </div>
  );
};

export default MechanicDashboard;
