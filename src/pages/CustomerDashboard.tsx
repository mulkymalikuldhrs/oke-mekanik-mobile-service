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

  const { data: bookings, isLoading: isLoadingBookings, error } = useQuery({
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-white">Gagal memuat data</h2>
          <p className="text-gray-400">Terjadi kesalahan saat mengambil data.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
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
          <Card className="border-orange-500/30 bg-orange-500/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400">
                <Clock className="h-5 w-5 mr-2" />
                Layanan Aktif - {activeBooking.status.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-semibold text-white">Mekanik Sedang Menuju Lokasi</p>
                  <p className="text-sm text-gray-400">Kendaraan: {activeBooking.vehicle?.brand} {activeBooking.vehicle?.model}</p>
                  <p className="text-sm text-gray-400">Masalah: {activeBooking.problem}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10"
                    onClick={() => navigate(`/customer/chat/${activeBooking.id}`)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-500 text-white"
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
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white">
              <MapPin className="h-5 w-5 mr-2 text-blue-400" />
              Mekanik Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingMechanics ? (
              <div className="flex items-center justify-center py-8">
                <LoaderCircle className="h-6 w-6 animate-spin text-blue-400" />
              </div>
            ) : nearbyMechanics && nearbyMechanics.length > 0 ? (
              nearbyMechanics.slice(0, 5).map((mechanic) => (
                <div key={mechanic.id} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl bg-white/5 p-2 rounded-xl">{mechanic.avatar || '👨‍🔧'}</div>
                    <div>
                      <h3 className="font-semibold text-white">{mechanic.name}</h3>
                      <p className="text-sm text-gray-400">{mechanic.speciality?.join(', ')}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1 text-gray-300">{mechanic.rating?.toFixed(1)}</span>
                        </div>
                        {mechanic.isOnline && (
                          <Badge variant="outline" className="text-[10px] h-4 bg-green-500/10 text-green-400 border-green-500/20">Online</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-400">Rp {mechanic.pricePerHour?.toLocaleString()}/jam</p>
                    <Button
                      size="sm"
                      className="mt-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl"
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
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white">
              <History className="h-5 w-5 mr-2 text-green-400" />
              Riwayat Layanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingBookings ? (
              <div className="flex items-center justify-center py-8">
                <LoaderCircle className="h-6 w-6 animate-spin text-green-400" />
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl">
                  <div>
                    <h3 className="font-semibold text-white">{booking.problem}</h3>
                    <p className="text-sm text-gray-400">Kendaraan: {booking.vehicle?.brand} {booking.vehicle?.model}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">Rp {booking.estimatedCost?.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-400 border-green-500/20">Selesai</Badge>
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
