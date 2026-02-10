import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, Check, ChevronRight, ChevronLeft, Upload, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Pendaftaran berhasil! Menunggu verifikasi.');
    navigate('/mechanic/dashboard');
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black text-white italic tracking-tight">INFORMASI KEAHLIAN</h3>
            <div className="space-y-3">
              <Label htmlFor="speciality" className="text-gray-300">Spesialisasi Utama</Label>
              <Select value={formData.speciality} onValueChange={(val) => setFormData({ ...formData, speciality: val })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
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
            <div className="space-y-3">
              <Label htmlFor="experience" className="text-gray-300">Pengalaman Kerja (Tahun)</Label>
              <Input 
                id="experience" 
                type="number" 
                placeholder="Contoh: 5" 
                className="bg-white/5 border-white/10 text-white h-12"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black text-white italic tracking-tight">DOKUMEN PENDUKUNG</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 cursor-pointer transition-all group">
                <Upload className="h-10 w-10 mx-auto text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white uppercase tracking-widest">Unggah KTP</p>
                <p className="text-xs text-gray-500 mt-1">Format JPG, PNG (Maks 5MB)</p>
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 cursor-pointer transition-all group">
                <Award className="h-10 w-10 mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white uppercase tracking-widest">Sertifikat Keahlian</p>
                <p className="text-xs text-gray-500 mt-1">Meningkatkan peluang diterima</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black text-white italic tracking-tight">KONFIRMASI AKHIR</h3>
            <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 backdrop-blur-md">
              <p className="text-sm text-orange-200 leading-relaxed">
                Dengan mendaftar, Anda setuju untuk mengikuti standar pelayanan <span className="font-black italic">OKE MEKANIK</span> dan mematuhi kode etik mitra profesional kami.
              </p>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-orange-600 focus:ring-orange-600 transition-all"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              />
              <Label htmlFor="terms" className="text-sm text-gray-300 font-medium">Saya menyetujui semua syarat & ketentuan</Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-orange-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full" />

      <Card className="w-full max-w-lg bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl relative z-10 rounded-[2.5rem] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-orange-600 via-orange-400 to-transparent" />
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-10 rounded-full transition-all duration-500 ${i <= step ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-white italic tracking-tighter">MITRA MEKANIK</CardTitle>
          <CardDescription className="text-gray-400 text-lg">Lengkapi data untuk mulai menghasilkan</CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="flex justify-between mt-10 pt-8 border-t border-white/10">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/5 h-12 px-6 rounded-xl"
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
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-orange-500/20"
                  onClick={nextStep}
                >
                  LANJUT
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black h-12 px-10 rounded-xl shadow-lg shadow-orange-500/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      MEMPROSES...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      DAFTARKAN
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-black/20 text-center py-6 border-t border-white/10 flex justify-center">
          <div className="flex items-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
            <Shield className="h-4 w-4 mr-2 text-green-500" />
            Security Protocol Encrypted
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MechanicRegistration;
