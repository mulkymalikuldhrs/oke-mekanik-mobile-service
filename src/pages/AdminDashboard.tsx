import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Users, Wrench, Calendar, DollarSign, TrendingUp, Star, AlertTriangle, CheckCircle2, Clock, LogOut, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';
import { fetchWithAuth } from '@/lib/api';

const COLORS = ['#2E9EF7', '#FF6B35', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0, totalMechanics: 0, totalBookings: 0, totalRevenue: 0,
    activeBookings: 0, completedBookings: 0, avgRating: 0, onlineMechanics: 0,
  });
  const [bookingsByStatus, setBookingsByStatus] = useState<any[]>([]);
  const [revenueByDay, setRevenueByDay] = useState<any[]>([]);
  const [servicePopularity, setServicePopularity] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load real stats from admin endpoint
      const statsRes = await fetchWithAuth('/admin/stats');
      const data = statsRes as any;
      setStats({
        totalUsers: data.totalUsers || 0,
        totalMechanics: data.totalMechanics || 0,
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        activeBookings: data.activeBookings || 0,
        completedBookings: data.completedBookings || 0,
        avgRating: data.avgRating || 0,
        onlineMechanics: data.onlineMechanics || 0,
      });

      // Real bookings by status from admin API
      if (data.bookingsByStatus && data.bookingsByStatus.length > 0) {
        const statusColors: Record<string, string> = {
          completed: '#10B981', pending: '#F59E0B', accepted: '#2E9EF7',
          otw: '#FF6B35', arrived: '#8B5CF6', working: '#F59E0B', cancelled: '#EF4444',
        };
        const statusLabels: Record<string, string> = {
          completed: 'Selesai', pending: 'Menunggu', accepted: 'Diterima',
          otw: 'Dalam Perjalanan', arrived: 'Tiba', working: 'Bekerja', cancelled: 'Dibatalkan',
        };
        setBookingsByStatus(data.bookingsByStatus.map((b: any) => ({
          name: statusLabels[b.status] || b.status,
          value: b.count,
          color: statusColors[b.status] || '#6B7280',
        })));
      } else {
        setBookingsByStatus([{ name: 'No Data', value: 0, color: '#6B7280' }]);
      }

      // Real service popularity from admin API
      if (data.servicePopularity && data.servicePopularity.length > 0) {
        setServicePopularity(data.servicePopularity.map((s: any) => ({
          name: s.name,
          bookings: s.bookings,
          revenue: s.revenue,
        })));
      }

      // Revenue by day - computed from real bookings
      const bookingsRes = await fetchWithAuth('/bookings?all=true').catch(() => []);
      const allBookings = Array.isArray(bookingsRes) ? bookingsRes : [];
      setRecentBookings(allBookings.slice(0, 10));

      // Compute revenue by day from real data
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const revenueMap: Record<string, { revenue: number; bookings: number }> = {};
      allBookings
        .filter((b: any) => b.status === 'completed' && b.estimatedCost)
        .forEach((b: any) => {
          const date = new Date(b.createdAt || b.created_at);
          const dayName = dayNames[date.getDay()];
          if (!revenueMap[dayName]) revenueMap[dayName] = { revenue: 0, bookings: 0 };
          revenueMap[dayName].revenue += b.estimatedCost || 0;
          revenueMap[dayName].bookings += 1;
        });
      if (Object.keys(revenueMap).length > 0) {
        setRevenueByDay(dayNames.map(day => ({
          day,
          revenue: revenueMap[day]?.revenue || 0,
          bookings: revenueMap[day]?.bookings || 0,
        })).filter(d => revenueMap[d.day]));
      } else {
        setRevenueByDay([]);
      }

      // Load mechanics list
      const mechRes = await fetchWithAuth('/mechanics').catch(() => []);
      setMechanics(Array.isArray(mechRes) ? mechRes : []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/');
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Oke Mekanik Admin
              </h1>
              <p className="text-xs text-slate-400">SaaS Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">SYSTEM LIVE</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-700', prefix: '' },
            { title: 'Mekanik Aktif', value: stats.onlineMechanics, icon: Wrench, color: 'from-emerald-500 to-emerald-700', prefix: '' },
            { title: 'Total Booking', value: stats.totalBookings, icon: Calendar, color: 'from-purple-500 to-purple-700', prefix: '' },
            { title: 'Pendapatan', value: stats.totalRevenue, icon: DollarSign, color: 'from-amber-500 to-orange-600', prefix: 'Rp ', format: true },
          ].map((kpi, i) => (
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{kpi.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {kpi.format ? formatCurrency(kpi.value) : `${kpi.prefix}${kpi.value}`}
                    </p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                    <kpi.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">Overview</TabsTrigger>
            <TabsTrigger value="mechanics" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">Mekanik</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Booking Status Pie Chart */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Status Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={bookingsByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                          {bookingsByStatus.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Line Chart */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Pendapatan Mingguan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueByDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(v) => `${(v/1000)}K`} />
                        <Tooltip formatter={(v: number) => formatCurrency(v)} />
                        <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Popularity */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Popularitas Layanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={servicePopularity} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                      <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.5)" width={120} />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#2E9EF7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mechanics" className="space-y-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Mekanik</CardTitle>
                <CardDescription className="text-slate-400">{mechanics.length} mekanik terdaftar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mechanics.map((mech: any) => (
                    <div key={mech.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{mech.avatar || '🔧'}</span>
                        <div>
                          <p className="font-medium">{mech.name}</p>
                          <p className="text-xs text-slate-400">{mech.speciality}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm">{mech.rating}</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs ${mech.isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {mech.isOnline ? 'Online' : 'Offline'}
                        </div>
                        <span className="text-sm text-slate-400">{formatCurrency(mech.pricePerHour || mech.price_per_hour || 0)}/jam</span>
                      </div>
                    </div>
                  ))}
                  {mechanics.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Memuat data mekanik...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Booking Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <p className="font-medium text-sm">{booking.id}</p>
                        <p className="text-xs text-slate-400">{booking.vehicle?.brand} {booking.vehicle?.model} — {booking.problem?.slice(0, 30)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{formatCurrency(booking.estimatedCost || 0)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          booking.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          booking.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentBookings.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Belum ada booking</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
