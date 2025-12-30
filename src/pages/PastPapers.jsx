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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📄 Past Papers Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download and practice with past examination papers from previous years. 
            All papers include solutions and marking schemes.
          </p>
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
                <div key={note._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-primary">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h3>
                  {note.chapterId?.name && (
                    <p className="text-gray-600 text-sm mb-4">{note.chapterId.name}</p>
                  )}
                  {note.year && (
                    <p className="text-xs text-blue-600 font-semibold mb-4">Year: {note.year}</p>
                  )}
                  <div className="flex gap-2 mt-6">
                    {href ? (
                      <>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm text-center"
                          title="Open PDF in new tab"
                        >
                          👁️ View
                        </a>
                        <a
                          href={href}
                          download
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm text-center"
                          title="Download PDF"
                        >
                          📥 Download
                        </a>
                      </>
                    ) : (
                      <span className="w-full px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm text-center">No PDF</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sample Papers Section */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Years
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {years.length === 0 ? (
              <div className="col-span-6 text-center text-gray-500">No years available</div>
            ) : (
              years.map((year) => (
                <div
                  key={year}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 text-center border-2 border-blue-200 hover:border-primary transition cursor-pointer"
                >
                  <div className="text-2xl font-bold text-primary">{year}</div>
                  <div className="text-xs text-gray-600 mt-1">Available</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-lg mb-2">Solved Papers</h3>
            <p className="text-gray-600 text-sm">Complete solutions with explanations</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📥</div>
            <h3 className="font-bold text-lg mb-2">Downloadable PDFs</h3>
            <p className="text-gray-600 text-sm">Download and study offline</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Board Specific</h3>
            <p className="text-gray-600 text-sm">Papers from all major boards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastPapers;
