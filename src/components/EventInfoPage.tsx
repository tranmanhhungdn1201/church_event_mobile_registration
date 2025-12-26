import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Calendar, MapPin, Clock, Users, Gift, Music, MessageCircle, Phone, Mail } from 'lucide-react';

export const EventInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleStartRegistration = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/assets/logo.png" 
              alt="IOY DNCOC Logo" 
              className="w-10 h-10 mr-3 object-contain"
            />
            <h1 className="text-lg font-semibold text-gray-800">{t('eventInfo.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6 animate-fade-in">
            <img 
              src="/assets/logo.png" 
              alt="IOY DNCOC Logo" 
              className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
            {t('eventInfo.title')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up animation-delay-100">
            {t('eventInfo.tagline')}
          </p>
          <button
            onClick={handleStartRegistration}
            className="px-8 py-4 bg-white text-[#2E5AAC] font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg animate-slide-up animation-delay-200"
          >
            {t('eventInfo.startRegistration')}
          </button>
        </div>
      </section>

      {/* Event Details */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Date Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E5AAC] to-[#1e3a8a] rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t('eventInfo.eventDate')}</h3>
            </div>
            <p className="text-gray-600 text-base">{t('eventInfo.dateValue')}</p>
          </div>

          {/* Time Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E5AAC] to-[#1e3a8a] rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t('eventInfo.eventTime')}</h3>
            </div>
            <p className="text-gray-600 text-base">{t('eventInfo.timeValue')}</p>
          </div>

          {/* Location Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E5AAC] to-[#1e3a8a] rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t('eventInfo.eventLocation')}</h3>
            </div>
            <p className="text-gray-600 text-base">{t('eventInfo.locationValue')}</p>
          </div>
        </div>

        {/* About Event */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('eventInfo.aboutEvent')}</h3>
          <p className="text-gray-600 text-lg leading-relaxed">{t('eventInfo.aboutDescription')}</p>
        </div>

        {/* Highlights */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('eventInfo.highlights')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Music, text: t('eventInfo.highlight1') },
              { icon: MessageCircle, text: t('eventInfo.highlight2') },
              { icon: Users, text: t('eventInfo.highlight3') },
              { icon: Users, text: t('eventInfo.highlight4') },
              { icon: Gift, text: t('eventInfo.highlight5') }
            ].map((highlight, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 flex items-start space-x-4 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E5AAC] to-[#1e3a8a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <highlight.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700 text-base">{highlight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('eventInfo.schedule')}</h3>
          <div className="space-y-4">
            {[
              { day: t('eventInfo.day1'), details: t('eventInfo.day1Details') },
              { day: t('eventInfo.day2'), details: t('eventInfo.day2Details') },
              { day: t('eventInfo.day3'), details: t('eventInfo.day3Details') }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform hover:scale-102 transition-all duration-300 hover:shadow-xl"
              >
                <h4 className="text-lg font-bold text-[#2E5AAC] mb-2">{item.day}</h4>
                <p className="text-gray-600">{item.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('eventInfo.packages')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: t('eventInfo.packageA'), 
                price: t('eventInfo.packageAPrice'), 
                desc: t('eventInfo.packageADesc'),
                gradient: 'from-blue-500 to-blue-600'
              },
              { 
                title: t('eventInfo.packageB'), 
                price: t('eventInfo.packageBPrice'), 
                desc: t('eventInfo.packageBDesc'),
                gradient: 'from-indigo-500 to-indigo-600'
              },
              { 
                title: t('eventInfo.packageC'), 
                price: t('eventInfo.packageCPrice'), 
                desc: t('eventInfo.packageCDesc'),
                gradient: 'from-purple-500 to-purple-600'
              }
            ].map((pkg, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`bg-gradient-to-r ${pkg.gradient} text-white p-6`}>
                  <h4 className="text-xl font-bold mb-2">{pkg.title}</h4>
                  <p className="text-2xl font-bold">{pkg.price}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{pkg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] rounded-2xl shadow-2xl p-8 sm:p-12 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t('eventInfo.title')}</h3>
          <p className="text-lg mb-8 text-blue-100">{t('eventInfo.aboutDescription')}</p>
          <button
            onClick={handleStartRegistration}
            className="px-8 py-4 bg-white text-[#2E5AAC] font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            {t('eventInfo.startRegistration')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <img 
                src="/assets/logo.png" 
                alt="IOY DNCOC Logo" 
                className="w-10 h-10 mr-3 object-contain"
              />
              <div>
                <h4 className="font-bold">{t('eventInfo.title')}</h4>
                <p className="text-sm text-gray-400">{t('eventInfo.tagline')}</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="font-bold mb-2">{t('eventInfo.contactUs')}</h4>
              <div className="flex flex-col space-y-1 text-sm text-gray-400">
                <div className="flex items-center justify-center sm:justify-end">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{t('eventInfo.phone')}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-end">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{t('eventInfo.email')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© 2025 IOY DNCOC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: backwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};
