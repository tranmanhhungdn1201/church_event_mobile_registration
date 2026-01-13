import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
// import { EventInfoPage } from "./components/EventInfoPage";
import { RegistrationForm } from "./components/RegistrationForm";

export function AppRouter() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          {/* <Route path="/info" element={<EventInfoPage />} /> */}
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}