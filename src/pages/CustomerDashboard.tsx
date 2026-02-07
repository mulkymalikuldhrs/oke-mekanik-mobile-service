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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white italic">Dashboard Pelanggan</h1>
              <p className="text-sm text-gray-400">Selamat datang kembali, {user?.name}!</p>
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

      <div className="container mx-auto p-4 space-y-6 relative z-10">
        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-500/30 backdrop-blur-xl shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/40 transition-all duration-700" />
          <CardContent className="p-8">
            <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Butuh Bantuan Mekanik?</h2>
            <p className="mb-8 text-gray-300 text-lg">Panggil mekanik terdekat dalam hitungan detik untuk perbaikan kendaraan Anda.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl h-14 text-lg shadow-lg shadow-blue-500/20"
                onClick={() => navigate('/customer/booking')}
              >
                <Plus className="h-6 w-6 mr-2" />
                Panggil Mekanik
              </Button>
              <Button 
                size="lg" 
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black rounded-2xl h-14 text-lg backdrop-blur-sm"
                onClick={() => navigate('/customer/booking')}
              >
                <AlertTriangle className="h-6 w-6 mr-2" />
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
