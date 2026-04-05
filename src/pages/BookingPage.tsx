import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Car, MapPin, Navigation, Wrench, ChevronLeft, 
  Star, Phone, MessageSquare, Clock, Sparkles, BrainCircuit, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge as UIBadge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { aiApi, bookingApi, mechanicApi, serviceApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Mechanic } from '@/types';

interface VehicleData {
  brand: string;
  model: string;
  year: string;
  licensePlate: string;
  problem: string;
}

interface LocationData {
  address: string;
}

const vehicleBrands = ['Toyota', 'Honda', 'Suzuki', 'Mitsubishi', 'Nissan', 'Daihatsu', 'Hyundai', 'Kia'];

const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Jenis layanan diperlukan'),
  vehicleDetails: z.string().min(5, 'Detail kendaraan diperlukan'),
  location: z.string().min(10, 'Alamat lengkap diperlukan'),
  description: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [step, setStep] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    problem: '',
  });
  const [location, setLocation] = useState<LocationData>({ address: '' });
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: -6.2088, lng: 106.8456 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: '',
      vehicleDetails: '',
      location: '',
      description: '',
    },
  });

  const { user } = useAuth();

  const { data: availableMechanics = [] } = useQuery({
    queryKey: ['mechanics'],
    queryFn: mechanicApi.getAll,
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getAll(),
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: { mechanicId: string; status: string; vehicle: VehicleData; problem: string; location: LocationData; coords: { lat: number; lng: number }; estimatedCost: number; isEmergency: boolean; serviceId: string }) => {
      return bookingApi.create({
        mechanicId: data.mechanicId,
        serviceId: data.serviceId,
        vehicle: data.vehicle,
        problem: data.problem,
        location: { lat: data.coords.lat, lng: data.coords.lng, address: data.location.address },
        scheduledAt: new Date().toISOString(),
        isEmergency: data.isEmergency,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Booking Berhasil!',
        description: `${selectedMechanic?.name} sedang menuju lokasi Anda.`,
      });
      navigate(`/customer/tracking/${data.id}`);
    },
    onError: () => {
      toast({
        title: 'Booking Gagal',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    const mechId = searchParams.get('mechanicId');
    if (mechId && availableMechanics.length > 0) {
      const mech = availableMechanics.find(m => m.id === mechId);
      if (mech) {
        setSelectedMechanic(mech);
        setStep(2);
      }
    }
  }, [searchParams, availableMechanics]);

  const handleEmergencyBooking = () => {
    setIsEmergency(true);
    toast({
      title: 'Mode Darurat Aktif',
      description: 'Lengkapi detail di bawah dan panggil sekarang.',
    });
  };

  const handleBooking = () => {
    if (!selectedMechanic) {
      toast({
        title: 'Pilih Mekanik',
        description: 'Silakan pilih mekanik terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    const selectedService = serviceTypes.find(s => s.name === vehicleData.problem);

    bookingMutation.mutate({
      mechanicId: selectedMechanic.id,
      status: 'pending',
      vehicle: vehicleData,
      problem: vehicleData.problem,
      location,
      coords,
      estimatedCost: selectedMechanic.pricePerHour || 50000,
      isEmergency,
      serviceId: selectedService?.id || serviceTypes[0]?.id || 'svc-1',
    });
  };

  const handleAiDiagnostic = async () => {
    if (!vehicleData.problem || vehicleData.problem.length < 5) {
      toast({
        title: 'Detail Dibutuhkan',
        description: 'Tuliskan sedikit detail masalah kendaraan Anda untuk dianalisa AI.',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    setAiSuggestion(null);

    try {
      const { suggestion } = await aiApi.diagnose(vehicleData.problem);

      setIsAnalyzing(false);
      setAiSuggestion(suggestion);
      setVehicleData(prev => ({ ...prev, problem: suggestion }));

      toast({
        title: 'Analisa AI Selesai',
        description: `Berdasarkan diagnosa, disarankan memilih layanan: ${suggestion}`,
      });
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: 'Analisa Gagal',
        description: 'Gagal menghubungi server AI. Silakan pilih layanan manual.',
        variant: 'destructive'
      });
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: 'Mencari Lokasi...',
        description: 'Mohon tunggu sebentar.',
      });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: 'Lokasi Terkunci',
            description: `Koordinat: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: 'Gagal Mendapatkan Lokasi',
            description: 'Pastikan izin lokasi aktif.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const renderLocationStep = () => (
    <Card className="glass-card text-white overflow-hidden relative">
      <div className="absolute inset-0 animate-scan pointer-events-none opacity-20" />
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <MapPin className="h-5 w-5 mr-2 text-blue-400" />
          {t('booking.step1.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address" className="text-gray-300">{t('booking.step1.address')}</Label>
          <div className="flex space-x-2">
            <Input
              id="address"
              value={location.address}
              onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
              placeholder={t('booking.step1.address_placeholder')}
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/10"
              onClick={handleGetLocation}
            >
              <Navigation className="h-4 w-4 mr-1" />
              {t('booking.step1.gps')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand" className="text-gray-300">{t('booking.step1.brand')}</Label>
            <select
              id="brand"
              className="w-full p-2 border border-white/10 bg-black/40 text-white rounded-md"
              value={vehicleData.brand}
              onChange={(e) => setVehicleData(prev => ({ ...prev, brand: e.target.value }))}
            >
              <option value="" className="bg-gray-900">{t('booking.step1.brand_placeholder')}</option>
              {vehicleBrands.map(brand => (
                <option key={brand} value={brand} className="bg-gray-900">{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="model" className="text-gray-300">{t('booking.step1.model')}</Label>
            <Input
              id="model"
              value={vehicleData.model}
              onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))}
              placeholder={t('booking.step1.model_placeholder')}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="year" className="text-gray-300">{t('booking.step1.year')}</Label>
            <Input
              id="year"
              value={vehicleData.year}
              onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))}
              placeholder={t('booking.step1.year_placeholder')}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="licensePlate" className="text-gray-300">{t('booking.step1.plate')}</Label>
            <Input
              id="licensePlate"
              value={vehicleData.licensePlate}
              onChange={(e) => setVehicleData(prev => ({ ...prev, licensePlate: e.target.value }))}
              placeholder={t('booking.step1.plate_placeholder')}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="problem" className="text-gray-300">{t('booking.step1.problem')}</Label>
            <Button
              size="xs"
              variant="outline"
              className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-[10px] h-7 px-3 rounded-full relative overflow-hidden group"
              onClick={handleAiDiagnostic}
              disabled={isAnalyzing}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              {isAnalyzing ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              AI DIAGNOSTIC
            </Button>
          </div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-xl flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <BrainCircuit className="h-6 w-6 text-blue-400 animate-pulse" />
                    <div className="absolute inset-0 bg-blue-400 blur-lg opacity-20 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                      />
                    </div>
                    <p className="text-[10px] text-blue-300 mt-1 font-mono uppercase tracking-widest animate-pulse">Analyzing Vehicle Telemetry...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <select
            id="problem"
            className="w-full p-2 border border-white/10 bg-black/40 text-white rounded-md mb-2 transition-all focus:border-blue-500/50 outline-none"
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          >
            <option value="" className="bg-gray-900">{t('booking.step1.problem_placeholder')}</option>
            {serviceTypes.map(svc => (
              <option key={svc.id} value={svc.name} className="bg-gray-900">{svc.name}</option>
            ))}
          </select>
          <Textarea
            placeholder={t('booking.step1.problem_desc_placeholder')}
            className="mt-2 bg-white/5 border-white/10 text-white focus:border-blue-500/50 transition-all min-h-[100px]"
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          />
        </div>

        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <Button 
            onClick={handleEmergencyBooking}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {t('booking.step1.emergency_btn')}
          </Button>
          <p className="text-xs text-red-400 mt-2 text-center">
            {t('booking.step1.emergency_desc')}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderMechanicSelection = () => (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Car className="h-5 w-5 mr-2 text-blue-400" />
          {t('booking.step2.title')} {isEmergency && <UIBadge className="ml-2 bg-red-600">{t('booking.step2.emergency')}</UIBadge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableMechanics.map((mechanic) => (
          <div
            key={mechanic.id}
            onClick={() => setSelectedMechanic(mechanic)}
            className={`p-4 border rounded-2xl cursor-pointer transition-all ${
              selectedMechanic?.id === mechanic.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl bg-white/5 p-2 rounded-xl">{mechanic.avatar || '👨‍🔧'}</div>
                <div>
                  <h3 className="font-semibold flex items-center text-white">
                    {mechanic.name}
                    <UIBadge className="ml-2 bg-green-500/20 text-green-400 border-green-500/20 text-[10px]">Verified</UIBadge>
                  </h3>
                  <p className="text-sm text-gray-400">{mechanic.speciality?.join(', ')}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1 text-gray-300">{mechanic.rating}</span>
                    </div>
                    <UIBadge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                      Online
                    </UIBadge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">ETA: 15m</p>
                <p className="text-lg font-bold text-blue-400">Rp {mechanic.pricePerHour?.toLocaleString()}/jam</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderBookingConfirmation = () => (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Clock className="h-5 w-5 mr-2 text-orange-400" />
          {t('booking.step3.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <h3 className="font-bold text-blue-400">{t('booking.step3.details')}</h3>
          <div className="mt-2 space-y-2 text-gray-300 text-sm">
            <p><strong className="text-white">{t('booking.step3.mechanic')}</strong> {selectedMechanic?.name}</p>
            <p><strong className="text-white">{t('booking.step3.location')}</strong> {location.address}</p>
            <p><strong className="text-white">{t('booking.step3.vehicle')}</strong> {vehicleData.brand} {vehicleData.model} ({vehicleData.licensePlate})</p>
            <p><strong className="text-white">{t('booking.step3.problem')}</strong> {vehicleData.problem}</p>
            <p><strong className="text-white">{t('booking.step3.cost')}</strong> Rp {selectedMechanic?.pricePerHour?.toLocaleString()}</p>
            <p><strong className="text-white">{t('booking.step3.eta')}</strong> 15 {t('tracking.eta').includes('Menit') ? 'Menit' : 'minutes'}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/10">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('booking.step3.btn_chat')}
          </Button>
          <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/10">
            <Phone className="h-4 w-4 mr-2" />
            {t('booking.step3.btn_phone')}
          </Button>
        </div>

        <Button onClick={handleBooking} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl" disabled={bookingMutation.isPending}>
          {bookingMutation.isPending ? t('booking.step3.processing') : t('booking.step3.confirm')}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 px-2 sm:px-0">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-4 text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => navigate('/customer/dashboard')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('booking.back_dashboard')}</span>
            <span className="sm:hidden">{t('booking.back')}</span>
          </Button>
        </motion.div>

        <Card className="shadow-2xl border border-white/10 bg-black/40 backdrop-blur-[40px] rounded-2xl sm:rounded-[2.5rem] overflow-hidden glass-card">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 sm:p-8">
            <CardTitle className="text-3xl font-black flex items-center italic tracking-tight">
              <Wrench className="h-8 w-8 mr-3" />
              {t('booking.title')}
            </CardTitle>
            <CardDescription className="text-blue-100/80 font-medium">
              {t('booking.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                {renderLocationStep()}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl"
                  onClick={() => {
                    if (location.address && vehicleData.brand && vehicleData.model) {
                      setStep(2);
                    } else {
                      toast({
                        title: 'Lengkapi Data',
                        description: 'Silakan isi semua data yang diperlukan',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  {t('booking.step1.next')}
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <Button variant="outline" className="mb-4 border-white/10 text-white hover:bg-white/5" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t('booking.back')}
                </Button>
                {renderMechanicSelection()}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl"
                  onClick={() => {
                    if (selectedMechanic) {
                      setStep(3);
                    } else {
                      toast({
                        title: 'Pilih Mekanik',
                        description: 'Silakan pilih mekanik terlebih dahulu',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  {t('booking.step2.next')}
                </Button>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <Button variant="outline" className="mb-4 border-white/10 text-white hover:bg-white/5" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t('booking.back')}
                </Button>
                {renderBookingConfirmation()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
