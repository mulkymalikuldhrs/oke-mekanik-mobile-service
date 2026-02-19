import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, Check, ChevronRight, ChevronLeft, Upload, Loader2, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { mechanicApi } from '@/lib/api';

const MechanicRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    speciality: '',
    experience: '',
    ktpFile: null,
    certificateFile: null,
    termsAccepted: false,
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast.error('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setIsSubmitting(true);
    try {
      await mechanicApi.register({
        speciality: formData.speciality,
        experience: parseInt(formData.experience) || 0,
        phone: '08123456789', // Mock phone
        identityNumber: '1234567890', // Mock identity
        bio: 'Mekanik profesional mitra Oke Mekanik',
      });
      toast.success('Pendaftaran berhasil! Menunggu verifikasi tim ahli.');
      navigate('/mechanic/dashboard');
    } catch (error) {
      toast.error('Gagal mendaftar. Silakan coba lagi.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black italic tracking-tight text-orange-400 uppercase">Informasi Keahlian</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="speciality" className="text-gray-300">Spesialisasi Utama</Label>
                <Select value={formData.speciality} onValueChange={(val) => setFormData({ ...formData, speciality: val })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-orange-500/50 h-12 rounded-xl">
                    <SelectValue placeholder="Pilih Spesialisasi" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="car">Mobil Penumpang</SelectItem>
                    <SelectItem value="motorcycle">Sepeda Motor</SelectItem>
                    <SelectItem value="truck">Kendaraan Berat / Truk</SelectItem>
                    <SelectItem value="electric">Kendaraan Listrik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-gray-300">Pengalaman Kerja (Tahun)</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="Contoh: 5"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500/50 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black italic tracking-tight text-orange-400 uppercase">Dokumen Pendukung</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-orange-500/30 cursor-pointer transition-all group">
                <Upload className="h-10 w-10 mx-auto text-gray-500 mb-3 group-hover:text-orange-400 group-hover:scale-110 transition-all" />
                <p className="text-sm font-bold text-gray-300">UNGGAH KTP</p>
                <p className="text-xs text-gray-500 mt-1">Format JPG, PNG (Maks 5MB)</p>
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-blue-500/30 cursor-pointer transition-all group">
                <Award className="h-10 w-10 mx-auto text-gray-500 mb-3 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                <p className="text-sm font-bold text-gray-300">UNGGAH SERTIFIKAT KEAHLIAN</p>
                <p className="text-xs text-gray-500 mt-1">Opsional - Meningkatkan tingkat verifikasi</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black italic tracking-tight text-orange-400 uppercase">Konfirmasi & Persetujuan</h3>
            <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 backdrop-blur-md">
              <p className="text-sm text-orange-200 leading-relaxed italic">
                "Dengan mendaftar, saya berkomitmen untuk menjaga standar kualitas tinggi Oke Mekanik, memberikan layanan profesional, dan menjunjung tinggi kejujuran dalam setiap pekerjaan."
              </p>
            </div>
            <div className="flex items-start space-x-3 p-2">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="h-5 w-5 rounded-lg border-white/10 bg-white/5 text-orange-600 focus:ring-orange-500"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                />
              </div>
              <Label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer select-none">
                Saya menyetujui seluruh syarat, ketentuan, dan kode etik mitra Oke Mekanik.
              </Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/5 blur-[140px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <Card className="w-full max-w-lg bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl relative z-10 overflow-hidden">
        {/* Progress bar at the top */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(249,115,22,0.5)]"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <CardHeader className="pt-10 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 p-4 rounded-2xl shadow-xl shadow-orange-500/20 group hover:scale-110 transition-transform">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black italic tracking-tighter uppercase">PENDAFTARAN MITRA</CardTitle>
          <CardDescription className="text-gray-400 italic">Mulai karir masa depan Anda di Oke Mekanik</CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/5 font-bold"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  KEMBALI
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  className="bg-white/10 hover:bg-white/20 text-white font-black px-8 rounded-xl h-12 transition-all active:scale-95"
                  onClick={nextStep}
                >
                  LANJUT
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black px-10 rounded-xl h-12 shadow-xl shadow-orange-500/30 transition-all active:scale-95 min-w-[160px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      MEMPROSES...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      SELESAIKAN
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-white/5 text-center py-6 border-t border-white/5 flex justify-center backdrop-blur-3xl">
          <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
            Keamanan Data Terenkripsi SSL/TLS
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MechanicRegistration;
