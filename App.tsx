import { useEffect, useState } from "react";
import { MemoryRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { PrivacyPolicy } from "./components/legal/PrivacyPolicy";
import { TermsOfUse } from "./components/legal/TermsOfUse";
import { ContactUs } from "./components/legal/ContactUs";
import "./styles/theme.css";
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);
  return <Router>
      <Routes>

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/*" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />} />
      </Routes>
    </Router>;
}