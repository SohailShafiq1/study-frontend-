import React, { useState, useEffect } from 'react';
import { getEntranceExams } from '../api';

const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';
const BACKEND_ORIGIN = BACKEND_API.replace(/\/api$/i, '').replace(/\/$/, '');

const EntranceExams = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getEntranceExams();
        setExams(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching entrance exams:', error);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl shadow-2xl p-12 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-4">
              🎯 Medical & Engineering
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Entrance Exams
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Complete preparation material for MDCAT, NUMS, ECAT and other entrance exams
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
                📚 {exams.length} Available Exams
              </div>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {(Array.isArray(exams) ? exams : []).map((exam, idx) => {
              const id = (exam && (exam._id || exam.id)) || `exam-${idx}`;
              const pdf = exam ? (exam.pdfUrl || exam.path || null) : null;
              const href = pdf ? (pdf.startsWith('http') ? pdf : `${BACKEND_ORIGIN}${pdf}`) : '#';
              return (
              <div
                key={id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 border-l-8 border-gradient-to-b from-green-500 to-blue-500 transform hover:-translate-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">🎯</div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {exam.name}
                    </h3>
                  </div>
                  <div className="flex gap-4 mt-6">
                    {pdf ? (
                      <>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                          title="Open PDF in new tab"
                        >
                          <span className="text-2xl">👁️</span> View PDF
                        </a>
                        <a
                          href={href}
                          download
                          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                          title="Download PDF"
                        >
                          <span className="text-2xl">📥</span> Download
                        </a>
                      </>
                    ) : (
                      <span className="px-8 py-4 bg-gray-300 text-gray-600 rounded-xl font-bold">📄 No PDF Available</span>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
            
            {(!Array.isArray(exams) || exams.length === 0) && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border-4 border-yellow-300 rounded-2xl p-12 text-center shadow-xl">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-yellow-800 text-2xl font-bold mb-2">📁 No entrance exams available yet</p>
                <p className="text-yellow-700 text-lg">Please ask admin to upload entrance exam PDFs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntranceExams;