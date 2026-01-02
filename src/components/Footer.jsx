import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component - 4 Column Layout
 * Sections: About, Quick Links, Legal, Contact
 */
const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 mt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="animate-fadeInUp">
            <h3 className="text-2xl font-bold mb-5 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">About</h3>
            <p className="text-gray-400 text-sm">
              Study With Maryam is Pakistan's leading free education platform providing 
              comprehensive study material for classes 9-12 and entrance exam preparation 
              including MDCAT, NUMS, NUST, and more.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="animate-fadeInUp delay-100">
            <h3 className="text-2xl font-bold mb-5 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 font-medium">📍 Home</Link></li>
              <li><Link to="/notes" className="text-gray-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 font-medium">📚 Notes</Link></li>
              <li><Link to="/past-papers" className="text-gray-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 font-medium">📄 Past Papers</Link></li>
              <li><Link to="/mcqs" className="text-gray-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 font-medium">✍️ MCQs Bank</Link></li>
              <li><Link to="/study-tips" className="text-gray-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 font-medium">💡 Study Tips</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 font-medium">📧 Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="animate-fadeInUp delay-200">
            <h3 className="text-2xl font-bold mb-5 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-gray-400 hover:text-white transition">Disclaimer</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="animate-fadeInUp delay-300">
            <h3 className="text-2xl font-bold mb-5 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-gray-400">
                <span className="mr-2">📱</span>
                <a href="https://wa.me/923001234567" className="hover:text-white transition">
                  WhatsApp: +92 300 1234567
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <span className="mr-2">✉️</span>
                <a href="mailto:contact@studywithmaryam.com" className="hover:text-white transition">
                  contact@studywithmaryam.com
                </a>
              </li>
              <li className="flex items-center space-x-4 mt-6">
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-2xl hover:scale-125 inline-block transform">📘</a>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-all duration-300 text-2xl hover:scale-125 inline-block transform">📷</a>
                <a href="#" className="text-gray-300 hover:text-blue-300 transition-all duration-300 text-2xl hover:scale-125 inline-block transform">🐦</a>
                <a href="#" className="text-gray-300 hover:text-red-400 transition-all duration-300 text-2xl hover:scale-125 inline-block transform">▶️</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Study With Maryam - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
