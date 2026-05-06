import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
<<<<<<< HEAD
import { Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';
=======
import { Wrench, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';
>>>>>>> jules-1751083910730374172-8e0c37a0

const LoginPage = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, role);
<<<<<<< HEAD
      toast.success('Login berhasil!');
      navigate(role === 'customer' ? '/customer/dashboard' : '/mechanic/dashboard');
    } catch (error) {
      toast.error('Login gagal. Silakan coba lagi.');
=======
      toast.success(t('login.success'));
      navigate(role === 'customer' ? '/customer/dashboard' : '/mechanic/dashboard');
    } catch (error) {
      toast.error(t('login.error'));
>>>>>>> jules-1751083910730374172-8e0c37a0
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Oke Mekanik</CardTitle>
          <CardDescription>Masuk ke akun Anda</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Masuk sebagai</Label>
              <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Pelanggan</SelectItem>
                  <SelectItem value="mechanic">Mekanik</SelectItem>
=======
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[160px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-white/10 bg-black/40 backdrop-blur-[160px] shadow-2xl rounded-[2rem] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-blue-400" />
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20 relative"
              >
                <Wrench className="h-8 w-8 text-white relative z-10" />
                <Sparkles className="h-4 w-4 text-blue-200 absolute -top-1 -right-1 animate-bounce" />
              </motion.div>
            </div>
            <CardTitle className="text-3xl font-black text-white italic tracking-tight">OKE MEKANIK</CardTitle>
            <CardDescription className="text-gray-400 font-medium">{t('login.title')}</CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 ml-1">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('login.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 ml-1">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('login.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300 ml-1">{t('login.role.label')}</Label>
              <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-blue-500/50 transition-all">
                  <SelectValue placeholder={t('login.role.placeholder')} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="customer">{t('login.role.customer')}</SelectItem>
                  <SelectItem value="mechanic">{t('login.role.mechanic')}</SelectItem>
>>>>>>> jules-1751083910730374172-8e0c37a0
                </SelectContent>
              </Select>
            </div>
          </CardContent>
<<<<<<< HEAD
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Memuat...' : 'Masuk'}
            </Button>
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Daftar sekarang
=======
          <CardFooter className="flex flex-col space-y-6 pb-10 pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-14 rounded-xl shadow-xl shadow-blue-500/20 text-lg uppercase tracking-tight" disabled={isLoading}>
              {isLoading ? t('login.button.loading') : t('login.button')}
            </Button>
            <p className="text-sm text-gray-500 font-medium">
              {t('login.no_account')}{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                {t('login.register_link')}
>>>>>>> jules-1751083910730374172-8e0c37a0
              </Link>
            </p>
          </CardFooter>
        </form>
<<<<<<< HEAD
      </Card>
=======
        </Card>
      </motion.div>
>>>>>>> jules-1751083910730374172-8e0c37a0
    </div>
  );
};

export default LoginPage;
