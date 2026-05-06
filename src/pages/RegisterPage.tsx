import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
<<<<<<< HEAD
=======
import { useLanguage } from '@/hooks/useLanguage';
>>>>>>> jules-1751083910730374172-8e0c37a0
import { Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';

const RegisterPage = () => {
<<<<<<< HEAD
  const { register } = useAuth();
=======
  const { register: registerAuth } = useAuth();
  const { t } = useLanguage();
>>>>>>> jules-1751083910730374172-8e0c37a0
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer' as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
<<<<<<< HEAD
      await register(formData);
      toast.success('Pendaftaran berhasil!');
=======
      await registerAuth(formData);
      toast.success(t('register.success'));
>>>>>>> jules-1751083910730374172-8e0c37a0
      
      if (formData.role === 'mechanic') {
        navigate('/mechanic/registration');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (error) {
<<<<<<< HEAD
      toast.error('Pendaftaran gagal. Silakan coba lagi.');
=======
      toast.error(t('register.error'));
>>>>>>> jules-1751083910730374172-8e0c37a0
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Daftar Oke Mekanik</CardTitle>
          <CardDescription>Mulai perjalanan Anda bersama kami</CardDescription>
=======
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[160px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[160px] rounded-full" />

      <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-[160px] shadow-2xl relative z-10 rounded-[2rem] overflow-hidden">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-white italic tracking-tighter">{t('register.title')}</CardTitle>
          <CardDescription className="text-gray-400">{t('register.subtitle')}</CardDescription>
>>>>>>> jules-1751083910730374172-8e0c37a0
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
<<<<<<< HEAD
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Joko Susilo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                placeholder="0812XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Daftar sebagai</Label>
=======
              <Label htmlFor="name" className="text-gray-300">{t('register.name')}</Label>
              <Input
                id="name"
                placeholder={t('register.name_placeholder')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">{t('register.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('register.email_placeholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">{t('register.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('register.password_placeholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">{t('register.phone')}</Label>
              <Input
                id="phone"
                placeholder={t('register.phone_placeholder')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">{t('register.role.label')}</Label>
>>>>>>> jules-1751083910730374172-8e0c37a0
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
              >
<<<<<<< HEAD
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Pelanggan</SelectItem>
                  <SelectItem value="mechanic">Mekanik</SelectItem>
=======
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500/50">
                  <SelectValue placeholder={t('register.role.placeholder')} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="customer">{t('register.role.customer')}</SelectItem>
                  <SelectItem value="mechanic">{t('register.role.mechanic')}</SelectItem>
>>>>>>> jules-1751083910730374172-8e0c37a0
                </SelectContent>
              </Select>
            </div>
          </CardContent>
<<<<<<< HEAD
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Memuat...' : 'Daftar'}
            </Button>
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Masuk di sini
=======
          <CardFooter className="flex flex-col space-y-6">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl h-12 shadow-lg shadow-blue-500/20" disabled={isLoading}>
              {isLoading ? t('register.button.loading') : t('register.button')}
            </Button>
            <p className="text-sm text-gray-400">
              {t('register.has_account')}{' '}
              <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                {t('register.login_link')}
>>>>>>> jules-1751083910730374172-8e0c37a0
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
