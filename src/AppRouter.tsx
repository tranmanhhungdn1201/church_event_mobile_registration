import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { EventInfoPage } from "./components/EventInfoPage";
import { RegistrationForm } from "./components/RegistrationForm";

export function AppRouter() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventInfoPage />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}