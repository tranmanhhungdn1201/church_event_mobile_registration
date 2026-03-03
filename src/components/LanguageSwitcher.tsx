import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'vi' as const, name: t('language.vietnamese'), flag: '🇻🇳' },
    { code: 'en' as const, name: t('language.english'), flag: '🇺🇸' }
  ];

  const handleLanguageChange = (langCode: 'vi' | 'en') => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return null;
};
