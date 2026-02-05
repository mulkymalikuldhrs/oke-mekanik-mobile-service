import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, Star, LogOut, LoaderCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-orange-600" />
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Mekanik</h1>
              <p className="text-sm text-gray-600">Selamat datang, {user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
              <p className="text-sm text-gray-600">Pesanan Masuk</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{currentJob ? '1' : '0'}</p>
              <p className="text-sm text-gray-600">Pekerjaan Aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{completedJobs}</p>
              <p className="text-sm text-gray-600">Pekerjaan Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center items-center">
                <p className="text-2xl font-bold text-yellow-600 mr-1">{mechanicData?.rating?.toFixed(1) || '4.9'}</p>
                <Star className="h-4 w-4 fill-yellow-600 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600">Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Job */}
        {currentJob && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-orange-600" />
                Pekerjaan Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{currentJob.vehicle?.brand} {currentJob.vehicle?.model}</p>
                  <p className="text-gray-600">{currentJob.problem}</p>
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
                <Button size="sm" variant="outline" onClick={() => navigate(`/mechanic/chat/${currentJob.id}`)}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Telepon
                </Button>
                {currentJob.status !== 'completed' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleCompleteJob(currentJob.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Selesai
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Pesanan Masuk ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{order.vehicle?.brand} {order.vehicle?.model}</p>
                      <p className="text-gray-600">{order.problem}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {order.location?.address}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectOrder(order.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
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
