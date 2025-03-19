import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, HelpCircle, FileQuestion } from "lucide-react";
import Logo from "@/assets/Logo.png";

export function Footer() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const contactInfo = {
    email: "info@sctdjm.com",
    company: "Sterling Carter Technology Distributors",
    address: "22 Cargill Avenue",
    city: "Kingston 10",
    country: "Jamaica",
    phone: "876-968-6637"
  };

  const faqItems = [
    {
      question: "How do I analyze a document?",
      answer: "Upload your PDF document in the File Analysis section. Our system will automatically analyze ink coverage and calculate costs."
    },
    {
      question: "What file formats are supported?",
      answer: "Currently, we support PDF files for analysis. Make sure your document is in PDF format before uploading."
    },
    {
      question: "How accurate are the cost calculations?",
      answer: "Our calculations are highly accurate, based on your specific cartridge settings and actual ink coverage analysis of each page."
    },
    {
      question: "Can I save my analysis results?",
      answer: "Yes, you can export your analysis results in multiple formats including PDF, CSV, and Excel."
    },
    {
      question: "Is my document data secure?",
      answer: "Yes, all document processing happens locally in your browser. We don't store or transmit your documents to any server."
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <img src={Logo} alt="Sterling Carter Logo" className="h-8 w-auto" />
              <span className="ml-2 text-lg font-semibold text-green-900">
                Ink Calculator
              </span>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              Professional ink cost calculator by Sterling Carter Technology Distributors. 
              Calculate ink coverage and optimize your printing costs.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="tel:876-968-6637" className="flex items-center text-gray-500 hover:text-green-600">
                  <Phone className="h-5 w-5 mr-2" />
                  876-968-6637
                </a>
              </li>
              <li>
                <a href="mailto:info@sctdjm.com" className="flex items-center text-gray-500 hover:text-green-600">
                  <Mail className="h-5 w-5 mr-2" />
                  info@sctdjm.com
                </a>
              </li>
              <li>
                <div className="flex items-start text-gray-500">
                  <MapPin className="h-5 w-5 mr-2 mt-1" />
                  <div>
                    22 Cargill Avenue<br />
                    Kingston 10, Jamaica
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-green-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analysis" className="text-gray-500 hover:text-green-600">
                  File Analysis
                </Link>
              </li>
              <li>
                <Link to="/dashboard/calculator" className="text-gray-500 hover:text-green-600">
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/dashboard/reports" className="text-gray-500 hover:text-green-600">
                  Reports
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setShowFaqModal(true)}
                  className="text-gray-500 hover:text-green-600 flex items-center"
                >
                  <FileQuestion className="h-4 w-4 mr-1" />
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="text-gray-500 hover:text-green-600 flex items-center"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-500 hover:text-green-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-gray-500 hover:text-green-600">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-500 hover:text-green-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Sterling Carter Technology Distributors. All rights reserved.
          </p>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800">Contact Information</h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{contactInfo.company}</h3>
                <p className="text-gray-600 mt-1">Your trusted partner in printing solutions</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">
                  {contactInfo.address}<br />
                  {contactInfo.city}<br />
                  {contactInfo.country}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Contact</h3>
                <p className="text-gray-600">
                  Email: <a href={`mailto:${contactInfo.email}`} className="text-green-600 hover:underline">{contactInfo.email}</a><br />
                  Tel: <a href={`tel:${contactInfo.phone}`} className="text-green-600 hover:underline">{contactInfo.phone}</a>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 8:30 AM - 5:00 PM<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800">Frequently Asked Questions</h2>
              <button
                onClick={() => setShowFaqModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}