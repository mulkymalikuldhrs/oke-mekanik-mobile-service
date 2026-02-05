import { useState, useEffect } from 'react';
import { MapPin, Car, Clock, Star, MessageSquare, Plus, History, AlertTriangle, LogOut, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingApi, mechanicApi } from '@/lib/api';

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['customerBookings', user?.id],
    queryFn: () => bookingApi.getByUser(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: nearbyMechanics, isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['nearbyMechanics'],
    queryFn: () => mechanicApi.getAll(),
  });

  const activeBooking = bookings?.find(b => 
    ['pending', 'accepted', 'otw', 'arrived', 'working'].includes(b.status)
  );
  const recentBookings = bookings?.filter(b => b.status === 'completed').slice(0, 5) || [];

  if (isLoadingBookings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
              <p className="text-sm text-gray-600">Selamat datang kembali, {user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}>
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
                DARURAT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Service */}
        {activeBooking && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Clock className="h-5 w-5 mr-2" />
                Layanan Aktif - {activeBooking.status.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-semibold">Mekanik</p>
                  <p className="text-sm text-gray-600">Kendaraan: {activeBooking.vehicle?.brand} {activeBooking.vehicle?.model}</p>
                  <p className="text-sm text-gray-600">Masalah: {activeBooking.problem}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/customer/chat/${activeBooking.id}`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/customer/tracking/${activeBooking.id}`)}
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
              <div className="flex items-center justify-center py-8">
                <LoaderCircle className="h-6 w-6 animate-spin" />
              </div>
            ) : nearbyMechanics && nearbyMechanics.length > 0 ? (
              nearbyMechanics.slice(0, 5).map((mechanic) => (
                <div key={mechanic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{mechanic.avatar || '👨‍🔧'}</div>
                    <div>
                      <h3 className="font-semibold">{mechanic.name}</h3>
                      <p className="text-sm text-gray-600">{mechanic.speciality?.join(', ')}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1">{mechanic.rating?.toFixed(1)}</span>
                        </div>
                        {mechanic.isOnline && (
                          <Badge variant="outline" className="text-xs">Online</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">Rp {mechanic.pricePerHour?.toLocaleString()}/jam</p>
                    <Button
                      size="sm"
                      className="mt-2"
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
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <History className="h-5 w-5 mr-2 text-green-600" />
              Riwayat Layanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingBookings ? (
              <div className="flex items-center justify-center py-8">
                <LoaderCircle className="h-6 w-6 animate-spin" />
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{booking.problem}</h3>
                    <p className="text-sm text-gray-600">Kendaraan: {booking.vehicle?.brand} {booking.vehicle?.model}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">Rp {booking.estimatedCost?.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-1">Selesai</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Belum ada riwayat layanan</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
