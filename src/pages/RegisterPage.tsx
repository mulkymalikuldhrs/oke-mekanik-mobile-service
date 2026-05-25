import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Wrench, Building2, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { UserRole } from '@/types';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Pilih peran Anda terlebih dahulu');
      return;
    }
    setIsLoading(true);

    try {
      await registerAuth(formData);
      toast.success(t('register.success'));
      
      if (selectedRole === 'mechanic') {
        navigate('/mechanic/registration');
      } else if (selectedRole === 'workshop') {
        navigate('/mechanic/registration');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (error) {
      toast.error(t('register.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[160px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-orange-600/10 blur-[160px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-black/40 border-white/10 backdrop-blur-[160px] shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                <Wrench className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black text-white">{t('register.title')}</CardTitle>
            <CardDescription className="text-gray-400">{t('register.subtitle')}</CardDescription>
          </CardHeader>

          {/* Role Selection */}
          {!selectedRole ? (
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-gray-400 mb-4">Daftar sebagai:</p>
              <div className="grid gap-3">
                {/* Customer */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all text-left flex items-center gap-4"
                  onClick={() => handleRoleSelect('customer')}
                >
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <Car className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-400">Pelanggan</p>
                    <p className="text-xs text-gray-500">Butuh mekanik? Panggil ke lokasi Anda</p>
                  </div>
                </motion.button>

                {/* Mechanic */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-all text-left flex items-center gap-4"
                  onClick={() => handleRoleSelect('mechanic')}
                >
                  <div className="bg-orange-500/20 p-3 rounded-xl">
                    <Wrench className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-orange-400">Mekanik</p>
                    <p className="text-xs text-gray-500">Bergabung sebagai mitra mekanik keliling</p>
                  </div>
                </motion.button>

                {/* Workshop */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all text-left flex items-center gap-4"
                  onClick={() => handleRoleSelect('workshop')}
                >
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <Building2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-bold text-purple-400">Bengkel / Workshop</p>
                    <p className="text-xs text-gray-500">Daftarkan bengkel Anda sebagai mitra</p>
                  </div>
                </motion.button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 p-0 h-auto" onClick={() => setSelectedRole(null)}>
                    ← Kembali
                  </Button>
                  <Badge className={`${
                    selectedRole === 'customer' ? 'bg-blue-500/20 text-blue-400' :
                    selectedRole === 'mechanic' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-purple-500/20 text-purple-400'
                  } border-0 text-xs`}>
                    {selectedRole === 'customer' ? 'Pelanggan' : selectedRole === 'mechanic' ? 'Mekanik' : 'Bengkel'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">{selectedRole === 'workshop' ? 'Nama Bengkel' : t('register.name')}</Label>
                  <Input id="name" placeholder={selectedRole === 'workshop' ? 'Bengkel Sejahtera' : t('register.name_placeholder')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white/5 border-white/10 text-white focus:border-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">{t('register.email')}</Label>
                  <Input id="email" type="email" placeholder={t('register.email_placeholder')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-white/5 border-white/10 text-white focus:border-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">{t('register.password')}</Label>
                  <Input id="password" type="password" placeholder={t('register.password_placeholder')} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="bg-white/5 border-white/10 text-white focus:border-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">{t('register.phone')}</Label>
                  <Input id="phone" placeholder={t('register.phone_placeholder')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="bg-white/5 border-white/10 text-white focus:border-blue-500/50" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-6">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl h-12 shadow-lg shadow-blue-500/20" disabled={isLoading}>
                  {isLoading ? t('register.button.loading') : t('register.button')}
                </Button>
                <p className="text-sm text-gray-400">
                  {t('register.has_account')}{' '}
                  <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300">{t('register.login_link')}</Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
