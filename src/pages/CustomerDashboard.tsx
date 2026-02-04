
import React from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Phone, Plus, History, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data: mechanics, isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['mechanics'],
    queryFn: api.getMechanics,
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => api.getBookings(user?.id || '', 'customer'),
    enabled: !!user?.id,
  });

  const activeBooking = bookings?.find(b => ['accepted', 'otw', 'working'].includes(b.status));
  const recentBookings = bookings?.filter(b => b.status === 'completed') || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Pelanggan</h1>
              <p className="text-sm text-gray-600">Halo, {user?.name || 'Pelanggan'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Keluar">
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-6">
        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Butuh Bantuan Mekanik?</h2>
            <p className="mb-6 opacity-90">Panggil mekanik terdekat dalam hitungan detik untuk perbaikan kendaraan Anda.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
                onClick={() => navigate('/customer/booking')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Panggil Mekanik
              </Button>
              <Button 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold border-none"
                onClick={() => navigate('/customer/booking')}
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                🚨 DARURAT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Service */}
        {isLoadingBookings ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : activeBooking && (
          <Card className="border-orange-200 bg-orange-50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-orange-800 text-lg">
                <Clock className="h-5 w-5 mr-2" />
                Layanan Aktif - {activeBooking.status.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">Mekanik sedang dalam perjalanan ke lokasi Anda</p>
                  <p className="text-sm text-gray-600">Kendaraan: {activeBooking.vehicleDetails}</p>
                  <p className="text-sm text-gray-600">Lokasi: {activeBooking.location}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline"
                    className="bg-white"
                    onClick={() => navigate('/customer/chat')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" className="bg-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Telepon
                  </Button>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => navigate('/customer/tracking')}
                  >
                    Lacak Lokasi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nearby Mechanics */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Mekanik Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingMechanics ? (
              [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
            ) : (
              mechanics?.map((mechanic) => (
                <div key={mechanic.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      {mechanic.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{mechanic.name}</h3>
                      <p className="text-sm text-gray-600">{mechanic.speciality}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-semibold ml-1">{mechanic.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {mechanic.distance}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">Rp {mechanic.pricePerHour.toLocaleString()}/jam</p>
                    <Button
                      size="sm"
                      className="mt-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/customer/booking')}
                    >
                      Pesan
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <History className="h-5 w-5 mr-2 text-green-600" />
                Riwayat Layanan
              </div>
              <Button size="sm" variant="ghost" className="text-blue-600">
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingBookings ? (
              <Skeleton className="h-20 w-full rounded-lg" />
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-xl shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.vehicleDetails}</h3>
                    <p className="text-sm text-gray-600">Layanan: {booking.serviceId}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">Rp {booking.totalCost?.toLocaleString()}</p>
                    <div className="flex items-center justify-end mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-gray-500 italic">Belum ada riwayat layanan.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
