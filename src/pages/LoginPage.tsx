import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { Wrench, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[160px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
             className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 mb-4"
           >
             <ShieldCheck className="h-3 w-3 text-blue-400 mr-2" />
             <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Secured v28 Access</span>
           </motion.div>
        </div>

        <Card className="border-white/5 bg-black/40 backdrop-blur-[160px] shadow-2xl rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
          <CardHeader className="text-center pb-2 pt-10">
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gradient-to-tr from-blue-600 to-blue-400 p-4 rounded-2xl shadow-xl shadow-blue-500/30 relative"
              >
                <Wrench className="h-8 w-8 text-white relative z-10" />
                <Sparkles className="h-4 w-4 text-white absolute -top-1 -right-1 animate-pulse" />
              </motion.div>
            </div>
            <CardTitle className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">OKE MEKANIK</CardTitle>
            <CardDescription className="text-gray-500 font-bold tracking-widest text-[10px] uppercase mt-2">{t('login.title')}</CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6 px-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('login.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-blue-500/50 transition-all focus:bg-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('login.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-blue-500/50 transition-all focus:bg-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">{t('login.role.label')}</Label>
              <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-14 rounded-xl focus:border-blue-500/50 transition-all focus:bg-white/10">
                  <SelectValue placeholder={t('login.role.placeholder')} />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white rounded-xl backdrop-blur-[160px]">
                  <SelectItem value="customer" className="focus:bg-blue-600 focus:text-white rounded-lg m-1">{t('login.role.customer')}</SelectItem>
                  <SelectItem value="mechanic" className="focus:bg-blue-600 focus:text-white rounded-lg m-1">{t('login.role.mechanic')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pb-12 pt-8 px-10">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-16 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] text-xl uppercase tracking-tighter italic transition-all active:scale-95 group/btn overflow-hidden relative"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
              <span className="relative z-10">{isLoading ? t('login.button.loading') : t('login.button')}</span>
            </Button>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">
              {t('login.no_account')}{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                {t('login.register_link')}
              </Link>
            </p>
          </CardFooter>
        </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
