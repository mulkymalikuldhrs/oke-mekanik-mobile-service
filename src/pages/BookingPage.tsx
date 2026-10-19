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

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1=Location & Vehicle, 2=Mechanic, 3=Confirm
  const [selectedServiceId, setSelectedServiceId] = useState<string>('svc-1');
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
    }
    if (mechId) {
      setStep(2);
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
            <h1 className="text-sm font-black">{t('booking.title')}</h1>
            <p className="text-[10px] text-gray-500">Step {step}/3</p>
          </div>
          <div className="flex gap-1">
            {[1,2,3].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Location & Vehicle Problem */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-black mb-1">{t('booking.step1.title')}</h2>
                <p className="text-sm text-gray-500">{t('booking.subtitle')}</p>
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
                <Label htmlFor="address-input" className="text-xs text-gray-400">{t('booking.step1.address')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="address-input"
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
                  <Label htmlFor="brand-select" className="text-xs text-gray-400">{t('booking.step1.brand')}</Label>
                  <Input
                    id="brand-select"
                    value={vehicleData.brand}
                    onChange={(e) => setVehicleData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder={t('booking.step1.brand_placeholder')}
                    className="bg-white/5 border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="model-input" className="text-xs text-gray-400">{t('booking.step1.model')}</Label>
                  <Input
                    id="model-input"
                    value={vehicleData.model}
                    onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder={t('booking.step1.model_placeholder')}
                    className="bg-white/5 border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="year-input" className="text-xs text-gray-400">{t('booking.step1.year')}</Label>
                  <Input
                    id="year-input"
                    value={vehicleData.year}
                    onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder={t('booking.step1.year_placeholder')}
                    className="bg-white/5 border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="plate-input" className="text-xs text-gray-400">{t('booking.step1.plate')}</Label>
                  <Input
                    id="plate-input"
                    value={vehicleData.licensePlate}
                    onChange={(e) => setVehicleData(prev => ({ ...prev, licensePlate: e.target.value }))}
                    placeholder={t('booking.step1.plate_placeholder')}
                    className="bg-white/5 border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              {/* Problem Description & AI Diagnostic */}
              <div className="space-y-2">
                <Label htmlFor="problem-input" className="text-xs text-gray-400">{t('booking.step1.problem')}</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="problem-input"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder={t('booking.step1.problem_desc_placeholder')}
                    className="flex-1 bg-white/5 border-white/10 text-white min-h-[80px]"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 w-full"
                  onClick={handleAiDiagnostic}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Analisis Diagnosa AI
                </Button>

                {aiSuggestion && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs font-bold text-blue-400">Rekomendasi AI: {aiSuggestion.suggestion} ({aiSuggestion.confidence}%)</p>
                    <p className="text-[10px] text-gray-400 mt-1">Urgency: {aiSuggestion.urgency_level}</p>
                  </motion.div>
                )}
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-bold text-sm"
                disabled={!location.address || !vehicleData.brand}
                onClick={() => setStep(2)}
              >
                {t('booking.step1.next')} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Choose Mechanic */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-black mb-1">{t('booking.step2.title')}</h2>
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
                onClick={() => setStep(3)}
              >
                {t('booking.step2.next')} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-black mb-1">{t('booking.step3.title')}</h2>
                <p className="text-sm text-gray-500">Pastikan semua data sudah benar</p>
              </div>

              <Card className="bg-white/5 border-white/5 rounded-xl">
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
                      <span className="text-gray-500">{t('booking.step3.mechanic')}</span>
                      <span className="font-bold">{autoDispatchMode ? 'Auto-Assign' : selectedMechanic?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('booking.step3.vehicle')}</span>
                      <span>{vehicleData.brand} {vehicleData.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('booking.step3.location')}</span>
                      <span className="text-right max-w-[200px] truncate">{location.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('booking.step3.problem')}</span>
                      <span className="text-right max-w-[200px] truncate">{problem || selectedService?.name}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">{t('booking.step3.cost')}</span>
                      <span className="text-lg font-black text-blue-400">
                        Rp {((selectedService?.basePrice || 75000) + (isEmergency ? 50000 : 0))?.toLocaleString()}
                      </span>
                    </div>
                    {!autoDispatchMode && selectedMechanic?.etaMinutes && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-500">{t('booking.step3.eta')}</span>
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
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> {t('booking.step3.processing')}</>
                ) : (
                  <><CheckCircle className="h-5 w-5 mr-2" /> {t('booking.step3.confirm')}</>
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
