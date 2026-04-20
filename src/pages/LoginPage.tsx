import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';

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
      toast.success(t('login.success'));
      navigate(role === 'customer' ? '/customer/dashboard' : '/mechanic/dashboard');
    } catch (error) {
      toast.error(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[160px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full" />

      <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-[160px] shadow-2xl relative z-10 rounded-[2rem] overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-blue-400" />
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Wrench className="h-8 w-8 text-white" />
            </div>
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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pb-10 pt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-14 rounded-xl shadow-xl shadow-blue-500/20 text-lg uppercase tracking-tight" disabled={isLoading}>
              {isLoading ? t('login.button.loading') : t('login.button')}
            </Button>
            <p className="text-sm text-gray-500 font-medium">
              {t('login.no_account')}{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                {t('login.register_link')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
