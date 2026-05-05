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

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const { t } = useLanguage();
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
      await registerAuth(formData);
      toast.success(t('register.success'));
      
      if (formData.role === 'mechanic') {
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
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
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
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500/50">
                  <SelectValue placeholder={t('register.role.placeholder')} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="customer">{t('register.role.customer')}</SelectItem>
                  <SelectItem value="mechanic">{t('register.role.mechanic')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl h-12 shadow-lg shadow-blue-500/20" disabled={isLoading}>
              {isLoading ? t('register.button.loading') : t('register.button')}
            </Button>
            <p className="text-sm text-gray-400">
              {t('register.has_account')}{' '}
              <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                {t('register.login_link')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
