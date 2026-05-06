import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Car, MapPin, Navigation, Wrench, ChevronLeft, 
<<<<<<< HEAD
  Star, Phone, MessageSquare, Clock, Badge
} from 'lucide-react';
=======
  Star, Phone, MessageSquare, Clock, Sparkles, BrainCircuit, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> jules-1751083910730374172-8e0c37a0
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge as UIBadge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD
import { bookingApi } from '@/lib/api';

interface Mechanic {
  id: string;
  name: string;
  photo: string;
  speciality: string;
  rating: number;
  distance: string;
  price: string;
  eta: string;
  completedJobs: number;
  isOnline: boolean;
  verified: boolean;
  pricePerHour: number;
}
=======
import { useLanguage } from '@/hooks/useLanguage';
import { aiApi, bookingApi, mechanicApi, serviceApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Mechanic } from '@/types';
>>>>>>> jules-1751083910730374172-8e0c37a0

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
<<<<<<< HEAD
const problemTypes = ['Ganti Oli', 'Servis Rutin', 'Masalah Mesin', 'Masalah Ban', 'Masalah Rem', 'Masalah AC', 'Mogok', 'Lainnya'];
=======
>>>>>>> jules-1751083910730374172-8e0c37a0

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
<<<<<<< HEAD
=======
  const { t } = useLanguage();
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
=======
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: -6.2088, lng: 106.8456 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestion: string;
    causes: string[];
    urgency: string;
    confidence: number;
  } | null>(null);
>>>>>>> jules-1751083910730374172-8e0c37a0

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: '',
      vehicleDetails: '',
      location: '',
      description: '',
    },
  });

