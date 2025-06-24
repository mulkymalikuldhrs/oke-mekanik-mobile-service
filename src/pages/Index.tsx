
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, MapPin, Star, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'mechanic' | null>(null);

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: t('feature.location.title'),
      description: t('feature.location.desc')
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: t('feature.realtime.title'),
      description: t('feature.realtime.desc')
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: t('feature.rating.title'),
      description: t('feature.rating.desc')
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: t('feature.verified.title'),
      description: t('feature.verified.desc')
    }
  ];

  const handleRoleSelection = (role: 'customer' | 'mechanic') => {
    setSelectedRole(role);
    if (role === 'customer') {
      navigate('/customer/dashboard');
    } else {
      navigate('/mechanic/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Oke Mekanik</h1>
        </div>
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card 
            className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-blue-500"
            onClick={() => handleRoleSelection('customer')}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Car className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('role.customer.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('role.customer.desc')}
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                {t('role.customer.button')}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-orange-500"
            onClick={() => handleRoleSelection('mechanic')}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-orange-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Wrench className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('role.mechanic.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('role.mechanic.desc')}
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                {t('role.mechanic.button')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('features.title')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            {t('cta.title')}
          </h3>
          <p className="text-xl mb-8 opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => handleRoleSelection('customer')}
            >
              {t('cta.customer')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => handleRoleSelection('mechanic')}
            >
              {t('cta.mechanic')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
