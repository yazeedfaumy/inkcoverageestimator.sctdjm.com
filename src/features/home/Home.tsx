import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Calculator, PieChart, Printer, Building2, Users, Menu, X } from "lucide-react";
import Logo from "@/assets/Logo.png";

export function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex flex-col items-center md:flex-row">
              <img src={Logo} alt="Sterling Carter Logo" className="h-8 w-auto" />
              <span className="mt-1 md:mt-0 md:ml-2 text-xl font-bold text-green-900">Ink Calculator</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              to="/contact-us"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Contact
            </Link>
            <Link
              to="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('[data-faq]')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              FAQ
            </Link>
            <Link
              to="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('[data-help]')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Help
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Professional Ink Cost</span>
            <span className="block text-green-600">Calculator for Print Shops</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Accurately calculate ink coverage, estimate printing costs, and optimize your printing expenses with our advanced calculator.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              to="/dashboard"
              className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
            >
              Start Calculating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Comprehensive Print Cost Analysis
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to manage and optimize your printing costs
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      PDF Analysis
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Upload and analyze PDF documents to determine precise ink coverage for each color channel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <Calculator className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Cost Calculation
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Calculate accurate printing costs based on ink coverage and cartridge prices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <PieChart className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Detailed Reports
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Generate comprehensive reports with visualizations and cost breakdowns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Perfect For Your Business
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Trusted by print shops and businesses across Jamaica
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Printer className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Print Shops</h3>
              <p className="text-gray-600">
                Accurately estimate ink costs and provide competitive quotes to your customers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <Building2 className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Corporate Offices</h3>
              <p className="text-gray-600">
                Manage and optimize your organization's printing expenses effectively.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Design Agencies</h3>
              <p className="text-gray-600">
                Create cost-effective designs while maintaining quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to optimize your printing costs?
            </h2>
            <p className="mt-4 text-xl text-green-100">
              Get in touch with Sterling Carter Technology Distributors today
            </p>
            <div className="mt-8">
              <Link
                to="/contact-us"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
                A product of Sterling Carter Technology Distributors
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Contact
              </h3>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-500">22 Cargill Avenue</li>
                <li className="text-gray-500">Kingston 10, Jamaica</li>
                <li className="text-gray-500">Tel: 876-968-6637</li>
                <li className="text-gray-500">Email: info@sctdjm.com</li>
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
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} Sterling Carter Technology Distributors. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}