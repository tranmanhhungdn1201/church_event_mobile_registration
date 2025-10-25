import React, { useEffect, useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { RegistrationForm } from './components/RegistrationForm';

export function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <RegistrationForm />
      </div>
    </LanguageProvider>
  );
}