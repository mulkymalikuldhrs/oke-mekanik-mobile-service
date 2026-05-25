import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Car, MapPin, Navigation, Wrench, ChevronLeft, 
  Star, Phone, Clock, Sparkles, BrainCircuit, Loader2,
  Zap, AlertTriangle, CheckCircle, ArrowRight, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '@/hooks/useLanguage';
import { aiApi, bookingApi, mechanicApi, serviceApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Mechanic } from '@/types';
import { toast } from 'sonner';

const mechanicMapIcon = L.divIcon({
  html: `<div style="background:#f97316;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="font-size:18px">🔧</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  className: '',
});

const userMapIcon = L.divIcon({
  html: `<div style="background:#22c55e;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="font-size:16px">📍</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  className: '',
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 14); }, [center, map]);
  return null;
}

const vehicleBrands = ['Toyota', 'Honda', 'Suzuki', 'Mitsubishi', 'Nissan', 'Daihatsu', 'Hyundai', 'Kia', 'BMW', 'Mercedes'];

const serviceCategories = [
  { id: 'emergency', label: '🆘 Darurat', color: 'border-red-500/30 bg-red-500/10' },
  { id: 'engine', label: '🔧 Mesin', color: 'border-orange-500/30 bg-orange-500/10' },
  { id: 'brakes', label: '🛑 Rem', color: 'border-purple-500/30 bg-purple-500/10' },
  { id: 'tires', label: '🛞 Ban', color: 'border-green-500/30 bg-green-500/10' },
  { id: 'electrical', label: '⚡ Listrik', color: 'border-yellow-500/30 bg-yellow-500/10' },
  { id: 'general', label: '📋 Umum', color: 'border-blue-500/30 bg-blue-500/10' },
];

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1=service, 2=location, 3=mechanic, 4=confirm
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [vehicleData, setVehicleData] = useState({ brand: '', model: '', year: '', licensePlate: '' });
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState({ address: '', lat: -6.2088, lng: 106.8456 });
  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [autoDispatchMode, setAutoDispatchMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  // Pre-fill from URL params
  useEffect(() => {
    const mechId = searchParams.get('mechanicId');
    const svcId = searchParams.get('serviceId');
    if (svcId) {
      setSelectedServiceId(svcId);
      setStep(2);
    }
    if (mechId) {
      setStep(3);
    }
  }, [searchParams]);

  // Get GPS on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude })),
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: serviceApi.getAll,
  });

  const { data: nearbyMechanics = [] } = useQuery({
    queryKey: ['nearbyMechanics', location.lat, location.lng, selectedServiceId],
    queryFn: () => mechanicApi.getNearby(location.lat, location.lng, 15, selectedServiceId || undefined),
    enabled: !!selectedServiceId,
  });

  // Auto-dispatch booking
  const autoDispatchMutation = useMutation({
    mutationFn: () => bookingApi.autoDispatch({
      serviceId: selectedServiceId,
      vehicle: vehicleData,
      problem,
      location: { lat: location.lat, lng: location.lng, address: location.address },
      isEmergency,
    }),
    onSuccess: (data) => {
      toast.success('Mekanik ditemukan! Pesanan sedang diproses.');
      navigate(`/customer/tracking/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menemukan mekanik');
    },
  });

  // Manual booking
  const bookingMutation = useMutation({
    mutationFn: () => bookingApi.create({
      mechanicId: selectedMechanic?.id || '',
      serviceId: selectedServiceId,
      vehicle: vehicleData,
      problem,
      location: { lat: location.lat, lng: location.lng, address: location.address },
      isEmergency,
    }),
    onSuccess: (data) => {
      toast.success(t('booking.success_title'));
      navigate(`/customer/tracking/${data.id}`);
    },
    onError: () => toast.error(t('booking.error_title')),
  });

  const handleAiDiagnostic = async () => {
    if (!problem || problem.length < 5) return toast.error(t('booking.ai_detail_needed_title'));
    setIsAnalyzing(true);
    try {
      const response = await aiApi.diagnose(problem);
      setAiSuggestion(response);
      if (response.serviceId) setSelectedServiceId(response.serviceId);
    } catch { toast.error(t('booking.ai_error_title')); }
    setIsAnalyzing(false);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.info(t('booking.loc_searching_title'));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
          toast.success(t('booking.loc_locked_title'));
        },
        () => toast.error(t('booking.loc_error_title')),
        { enableHighAccuracy: true }
      );
    }
  };

  const filteredServices = selectedCategory
    ? services.filter(s => s.category === selectedCategory)
    : services;

  const selectedService = services.find(s => s.id === selectedServiceId);

  const handleConfirmBooking = () => {
    if (autoDispatchMode) {
      autoDispatchMutation.mutate();
    } else {
      bookingMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => step > 1 ? setStep(step - 1) : navigate('/customer/dashboard')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-sm font-black">PESAN MEKANIK</h1>
            <p className="text-[10px] text-gray-500">Step {step}/4</p>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1">
            {[1,2,3,4].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-black mb-1">Pilih Layanan</h2>
                <p className="text-sm text-gray-500">Apa masalah kendaraan Anda?</p>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {serviceCategories.map(cat => (
                  <button
                    key={cat.id}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      selectedCategory === cat.id ? cat.color + ' border-opacity-50' : 'border-white/10 text-gray-400'
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Service Grid */}
              <div className="grid grid-cols-2 gap-2">
                {filteredServices.map(svc => (
                  <motion.button
                    key={svc.id}
                    whileTap={{ scale: 0.97 }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedServiceId === svc.id
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    } ${svc.isEmergencyAvailable ? 'ring-1 ring-red-500/20' : ''}`}
                    onClick={() => { setSelectedServiceId(svc.id); setIsEmergency(svc.category === 'emergency'); }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-400">Rp {svc.basePrice?.toLocaleString()}</span>
                      {svc.isEmergencyAvailable && (
                        <Badge className="bg-red-500/20 text-red-400 text-[8px] border-0 h-4">24/7</Badge>
                      )}
                    </div>
                    <p className="font-bold text-sm">{svc.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{svc.description}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>~{svc.estimatedDuration || 60} mnt</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* AI Diagnostic */}
              <Card className="glass-card rounded-xl">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-400 mb-2">Tidak yakin masalahnya? AI bisa bantu diagnosa:</p>
                  <div className="flex gap-2">
                    <Textarea
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Contoh: mesin brebet, rem berdecit, aki soak..."
                      className="flex-1 bg-white/5 border-white/10 text-white text-xs min-h-[60px]"
                    />
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 self-end"
                      onClick={handleAiDiagnostic}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    </Button>
                  </div>
                  {aiSuggestion && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs font-bold text-blue-400">AI: {aiSuggestion.suggestion} ({aiSuggestion.confidence}%)</p>
                      <p className="text-[10px] text-gray-400 mt-1">Urgency: {aiSuggestion.urgency_level}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-bold"
                disabled={!selectedServiceId}
                onClick={() => setStep(2)}
              >
                Lanjutkan <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Location & Vehicle */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-black mb-1">Lokasi & Kendaraan</h2>
                <p className="text-sm text-gray-500">Di mana Anda butuh mekanik?</p>
              </div>

              {/* Mini Map */}
              <div className="h-[180px] rounded-xl overflow-hidden border border-white/10">
                <MapContainer center={[location.lat, location.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapUpdater center={[location.lat, location.lng]} />
                  <Marker position={[location.lat, location.lng]} icon={userMapIcon}>
                    <Popup>Lokasi Anda</Popup>
                  </Marker>
                </MapContainer>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">{t('booking.step1.address')}</Label>
                <div className="flex gap-2">
                  <Input
                    value={location.address}
                    onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                    placeholder={t('booking.step1.address_placeholder')}
                    className="flex-1 bg-white/5 border-white/10 text-white"
                  />
                  <Button variant="outline" className="border-white/10 text-white" onClick={handleGetLocation}>
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Merk</Label>
                  <select className="w-full p-2 border border-white/10 bg-black/40 text-white rounded-md text-sm" value={vehicleData.brand} onChange={(e) => setVehicleData(prev => ({ ...prev, brand: e.target.value }))}>
                    <option value="">Pilih merk</option>
                    {vehicleBrands.map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Model</Label>
                  <Input value={vehicleData.model} onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))} placeholder="Avanza, Vario..." className="bg-white/5 border-white/10 text-white text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Tahun</Label>
                  <Input value={vehicleData.year} onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))} placeholder="2020" className="bg-white/5 border-white/10 text-white text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Plat Nomor</Label>
                  <Input value={vehicleData.licensePlate} onChange={(e) => setVehicleData(prev => ({ ...prev, licensePlate: e.target.value }))} placeholder="B 1234 XY" className="bg-white/5 border-white/10 text-white text-sm" />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <Label className="text-xs text-gray-400">Detail Masalah</Label>
                <Textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Jelaskan masalah kendaraan Anda..."
                  className="bg-white/5 border-white/10 text-white min-h-[80px]"
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-bold"
                disabled={!location.address || !vehicleData.brand}
                onClick={() => setStep(3)}
              >
                Cari Mekanik <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Choose Mechanic */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-black mb-1">Pilih Mekanik</h2>
                <p className="text-sm text-gray-500">{nearbyMechanics.length} mekanik tersedia di sekitar Anda</p>
              </div>

              {/* Auto-dispatch option */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  autoDispatchMode
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => { setAutoDispatchMode(true); setSelectedMechanic(null); }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">Auto-Assign (Rekomendasi)</p>
                    <p className="text-xs text-gray-500">Sistem pilih mekanik terbaik & terdekat</p>
                  </div>
                  {autoDispatchMode && <CheckCircle className="h-5 w-5 text-blue-400" />}
                </div>
              </motion.button>

              <div className="relative">
                <div className="absolute inset-x-0 top-0 text-center">
                  <span className="bg-[#050505] px-3 text-[10px] text-gray-500 font-bold uppercase">Atau Pilih Manual</span>
                </div>
                <div className="border-t border-white/5 mt-2" />
              </div>

              {/* Mechanic List */}
              <div className="space-y-2">
                {nearbyMechanics.map((mech) => (
                  <motion.button
                    key={mech.id}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedMechanic?.id === mech.id
                        ? 'border-orange-500/50 bg-orange-500/10'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => { setSelectedMechanic(mech); setAutoDispatchMode(false); }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{mech.avatar || '🔧'}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{mech.name}</span>
                          {mech.isWorkshop && <Badge className="bg-blue-500/20 text-blue-400 text-[8px] border-0">BENGKEL</Badge>}
                        </div>
                        <p className="text-xs text-gray-500">{mech.speciality?.join(', ')}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs ml-0.5">{mech.rating}</span>
                          </div>
                          {mech.distance !== undefined && (
                            <span className="text-[10px] text-gray-500">{mech.distance.toFixed(1)} km</span>
                          )}
                          {mech.etaMinutes && (
                            <span className="text-[10px] text-green-400 font-bold">~{mech.etaMinutes} mnt</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-blue-400">Rp {mech.pricePerHour?.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500">/jam</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-bold"
                disabled={!autoDispatchMode && !selectedMechanic}
                onClick={() => setStep(4)}
              >
                {autoDispatchMode ? 'Pesan Sekarang (Auto)' : 'Lanjutkan'} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-black mb-1">Konfirmasi Pesanan</h2>
                <p className="text-sm text-gray-500">Pastikan semua data sudah benar</p>
              </div>

              <Card className="glass-card rounded-xl">
                <CardContent className="p-4 space-y-3">
                  {isEmergency && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-xs font-bold text-red-400">MODE DARURAT - Biaya +Rp 50.000</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                    <div className="text-2xl">{autoDispatchMode ? '🤖' : selectedMechanic?.avatar || '🔧'}</div>
                    <div>
                      <p className="font-bold">{autoDispatchMode ? 'Auto-Assign' : selectedMechanic?.name}</p>
                      <p className="text-xs text-gray-500">
                        {autoDispatchMode ? 'Mekanik terbaik akan dipilih otomatis' : selectedMechanic?.speciality?.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Layanan</span>
                      <span className="font-bold">{selectedService?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kendaraan</span>
                      <span>{vehicleData.brand} {vehicleData.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lokasi</span>
                      <span className="text-right max-w-[200px] truncate">{location.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Masalah</span>
                      <span className="text-right max-w-[200px] truncate">{problem || selectedService?.name}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Estimasi Biaya</span>
                      <span className="text-lg font-black text-blue-400">
                        Rp {((selectedService?.basePrice || 0) + (isEmergency ? 50000 : 0))?.toLocaleString()}
                      </span>
                    </div>
                    {!autoDispatchMode && selectedMechanic?.etaMinutes && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-500">Estimasi Tiba</span>
                        <span className="text-sm font-bold text-green-400">~{selectedMechanic.etaMinutes} menit</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full bg-green-600 hover:bg-green-500 h-14 rounded-xl font-black text-lg shadow-xl shadow-green-500/20"
                onClick={handleConfirmBooking}
                disabled={bookingMutation.isPending || autoDispatchMutation.isPending}
              >
                {(bookingMutation.isPending || autoDispatchMutation.isPending) ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Mencari Mekanik...</>
                ) : (
                  <><CheckCircle className="h-5 w-5 mr-2" /> KONFIRMASI PESANAN</>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingPage;
