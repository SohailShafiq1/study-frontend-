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
    <header className="sticky top-0 z-50 glass-dark backdrop-blur-xl bg-white/80 shadow-xl border-b-2 border-gradient-to-r from-primary/20 to-purple-500/20 animate-fadeInDown">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <div className="bg-gradient-to-r from-primary to-blue-600 p-2.5 rounded-xl mr-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-glow animate-float">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Study With Maryam
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block font-semibold">🌟 Your Study Companion</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 group">
            <input
              type="text"
              placeholder="🔍 Search notes, past papers, chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all bg-white/90 backdrop-blur-sm group-hover:shadow-lg"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-r-xl hover:shadow-xl transition-all font-bold hover:scale-105 transform"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 text-sm relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Classes Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsClassesOpen(true)}
              onMouseLeave={() => setIsClassesOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 flex items-center text-sm relative group"
              >
                Classes ▼
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <div
                className="absolute top-full left-0 mt-2 w-52 glass backdrop-blur-xl bg-white/95 shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-2 border border-purple-100"
              >
                {classes.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">No classes</div>
                ) : (
                  classes.map((c) => (
                    <Link 
                      key={c._id} 
                      to={`/classes/${c._id}`} 
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-primary transition-all duration-300 font-medium rounded-xl mx-2"
                    >
                      📖 {c.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link to="/notes" className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 text-sm relative group">
              Notes
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link to="/past-papers" className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 text-sm relative group">
              Past Papers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Entrance Exams Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsExamsOpen(true)}
              onMouseLeave={() => setIsExamsOpen(false)}
            >
              <button
                className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 flex items-center text-sm relative group"
              >
                Entrance Exams ▼
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <div
                className="absolute top-full left-0 mt-2 w-52 glass backdrop-blur-xl bg-white/95 shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-2 border border-purple-100"
              >
                {exams.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">No exams</div>
                ) : (
                  exams.map((e) => (
                    <Link 
                      key={e._id} 
                      to={`/entrance-exams?examId=${e._id}`} 
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-primary transition-all duration-300 font-medium rounded-xl mx-2"
                    >
                      🎯 {e.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link to="/study-tips" className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 text-sm relative group">
              Study Tips
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link to="/contact" className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 text-sm relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-primary font-semibold transition-all duration-300 text-sm relative group">
                  Admin
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-5 py-2.5 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-bold transform hover:scale-105 animate-gradient">
                Admin Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-700 text-3xl hover:text-primary transition-all duration-300 transform hover:scale-110"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden mt-4 flex group">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white/90 backdrop-blur-sm group-hover:shadow-lg transition-all"
          />
          <button 
            type="submit"
            className="px-4 py-3 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-r-xl hover:shadow-xl transition-all font-bold"
          >
            Search
          </button>
        </form>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 glass backdrop-blur-xl rounded-2xl animate-fadeInDown">
            <Link 
              to="/" 
              className="block px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-primary transition-all duration-300 text-sm font-semibold rounded-xl mx-2 mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🏠 Home
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
