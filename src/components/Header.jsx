import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClasses, getEntranceExams } from '../api';
import { useAuth } from '../context/AuthContext';

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
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-primary/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <div className="bg-gradient-to-r from-primary to-blue-600 p-2 rounded-lg mr-2 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Study With Maryam
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Your Study Companion</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="🔍 Search notes, past papers, chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
            />
            <button 
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-r-lg hover:shadow-lg transition-all font-medium"
            >
              Search
            </button>
          </form>

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

            {isAuthenticated ? (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-primary font-medium transition text-sm">
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Admin Login
              </Link>
            )}
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
        <form onSubmit={handleSearch} className="md:hidden mt-4 flex">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button 
            type="submit"
            className="px-4 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-r-lg hover:shadow-lg transition-all font-medium"
          >
            Search
          </button>
        </form>

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

            {isAuthenticated ? (
              <>
                <Link 
                  to="/admin" 
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition text-sm border-t border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition text-sm border-t border-gray-100 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-4 py-3 bg-primary text-white hover:bg-blue-700 transition text-sm border-t border-gray-100 font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
