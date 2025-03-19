import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { PrivacyPolicy } from "./features/legal/PrivacyPolicy";
import { TermsOfUse } from "./features/legal/TermsOfUse";
import { ContactUs } from "./features/legal/ContactUs";
import { Home } from "./features/home/Home";
import "./styles/theme.css";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/dashboard/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}