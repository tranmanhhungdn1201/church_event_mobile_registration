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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label={t('language.switch')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
        <span className="text-xs text-gray-500">
          {languages.find(lang => lang.code === language)?.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
