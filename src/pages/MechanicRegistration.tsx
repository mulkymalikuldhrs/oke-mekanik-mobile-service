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
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';

const MechanicRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    speciality: '',
    experience: '',
    phone: '',
    identityNumber: '',
    bio: '',
    termsAccepted: false,
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
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
        phone: formData.phone || user?.phone || '',
        identityNumber: formData.identityNumber,
        bio: formData.bio || 'Mekanik profesional mitra Oke Mekanik',
      });
      toast.success('Pendaftaran berhasil! Menunggu verifikasi tim ahli.');
      navigate('/mechanic/dashboard');
    } catch (error) {
      toast.error('Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black italic tracking-tight text-orange-400 uppercase">{t('mechanic.reg.step1_title')}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="speciality" className="text-gray-300">{t('mechanic.reg.speciality')}</Label>
                <Select value={formData.speciality} onValueChange={(val) => setFormData({ ...formData, speciality: val })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-orange-500/50 h-12 rounded-xl">
                    <SelectValue placeholder={t('mechanic.reg.spec_placeholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="car">{t('mechanic.reg.spec_car')}</SelectItem>
                    <SelectItem value="motorcycle">{t('mechanic.reg.spec_motor')}</SelectItem>
                    <SelectItem value="truck">{t('mechanic.reg.spec_truck')}</SelectItem>
                    <SelectItem value="electric">{t('mechanic.reg.spec_electric')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-gray-300">{t('mechanic.reg.experience')}</Label>
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
            <h3 className="text-xl font-black italic tracking-tight text-orange-400 uppercase">{t('mechanic.reg.step2_title')}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">{t('mechanic.reg.phone')}</Label>
                <Input
                  id="phone"
                  placeholder="0812..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus:border-orange-500/50 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identity" className="text-gray-300">{t('mechanic.reg.identity')}</Label>
                <Input
                  id="identity"
                  placeholder="3201..."
                  value={formData.identityNumber}
                  onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus:border-orange-500/50 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">{t('mechanic.reg.bio')}</Label>
                <Input
                  id="bio"
                  placeholder="Ceritakan sedikit tentang keahlian Anda"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus:border-orange-500/50 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black italic tracking-tight text-orange-400 uppercase">{t('mechanic.reg.step3_title')}</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-orange-500/30 cursor-pointer transition-all group">
                <Upload className="h-10 w-10 mx-auto text-gray-500 mb-3 group-hover:text-orange-400 group-hover:scale-110 transition-all" />
                <p className="text-sm font-bold text-gray-300">{t('mechanic.reg.upload_ktp')}</p>
                <p className="text-xs text-gray-500 mt-1">Format JPG, PNG (Maks 5MB)</p>
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-blue-500/30 cursor-pointer transition-all group">
                <Award className="h-10 w-10 mx-auto text-gray-500 mb-3 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                <p className="text-sm font-bold text-gray-300">{t('mechanic.reg.upload_cert')}</p>
                <p className="text-xs text-gray-500 mt-1">Opsional - Meningkatkan tingkat verifikasi</p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xl font-black italic tracking-tight text-orange-400 uppercase">{t('mechanic.reg.step4_title')}</h3>
            <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20 backdrop-blur-md">
              <p className="text-sm text-orange-200 leading-relaxed italic">
                {t('mechanic.reg.terms_text')}
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
                {t('mechanic.reg.terms_check')}
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
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <CardHeader className="pt-10 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 p-4 rounded-2xl shadow-xl shadow-orange-500/20 group hover:scale-110 transition-transform">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black italic tracking-tighter uppercase">{t('mechanic.reg.title')}</CardTitle>
          <CardDescription className="text-gray-400 italic">{t('mechanic.reg.subtitle')}</CardDescription>
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
                  {t('mechanic.reg.btn_back')}
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  className="bg-white/10 hover:bg-white/20 text-white font-black px-8 rounded-xl h-12 transition-all active:scale-95"
                  onClick={nextStep}
                >
                  {t('mechanic.reg.btn_next')}
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
                      {t('mechanic.reg.processing')}
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      {t('mechanic.reg.btn_finish')}
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
            {t('mechanic.reg.secure_msg')}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MechanicRegistration;
