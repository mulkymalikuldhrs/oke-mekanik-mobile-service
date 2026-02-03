
import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle,
  XCircle,
  Camera,
  DollarSign,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const MechanicDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(true);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['mechanic-bookings', user?.id],
    queryFn: () => api.getBookings(),
    enabled: !!user,
  });

  const mechanicBookings = bookings.filter(b => b.mechanicId === user?.id);
  const currentJob = mechanicBookings.find(b => ['accepted', 'otw', 'arrived', 'working'].includes(b.status));
  const pendingOrders = mechanicBookings.filter(b => b.status === 'pending');
  const completedJobs = mechanicBookings.filter(b => b.status === 'completed');

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: any }) => api.updateBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mechanic-bookings'] }),
  });

  const todayStats = {
    completedJobs: completedJobs.length,
    totalEarnings: `Rp ${completedJobs.reduce((acc, curr) => acc + curr.estimatedCost, 0)}`,
    rating: 4.9,
    onlineHours: '8 jam'
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      otw: { label: 'Menuju Lokasi', variant: 'default' as const, color: 'bg-blue-500' },
      arrived: { label: 'Sampai Lokasi', variant: 'secondary' as const, color: 'bg-yellow-500' },
      working: { label: 'Sedang Mengerjakan', variant: 'outline' as const, color: 'bg-orange-500' },
      completed: { label: 'Selesai', variant: 'outline' as const, color: 'bg-green-500' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.otw;
  };

  const handleAcceptOrder = (orderId: string) => {
    updateStatusMutation.mutate({ id: orderId, status: 'accepted' });
  };

  const handleRejectOrder = (orderId: string) => {
    updateStatusMutation.mutate({ id: orderId, status: 'cancelled' });
  };

  const handleCompleteJob = (orderId: string) => {
    updateStatusMutation.mutate({ id: orderId, status: 'completed' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.completedJobs}</p>
              <p className="text-sm text-gray-600">Pekerjaan Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.totalEarnings}</p>
              <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.rating}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{todayStats.onlineHours}</p>
              <p className="text-sm text-gray-600">Jam Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Job */}
        {currentJob && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center text-orange-800">
                  <Wrench className="h-5 w-5 mr-2" />
                  Pekerjaan Aktif
                </div>
                <Badge className={getStatusBadge(currentJob.status).color + ' text-white'}>
                  {getStatusBadge(currentJob.status).label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Pelanggan ID: {currentJob.customerId}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentJob.location.address}
                  </p>
                  <p className="text-sm mt-2"><strong>Masalah:</strong> {currentJob.problem}</p>
                  <p className="text-sm"><strong>Kendaraan:</strong> {currentJob.vehicle.brand} {currentJob.vehicle.model}</p>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-lg font-semibold text-green-600">Rp {currentJob.estimatedCost}</p>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/mechanic/chat?bookingId=${currentJob.id}`)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Telepon
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                {currentJob.status === 'accepted' && (
                  <Button size="lg" onClick={() => updateStatusMutation.mutate({ id: currentJob.id, status: 'otw' })}>
                    Mulai Menuju Lokasi
                  </Button>
                )}
                {currentJob.status === 'otw' && (
                  <Button size="lg" onClick={() => updateStatusMutation.mutate({ id: currentJob.id, status: 'arrived' })}>
                    Sudah Sampai
                  </Button>
                )}
                {currentJob.status === 'arrived' && (
                  <Button size="lg" onClick={() => updateStatusMutation.mutate({ id: currentJob.id, status: 'working' })}>
                    Mulai Kerjakan
                  </Button>
                )}
                {currentJob.status === 'working' && (
                  <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => handleCompleteJob(currentJob.id)}>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Selesai Pekerjaan
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
            {pendingOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Pelanggan ID: {order.customerId}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {order.location.address}
                    </p>
                    <p className="text-sm mt-2"><strong>Masalah:</strong> {order.problem}</p>
                    <p className="text-sm"><strong>Kendaraan:</strong> {order.vehicle.brand} {order.vehicle.model}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">Baru</Badge>
                      <span className="text-lg font-semibold text-green-600">Rp {order.estimatedCost}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRejectOrder(order.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Tolak
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptOrder(order.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Terima
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MechanicDashboard;
