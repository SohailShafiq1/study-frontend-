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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl shadow-2xl p-16 mb-16 overflow-hidden animate-gradient animate-scaleIn">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-block glass backdrop-blur-xl px-6 py-3 rounded-full text-white text-sm font-bold mb-6 border border-white/30 animate-fadeInDown">
              🎯 Medical & Engineering
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl animate-fadeInUp">
              Entrance Exams
            </h1>
            <p className="text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed animate-fadeInUp delay-100">
              Complete preparation material for MDCAT, NUMS, ECAT and other entrance exams
            </p>
            <div className="mt-10 flex justify-center gap-6 flex-wrap animate-fadeInUp delay-200">
              <div className="glass backdrop-blur-xl px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl border border-white/30">
                📚 {exams.length} Available Exams
              </div>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {(Array.isArray(exams) ? exams : []).map((exam, idx) => {
              const id = (exam && (exam._id || exam.id)) || `exam-${idx}`;
              const pdf = exam ? (exam.pdfUrl || exam.path || null) : null;
              const href = pdf ? (pdf.startsWith('http') ? pdf : `${BACKEND_ORIGIN}${pdf}`) : '#';
              return (
              <div
                key={id}
                className="group glass backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl hover:shadow-glow-purple p-12 transition-all duration-500 border-l-8 border-gradient-to-b from-green-500 to-blue-500 transform hover:-translate-y-4 hover:scale-[1.02] card-shine animate-scaleIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex-1">
                    <div className="text-7xl mb-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float inline-block">🎯</div>
                    <h3 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                      {exam.name}
                    </h3>
                  </div>
                  <div className="flex gap-6 mt-6">
                    {pdf ? (
                      <>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-extrabold shadow-2xl hover:shadow-glow-purple transform hover:scale-110 flex items-center gap-3 text-lg"
                          title="Open PDF in new tab"
                        >
                          <span className="text-3xl">👁️</span> View PDF
                        </a>
                        <a
                          href={href}
                          download
                          className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-extrabold shadow-2xl hover:shadow-glow-purple transform hover:scale-110 flex items-center gap-3 text-lg"
                          title="Download PDF"
                        >
                          <span className="text-3xl">📥</span> Download
                        </a>
                      </>
                    ) : (
                      <span className="px-10 py-5 bg-gray-300 text-gray-600 rounded-2xl font-extrabold text-lg">📄 No PDF Available</span>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
            
            {(!Array.isArray(exams) || exams.length === 0) && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border-4 border-yellow-300 rounded-3xl p-16 text-center shadow-2xl animate-fadeInUp">
                <div className="text-8xl mb-6 animate-bounce-slow">📁</div>
                <p className="text-yellow-800 text-3xl font-extrabold mb-4">📁 No entrance exams available yet</p>
                <p className="text-yellow-700 text-xl font-semibold">Please ask admin to upload entrance exam PDFs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntranceExams;