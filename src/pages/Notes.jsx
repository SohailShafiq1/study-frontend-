import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getClasses, getEntranceExams, getNotes } from '../api';

/**
 * Notes Page - Main notes landing page
 * Shows cards for all classes and entrance exams
 */
const Notes = () => {
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetch = async () => {
      try {
        const c = await getClasses();
        setClasses(Array.isArray(c.data) ? c.data : []);
      } catch (e) {
        console.error('Failed to load classes:', e);
      }
      try {
        const ex = await getEntranceExams();
        setExams(Array.isArray(ex.data) ? ex.data : []);
      } catch (e) {
        console.error('Failed to load exams:', e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery) {
        setIsSearching(true);
        try {
          const response = await getNotes({ search: searchQuery });
          setSearchResults(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
          console.error('Search failed:', e);
          setSearchResults([]);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    };
    performSearch();
  }, [searchQuery]);

  if (searchQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/notes" className="inline-flex items-center text-primary hover:text-blue-700 font-medium">
              ← Back to All Notes
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-xl text-gray-600">
              {isSearching ? 'Searching...' : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {!isSearching && searchResults.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">Try searching with different keywords</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((note) => (
              <div key={note._id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-primary/10 to-blue-100 p-3 rounded-xl">
                    <span className="text-3xl">📝</span>
                  </div>
                  {note.documentTypeId && (
                    <span className="px-3 py-1 bg-blue-100 text-primary text-xs font-semibold rounded-full">
                      {note.documentTypeId.name}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{note.description || 'Study material'}</p>
                {note.fileUrl && (
                  <div className="flex gap-3 mt-4">
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">👁️</span> View
                    </a>
                    <a
                      href={note.fileUrl}
                      download
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">📥</span> Download
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-yellow-300 mr-2">📚</span>
            <span className="font-semibold">Complete Study Materials</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Study Notes Library
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Access comprehensive notes for all classes and entrance exams. High-quality, exam-focused content to help you excel.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Classes Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-semibold mb-4">
              📖 BY CLASS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Class-wise Notes
            </h2>
            <p className="text-gray-600">Complete notes for all subjects</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {classes.map((cls, index) => (
              <Link
                key={cls._id}
                to={`/classes/${cls._id}`}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">📘</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    All Subjects Available
                  </p>
                  <div className="inline-flex items-center text-primary font-semibold text-sm">
                    <span>Browse Notes</span>
                    <span className="ml-2 group-hover:ml-3 transition-all">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Entrance Exams Section */}
        {exams.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
                🎓 ENTRANCE EXAMS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Entrance Exam Preparation
              </h2>
              <p className="text-gray-600">Specialized notes for medical and engineering entrance tests</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {exams.map((ex, index) => (
                <Link
                  key={ex._id}
                  to={`/entrance-exams?examId=${ex._id}`}
                  className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative text-center">
                    <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                      <span className="text-4xl">🎓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {ex.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Complete Preparation Material
                    </p>
                    <div className="inline-flex items-center text-purple-600 font-semibold text-sm">
                      <span>Start Preparing</span>
                      <span className="ml-2 group-hover:ml-3 transition-all">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            📖 Why Our Notes Stand Out
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '✅', text: 'Complete chapter-wise notes for all subjects' },
              { icon: '💡', text: 'Written in simple and easy-to-understand language' },
              { icon: '⭐', text: 'Includes important questions and key points' },
              { icon: '📄', text: 'Available in PDF format for download and printing' },
              { icon: '🔄', text: 'Regular updates with latest syllabus changes' },
              { icon: '🎯', text: 'Exam-focused content with practice questions' }
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl mr-4">{item.icon}</span>
                <p className="text-gray-700 pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Notes;