<<<<<<< HEAD
  const availableMechanics: Mechanic[] = [
    { id: 'M001', name: 'Budi Santoso', photo: '👨‍🔧', speciality: 'Ahli Mesin', rating: 4.8, distance: '2.5 km', price: 'Rp 75.000/jam', eta: '15 menit', completedJobs: 156, isOnline: true, verified: true, pricePerHour: 75000 },
    { id: 'M002', name: 'Sukma Dewi', photo: '👩‍🔧', speciality: 'Ahli Kelistrikan', rating: 4.9, distance: '3.1 km', price: 'Rp 80.000/jam', eta: '20 menit', completedJobs: 89, isOnline: true, verified: true, pricePerHour: 80000 },
    { id: 'M003', name: 'Joko Prasetyo', photo: '👨‍🔧', speciality: 'Servis Umum', rating: 4.7, distance: '4.0 km', price: 'Rp 70.000/jam', eta: '25 menit', completedJobs: 203, isOnline: false, verified: true, pricePerHour: 70000 },
  ];

  const bookingMutation = useMutation({
    mutationFn: async (data: { customerId: number; mechanicId: string; status: string; vehicle: VehicleData; problem: string; location: LocationData; estimatedCost: number; isEmergency: boolean }) => {
      return bookingApi.create({
        mechanicId: data.mechanicId,
        serviceId: 'S1',
        vehicle: data.vehicle,
        problem: data.problem,
        location: { lat: 0, lng: 0, address: data.location.address },
=======
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
>>>>>>> jules-1751083910730374172-8e0c37a0
        scheduledAt: new Date().toISOString(),
        isEmergency: data.isEmergency,
      });
    },
    onSuccess: (data) => {
      toast({
<<<<<<< HEAD
        title: 'Booking Berhasil!',
        description: `${selectedMechanic?.name} sedang menuju lokasi Anda.`,
      });
      navigate(`/customer/tracking?bookingId=${data.id || 1}`);
    },
    onError: () => {
      toast({
        title: 'Booking Gagal',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
=======
        title: t('booking.success_title'),
        description: `${selectedMechanic?.name}${t('booking.success_desc')}`,
      });
      navigate(`/customer/tracking/${data.id}`);
    },
    onError: () => {
      toast({
        title: t('booking.error_title'),
        description: t('booking.error_desc'),
>>>>>>> jules-1751083910730374172-8e0c37a0
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
<<<<<<< HEAD
  }, [searchParams]);
=======
  }, [searchParams, availableMechanics]);
>>>>>>> jules-1751083910730374172-8e0c37a0

  const handleEmergencyBooking = () => {
    setIsEmergency(true);
    toast({
<<<<<<< HEAD
      title: 'Mode Darurat Aktif',
      description: 'Lengkapi detail di bawah dan panggil sekarang.',
=======
      title: t('booking.emergency_active_title'),
      description: t('booking.emergency_active_desc'),
>>>>>>> jules-1751083910730374172-8e0c37a0
    });
  };

  const handleBooking = () => {
    if (!selectedMechanic) {
      toast({
<<<<<<< HEAD
        title: 'Pilih Mekanik',
        description: 'Silakan pilih mekanik terlebih dahulu',
=======
        title: t('booking.select_mech_title'),
        description: t('booking.select_mech_desc'),
>>>>>>> jules-1751083910730374172-8e0c37a0
        variant: 'destructive',
      });
      return;
    }

<<<<<<< HEAD
    bookingMutation.mutate({
      customerId: 1,
=======
    const selectedService = serviceTypes.find(s => s.name === vehicleData.problem);

    bookingMutation.mutate({
>>>>>>> jules-1751083910730374172-8e0c37a0
      mechanicId: selectedMechanic.id,
      status: 'pending',
      vehicle: vehicleData,
      problem: vehicleData.problem,
      location,
<<<<<<< HEAD
      estimatedCost: selectedMechanic.pricePerHour,
      isEmergency,
    });
  };

  const onSubmit = (data: BookingFormValues) => {
    const details = `${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}, ${vehicleData.licensePlate}`;
    const fullData = {
      ...data,
      vehicleDetails: details,
    };
    console.log('Booking submitted:', fullData);
    toast({
      title: 'Booking Dikirim',
      description: 'Menunggu konfirmasi dari sistem.',
    });
  };

  const renderLocationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Lokasi & Masalah Kendaraan
=======
      coords,
      estimatedCost: selectedMechanic.pricePerHour || 50000,
      isEmergency,
      serviceId: selectedService?.id || serviceTypes[0]?.id || 'svc-1',
    });
  };

  const handleAiDiagnostic = async () => {
    if (!vehicleData.problem || vehicleData.problem.length < 5) {
      toast({
        title: t('booking.ai_detail_needed_title'),
        description: t('booking.ai_detail_needed_desc'),
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    setAiSuggestion(null);

    try {
      const response = await aiApi.diagnose(vehicleData.problem) as any;
      const { suggestion, possible_causes, urgency_level, confidence } = response;

      setIsAnalyzing(false);
      setAiSuggestion({
        suggestion,
        causes: possible_causes || [],
        urgency: urgency_level || 'MEDIUM',
        confidence: confidence || 0
      });

      setVehicleData(prev => ({ ...prev, problem: suggestion }));

      toast({
        title: t('booking.ai_success_title'),
        description: `${t('booking.ai_success_desc')}${suggestion}`,
      });
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: t('booking.ai_error_title'),
        description: t('booking.ai_error_desc'),
        variant: 'destructive'
      });
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: t('booking.loc_searching_title'),
        description: t('booking.loc_searching_desc'),
      });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: t('booking.loc_locked_title'),
            description: `${t('booking.loc_locked_desc')}${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: t('booking.loc_error_title'),
            description: t('booking.loc_error_desc'),
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
>>>>>>> jules-1751083910730374172-8e0c37a0
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
<<<<<<< HEAD
          <Label htmlFor="address">Alamat Lengkap</Label>
=======
          <Label htmlFor="address" className="text-gray-300">{t('booking.step1.address')}</Label>
>>>>>>> jules-1751083910730374172-8e0c37a0
          <div className="flex space-x-2">
            <Input
              id="address"
              value={location.address}
              onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
<<<<<<< HEAD
              placeholder="Masukkan alamat lengkap"
            />
            <Button size="sm" variant="outline">
              <Navigation className="h-4 w-4 mr-1" />
              GPS
=======
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
>>>>>>> jules-1751083910730374172-8e0c37a0
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
<<<<<<< HEAD
            <Label htmlFor="brand">Merk Kendaraan</Label>
            <select
              id="brand"
              className="w-full p-2 border rounded-md"
              value={vehicleData.brand}
              onChange={(e) => setVehicleData(prev => ({ ...prev, brand: e.target.value }))}
            >
              <option value="">Pilih merk</option>
              {vehicleBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
=======
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
>>>>>>> jules-1751083910730374172-8e0c37a0
              ))}
            </select>
          </div>
          <div>
<<<<<<< HEAD
            <Label htmlFor="model">Model/Tipe</Label>
=======
            <Label htmlFor="model" className="text-gray-300">{t('booking.step1.model')}</Label>
>>>>>>> jules-1751083910730374172-8e0c37a0
            <Input
              id="model"
              value={vehicleData.model}
              onChange={(e) => setVehicleData(prev => ({ ...prev, model: e.target.value }))}
<<<<<<< HEAD
              placeholder="Avanza, Vario, dll"
            />
          </div>
          <div>
            <Label htmlFor="year">Tahun</Label>
=======
              placeholder={t('booking.step1.model_placeholder')}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="year" className="text-gray-300">{t('booking.step1.year')}</Label>
>>>>>>> jules-1751083910730374172-8e0c37a0
            <Input
              id="year"
              value={vehicleData.year}
              onChange={(e) => setVehicleData(prev => ({ ...prev, year: e.target.value }))}
<<<<<<< HEAD
              placeholder="2019"
            />
          </div>
          <div>
            <Label htmlFor="licensePlate">Plat Nomor</Label>
=======
              placeholder={t('booking.step1.year_placeholder')}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <Label htmlFor="licensePlate" className="text-gray-300">{t('booking.step1.plate')}</Label>
>>>>>>> jules-1751083910730374172-8e0c37a0
            <Input
              id="licensePlate"
              value={vehicleData.licensePlate}
              onChange={(e) => setVehicleData(prev => ({ ...prev, licensePlate: e.target.value }))}
<<<<<<< HEAD
              placeholder="B 1234 XYZ"
=======
              placeholder={t('booking.step1.plate_placeholder')}
              className="bg-white/5 border-white/10 text-white"
>>>>>>> jules-1751083910730374172-8e0c37a0
            />
          </div>
        </div>

<<<<<<< HEAD
        <div>
          <Label htmlFor="problem">Masalah Kendaraan</Label>
          <select
            id="problem"
            className="w-full p-2 border rounded-md mb-2"
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          >
            <option value="">Pilih masalah</option>
            {problemTypes.map(problem => (
              <option key={problem} value={problem}>{problem}</option>
            ))}
          </select>
          <Textarea
            placeholder="Deskripsi detail masalah (opsional)"
            className="mt-2"
=======
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

          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl relative overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-shimmer" />
                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="relative">
                      <BrainCircuit className="h-8 w-8 text-blue-400 animate-pulse" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-4px] border border-dashed border-blue-400/30 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] text-blue-300 font-mono uppercase tracking-widest">{t('common.analyzing')}...</span>
                        <span className="text-[10px] text-blue-400 font-mono">v5.5.0 ULTIMATE+</span>
                      </div>
                      <div className="h-1.5 w-full bg-blue-900/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!isAnalyzing && aiSuggestion && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl mb-4 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Sparkles className="h-12 w-12 text-blue-400" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <UIBadge className={`
                    ${aiSuggestion.urgency === 'CRITICAL' ? 'bg-red-600' :
                      aiSuggestion.urgency === 'HIGH' ? 'bg-orange-600' : 'bg-blue-600'}
                  `}>
                    {aiSuggestion.urgency} PRIORITY
                  </UIBadge>
                  <span className="text-xs font-mono text-blue-400">{aiSuggestion.confidence}% CONFIDENCE</span>
                </div>

                <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-blue-400" />
                  {aiSuggestion.suggestion}
                </h4>

                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{t('booking.ai_possible_causes') || 'Kemungkinan Penyebab'}:</p>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                    {aiSuggestion.causes.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
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
>>>>>>> jules-1751083910730374172-8e0c37a0
            value={vehicleData.problem}
            onChange={(e) => setVehicleData(prev => ({ ...prev, problem: e.target.value }))}
          />
        </div>

<<<<<<< HEAD
        <div className="bg-red-50 p-4 rounded-lg">
          <Button 
            onClick={handleEmergencyBooking}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            DARURAT - Panggil Sekarang
          </Button>
          <p className="text-xs text-red-600 mt-2 text-center">
            Untuk situasi darurat yang membutuhkan bantuan segera
=======
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <Button
            onClick={handleEmergencyBooking}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {t('booking.step1.emergency_btn')}
          </Button>
          <p className="text-xs text-red-400 mt-2 text-center">
            {t('booking.step1.emergency_desc')}
>>>>>>> jules-1751083910730374172-8e0c37a0
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderMechanicSelection = () => (
<<<<<<< HEAD
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="h-5 w-5 mr-2" />
          Pilih Mekanik {isEmergency && <UIBadge className="ml-2 bg-red-600">DARURAT</UIBadge>}
=======
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Car className="h-5 w-5 mr-2 text-blue-400" />
          {t('booking.step2.title')} {isEmergency && <UIBadge className="ml-2 bg-red-600">{t('booking.step2.emergency')}</UIBadge>}
>>>>>>> jules-1751083910730374172-8e0c37a0
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableMechanics.map((mechanic) => (
          <div
            key={mechanic.id}
            onClick={() => setSelectedMechanic(mechanic)}
<<<<<<< HEAD
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMechanic?.id === mechanic.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
=======
            className={`p-4 border rounded-2xl cursor-pointer transition-all ${
              selectedMechanic?.id === mechanic.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/5 hover:bg-white/5'
>>>>>>> jules-1751083910730374172-8e0c37a0
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
<<<<<<< HEAD
                <div className="text-3xl">{mechanic.photo}</div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    {mechanic.name}
                    {mechanic.verified && <UIBadge className="ml-2 bg-green-600 text-xs">Verified</UIBadge>}
                  </h3>
                  <p className="text-sm text-gray-600">{mechanic.speciality}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{mechanic.rating}</span>
                    </div>
                    <UIBadge variant="outline" className="text-xs">
                      {mechanic.distance}
                    </UIBadge>
                    <UIBadge variant="outline" className="text-xs">
                      {mechanic.completedJobs} jobs
=======
                <div className="text-3xl bg-white/5 p-2 rounded-xl">{mechanic.avatar || '👨‍🔧'}</div>
                <div>
                  <h3 className="font-semibold flex items-center text-white">
                    {mechanic.name}
                    <UIBadge className="ml-2 bg-green-500/20 text-green-400 border-green-500/20 text-[10px]">{t('common.verified')}</UIBadge>
                  </h3>
                  <p className="text-sm text-gray-400">{mechanic.speciality?.join(', ')}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1 text-gray-300">{mechanic.rating}</span>
                    </div>
                    <UIBadge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                      {t('common.online')}
>>>>>>> jules-1751083910730374172-8e0c37a0
                    </UIBadge>
                  </div>
                </div>
              </div>
              <div className="text-right">
<<<<<<< HEAD
                <p className="text-sm text-gray-600">ETA: {mechanic.eta}</p>
                <p className="text-lg font-semibold text-blue-600">{mechanic.price}</p>
=======
                <p className="text-sm text-gray-400">{t('common.eta_prefix')} 15 {t('common.minutes').toLowerCase().startsWith('m') ? 'm' : t('common.minutes').toLowerCase()}</p>
                <p className="text-lg font-bold text-blue-400">Rp {mechanic.pricePerHour?.toLocaleString()}/jam</p>
>>>>>>> jules-1751083910730374172-8e0c37a0
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderBookingConfirmation = () => (
<<<<<<< HEAD
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Konfirmasi Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Detail Booking</h3>
          <div className="mt-2 space-y-2">
            <p><strong>Mekanik:</strong> {selectedMechanic?.name}</p>
            <p><strong>Lokasi:</strong> {location.address}</p>
            <p><strong>Kendaraan:</strong> {vehicleData.brand} {vehicleData.model} ({vehicleData.licensePlate})</p>
            <p><strong>Masalah:</strong> {vehicleData.problem}</p>
            <p><strong>Estimasi Biaya:</strong> {selectedMechanic?.price}</p>
            <p><strong>ETA:</strong> {selectedMechanic?.eta}</p>
=======
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
            <p><strong className="text-white">{t('booking.step3.eta')}</strong> 15 {t('common.minutes')}</p>
>>>>>>> jules-1751083910730374172-8e0c37a0
          </div>
        </div>

        <div className="flex space-x-2">
<<<<<<< HEAD
          <Button variant="outline" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Telepon
          </Button>
        </div>

        <Button onClick={handleBooking} className="w-full bg-green-600 hover:bg-green-700" disabled={bookingMutation.isPending}>
          {bookingMutation.isPending ? 'Memproses...' : 'Konfirmasi Booking'}
=======
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
>>>>>>> jules-1751083910730374172-8e0c37a0
        </Button>
      </CardContent>
    </Card>
  );

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-white"
          onClick={() => navigate('/customer/dashboard')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        <Card className="shadow-lg border-none">
          <CardHeader className="bg-blue-600 text-white rounded-t-xl">
            <CardTitle className="text-2xl flex items-center">
              <Wrench className="h-6 w-6 mr-3" />
              Pesan Mekanik
            </CardTitle>
            <CardDescription className="text-blue-100">
              Isi formulir di bawah ini untuk memanggil mekanik ke lokasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
=======
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[160px] rounded-full" />
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

        <Card className="shadow-2xl border border-white/10 bg-black/40 backdrop-blur-[160px] rounded-2xl sm:rounded-[2.5rem] overflow-hidden glass-card">
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
>>>>>>> jules-1751083910730374172-8e0c37a0
            {step === 1 && (
              <div className="space-y-6">
                {renderLocationStep()}
                <Button 
<<<<<<< HEAD
                  className="w-full bg-blue-600 hover:bg-blue-700"
=======
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl"
>>>>>>> jules-1751083910730374172-8e0c37a0
                  onClick={() => {
                    if (location.address && vehicleData.brand && vehicleData.model) {
                      setStep(2);
                    } else {
                      toast({
<<<<<<< HEAD
                        title: 'Lengkapi Data',
                        description: 'Silakan isi semua data yang diperlukan',
=======
                        title: t('booking.complete_data_title'),
                        description: t('booking.complete_data_desc'),
>>>>>>> jules-1751083910730374172-8e0c37a0
                        variant: 'destructive',
                      });
                    }
                  }}
                >
<<<<<<< HEAD
                  Lanjutkan ke Pemilihan Mekanik
=======
                  {t('booking.step1.next')}
>>>>>>> jules-1751083910730374172-8e0c37a0
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
<<<<<<< HEAD
                <Button variant="outline" className="mb-4" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                {renderMechanicSelection()}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
=======
                <Button variant="outline" className="mb-4 border-white/10 text-white hover:bg-white/5" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t('booking.back')}
                </Button>
                {renderMechanicSelection()}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl"
>>>>>>> jules-1751083910730374172-8e0c37a0
                  onClick={() => {
                    if (selectedMechanic) {
                      setStep(3);
                    } else {
                      toast({
<<<<<<< HEAD
                        title: 'Pilih Mekanik',
                        description: 'Silakan pilih mekanik terlebih dahulu',
=======
                      title: t('booking.select_mech_title'),
                      description: t('booking.select_mech_desc'),
>>>>>>> jules-1751083910730374172-8e0c37a0
                        variant: 'destructive',
                      });
                    }
                  }}
                >
<<<<<<< HEAD
                  Lanjutkan ke Konfirmasi
=======
                  {t('booking.step2.next')}
>>>>>>> jules-1751083910730374172-8e0c37a0
                </Button>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
<<<<<<< HEAD
                <Button variant="outline" className="mb-4" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Kembali
=======
                <Button variant="outline" className="mb-4 border-white/10 text-white hover:bg-white/5" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t('booking.back')}
>>>>>>> jules-1751083910730374172-8e0c37a0
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
