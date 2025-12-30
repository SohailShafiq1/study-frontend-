import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClasses, getEntranceExams } from '../api';

/**
 * Header Component - Sticky Navigation Bar
 * Contains: Logo, Search Bar, Navigation Menu with Dropdowns
 */
const Header = () => {
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [isExamsOpen, setIsExamsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cls = await getClasses();
        setClasses(cls.data || []);
      } catch (e) {
        console.error('Failed to load classes for header:', e);
      }
      try {
        const res = await getEntranceExams();
        setExams(res.data || []);
      } catch (e) {
        console.error('Failed to load entrance exams for header:', e);
      }
    };
    fetchData();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              📚 Study With Maryam
            </h1>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Search notes, past papers, or syllabus…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button className="px-6 py-2 bg-primary text-white rounded-r-lg hover:bg-blue-700 transition">
              🔍
            </button>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition text-sm">
              Home
            </Link>

            {/* Classes Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsClassesOpen(true)}
              onMouseLeave={() => setIsClassesOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-primary font-medium transition flex items-center text-sm"
              >
                Classes ▼
              </button>
              <div
                className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out"
              >
                {classes.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">No classes</div>
                ) : (
                  classes.map((c) => (
                    <Link 
                      key={c._id} 
                      to={`/classes/${c._id}`} 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                    >
                      {c.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link to="/notes" className="text-gray-700 hover:text-primary font-medium transition text-sm">
              Notes
            </Link>

            <Link to="/past-papers" className="text-gray-700 hover:text-primary font-medium transition text-sm">
              Past Papers
            </Link>

            {/* Entrance Exams Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsExamsOpen(true)}
              onMouseLeave={() => setIsExamsOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-primary font-medium transition flex items-center text-sm"
              >
                Entrance Exams ▼
              </button>
              <div
                className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out"
              >
                {exams.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">No exams</div>
                ) : (
                  exams.map((e) => (
                    <Link 
                      key={e._id} 
                      to={`/entrance-exams?examId=${e._id}`} 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition"
                    >
                      {e.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link to="/study-tips" className="text-gray-700 hover:text-primary font-medium transition text-sm">
              Study Tips
            </Link>

            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition text-sm">
              Contact
            </Link>

            <Link to="/admin" className="text-gray-700 hover:text-primary font-medium transition text-sm">
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-700 text-2xl hover:text-primary transition"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4 flex">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-blue-700 transition">
            🔍
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <Link 
              to="/" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Classes Dropdown */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => setIsClassesOpen(!isClassesOpen)}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition font-medium flex items-center justify-between text-sm"
              >
                Classes
                <span className={`transform transition-transform ${isClassesOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isClassesOpen && (
                <div className="bg-gray-50">
                  {classes.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No classes</div>
                  ) : (
                    classes.map((c) => (
                      <Link 
                        key={c._id} 
                        to={`/classes/${c._id}`} 
                        className="block px-8 py-3 text-gray-700 hover:bg-blue-100 hover:text-primary transition text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {c.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link 
              to="/notes" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition text-sm border-t border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Notes
            </Link>

            <Link 
              to="/past-papers" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition text-sm border-t border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Past Papers
            </Link>

            {/* Mobile Entrance Exams Dropdown */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => setIsExamsOpen(!isExamsOpen)}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition font-medium flex items-center justify-between text-sm"
              >
                Entrance Exams
                <span className={`transform transition-transform ${isExamsOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isExamsOpen && (
                <div className="bg-gray-50">
                  {exams.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No exams</div>
                  ) : (
                    exams.map((e) => (
                      <Link 
                        key={e._id} 
                        to={`/entrance-exams?examId=${e._id}`} 
                        className="block px-8 py-3 text-gray-700 hover:bg-blue-100 hover:text-primary transition text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {e.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link 
              to="/study-tips" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition text-sm border-t border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Study Tips
            </Link>

            <Link 
              to="/contact" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition text-sm border-t border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <Link 
              to="/admin" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition text-sm border-t border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
