
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'id' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('id')}
        className="flex items-center space-x-1"
      >
        <span className="text-lg">🇮🇩</span>
        <span>ID</span>
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="flex items-center space-x-1"
      >
        <span className="text-lg">🇺🇸</span>
        <span>EN</span>
      </Button>
    </div>
  );
};

export default LanguageToggle;
