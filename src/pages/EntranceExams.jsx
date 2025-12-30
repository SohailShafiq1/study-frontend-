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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎓 Entrance Exams
          </h1>
          <p className="text-xl text-gray-600">
            Download PDFs for various entrance exams
          </p>
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
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition border-l-4 border-primary"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {exam.name}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    {pdf ? (
                      <>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                          title="Open PDF in new tab"
                        >
                          👁️ View PDF
                        </a>
                        <a
                          href={href}
                          download
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                          title="Download PDF"
                        >
                          📥 Download
                        </a>
                      </>
                    ) : (
                      <span className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">No PDF</span>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
            
            {(!Array.isArray(exams) || exams.length === 0) && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
                <p className="text-yellow-800 text-lg font-semibold">📁 No entrance exams available yet</p>
                <p className="text-yellow-700 text-sm mt-2">Please ask admin to upload entrance exam PDFs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntranceExams;