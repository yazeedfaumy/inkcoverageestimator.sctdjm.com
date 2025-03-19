import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import Logo from "@/assets/Logo.png";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button className="p-2 rounded-md md:hidden" onClick={onMenuClick}>
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Sterling Carter Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-green-800">
                Ink Calculator
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="tel:876-968-6637"
              className="hidden md:flex items-center text-gray-600 hover:text-green-600"
            >
              <Phone className="h-5 w-5 mr-2" />
              <span>876-968-6637</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}