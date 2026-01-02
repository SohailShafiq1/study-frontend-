import React, { useEffect, useState } from 'react';
import { getNotes } from '../api';

// Backend origin for serving uploaded files
const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';
const BACKEND_ORIGIN = BACKEND_API.replace(/\/api$/i, '').replace(/\/$/, '');

/**
 * Past Papers Page - Archive of past examination papers
 */
const PastPapers = () => {
  const [pastNotes, setPastNotes] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNotes();
        const notes = Array.isArray(res.data) ? res.data : [];
        const past = notes.filter(n => {
          const typeName = n.documentTypeId?.name || '';
          return typeName.toLowerCase().includes('past') || (n.title || '').toLowerCase().includes('past');
        });
        setPastNotes(past);
        const yrs = Array.from(new Set(past.map(n => n.year).filter(Boolean))).sort((a,b)=>b-a);
        setYears(yrs);
      } catch (e) {
        console.error('Failed to load past papers from backend:', e);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-4">
              📚 Exam Archive
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Past Papers Collection
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Download and practice with past examination papers from previous years. 
              All papers include solutions and marking schemes.
            </p>
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {pastNotes.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 py-8">
              <p className="text-lg font-semibold">📁 No past papers found</p>
              <p className="text-sm mt-2">Please ask admin to upload past papers</p>
            </div>
          ) : (
            pastNotes.map(note => {
              const pdf = note.pdfUrl || note.path || null;
              const href = pdf ? (pdf.startsWith('http') ? pdf : `${BACKEND_ORIGIN}${pdf}`) : null;
              return (
                <div key={note._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-400 transform hover:-translate-y-2">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{note.title}</h3>
                  {note.chapterId?.name && (
                    <p className="text-gray-600 text-sm mb-2">{note.chapterId.name}</p>
                  )}
                  {note.year && (
                    <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">Year: {note.year}</div>
                  )}
                  <div className="flex gap-3 mt-6">
                    {href ? (
                      <>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                          title="Open PDF in new tab"
                        >
                          <span className="text-xl">👁️</span> View PDF
                        </a>
                        <a
                          href={href}
                          download
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                          title="Download PDF"
                        >
                          <span className="text-xl">📥</span> Download
                        </a>
                      </>
                    ) : (
                      <span className="w-full px-6 py-3 bg-gray-300 text-gray-600 rounded-xl text-center font-semibold">📄 No PDF Available</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sample Papers Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border-2 border-white">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            📅 Available Years
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {years.length === 0 ? (
              <div className="col-span-6 text-center text-gray-500 py-8">No years available</div>
            ) : (
              years.map((year) => (
                <div
                  key={year}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-5 text-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-110"
                >
                  <div className="text-3xl font-bold text-white">{year}</div>
                  <div className="text-xs text-white/90 mt-2">✓ Available</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border-2 border-green-200">
            <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">✅</div>
            <h3 className="font-bold text-xl mb-3 text-green-700">Solved Papers</h3>
            <p className="text-gray-700">Complete solutions with detailed explanations</p>
          </div>
          <div className="group bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border-2 border-blue-200">
            <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">📥</div>
            <h3 className="font-bold text-xl mb-3 text-blue-700">Downloadable PDFs</h3>
            <p className="text-gray-700">Download and study offline anytime</p>
          </div>
          <div className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-200">
            <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">🎯</div>
            <h3 className="font-bold text-xl mb-3 text-purple-700">Board Specific</h3>
            <p className="text-gray-700">Papers from all major boards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPapers;
