import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChapters, getNotes } from '../api';

// Backend origin for serving uploaded files (remove trailing /api from API base)
const BACKEND_API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';
const BACKEND_ORIGIN = BACKEND_API.replace(/\/api$/i, '').replace(/\/$/, '');

/**
 * SubjectPage Component - Shows chapters for a specific subject
 * Example: /classes/9th/biology
 */
const SubjectPage = () => {
  const { classId, subjectId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [subjectName, setSubjectName] = useState('Subject');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chapters
        const chaptersResponse = await getChapters();
        const chaptersArray = Array.isArray(chaptersResponse.data) ? chaptersResponse.data : [];
        const filteredChapters = chaptersArray.filter((chapter) => {
          const sid = chapter.subjectId ? (chapter.subjectId._id || chapter.subjectId) : null;
          return sid === subjectId;
        });
        setChapters(filteredChapters);

        // Fetch notes
        const notesResponse = await getNotes();
        const notesArray = Array.isArray(notesResponse.data) ? notesResponse.data : [];
        const filteredNotes = notesArray.filter((note) => {
          const nid = note.subjectId ? (note.subjectId._id || note.subjectId) : null;
          return nid === subjectId;
        });
        setNotes(filteredNotes);

        // Set subject name from the first note or chapter
        if (filteredChapters.length > 0) {
          setSubjectName(filteredChapters[0].subjectId.name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-base text-gray-700 font-semibold animate-fadeInDown">
          <Link to="/" className="hover:text-purple-600 transition-colors duration-300">Home</Link>
          <span className="mx-3 text-xl">➜</span>
          <Link to={`/classes/${classId}`} className="hover:text-purple-600 transition-colors duration-300">
            {classId.toUpperCase()} Class
          </Link>
          <span className="mx-3 text-xl">➜</span>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">{subjectName}</span>
        </div>

        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-16 mb-16 overflow-hidden animate-gradient animate-scaleIn">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="text-8xl mb-6 animate-bounce-slow">📖</div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
              {classId.toUpperCase()} Class {subjectName}
            </h1>
            <p className="text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              Complete chapter-wise notes, MCQs, and study material
            </p>
            <div className="mt-10 flex justify-center gap-6 flex-wrap">
              <div className="glass backdrop-blur-xl px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl border border-white/30 animate-scaleIn">
                📚 {chapters.length} Chapters
              </div>
              <div className="glass backdrop-blur-xl px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl border border-white/30 animate-scaleIn delay-100">
                📝 {notes.length} Notes
              </div>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-12 text-center animate-fadeInUp">
            📚 Chapter Wise Material
          </h2>
          <div className="space-y-8">
                {chapters.map((chapter, index) => {
                  const chapterId = chapter._id || chapter.id;
                  const chapterNotes = notes.filter((n) => {
                    const nCid = n.chapterId ? (n.chapterId._id || n.chapterId) : null;
                    return nCid === chapterId;
                  });
                  return (
                    <div
                      key={chapterId}
                      className="group glass backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl hover:shadow-glow-purple p-10 transition-all duration-500 border-l-8 border-gradient-to-b from-purple-500 to-pink-500 transform hover:-translate-y-3 hover:scale-[1.02] card-shine animate-fadeInUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      📖 {chapter.name}
                    </h3>
                    {chapterNotes.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {chapterNotes.map((note) => {
                          const noteId = note._id || note.id;
                          const pdf = note.pdfUrl || note.path || note.fileUrl || null;
                          return (
                            <div key={noteId} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
                              <span className="font-bold text-gray-900 text-lg">📝 {note.title}</span>
                                  {pdf ? (
                                    (() => {
                                      const resolved = pdf.startsWith('http') ? pdf : `${BACKEND_ORIGIN}${pdf}`;
                                      return (
                                        <div className="flex gap-3">
                                          <a
                                            href={resolved}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                                            title="Open PDF in new tab"
                                          >
                                            <span className="text-xl">👁️</span> View
                                          </a>
                                          <a
                                            href={resolved}
                                            download
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                                            title="Download PDF"
                                          >
                                            <span className="text-xl">📥</span> Download
                                          </a>
                                        </div>
                                      );
                                    })()
                                  ) : (
                                <span className="px-6 py-3 bg-gray-300 text-gray-600 rounded-xl font-bold">📄 No PDF</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {chapters.length === 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
                <p className="text-yellow-800 text-lg font-semibold">📁 No chapters available for this subject yet</p>
                <p className="text-yellow-700 text-sm mt-2">Please ask admin to add chapters for {subjectName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="group bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-3xl shadow-2xl hover:shadow-glow p-10 text-center transform hover:-translate-y-4 hover:scale-105 transition-all duration-500 border-4 border-blue-200 hover:border-blue-400 card-shine animate-scaleIn">
            <div className="text-7xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float">📥</div>
            <h3 className="font-extrabold text-2xl mb-4 text-blue-800">Download All Notes</h3>
            <button className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-extrabold shadow-2xl hover:shadow-glow transform hover:scale-110 transition-all duration-300 text-lg">
              📥 Download PDF
            </button>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 rounded-3xl shadow-2xl hover:shadow-glow p-10 text-center transform hover:-translate-y-4 hover:scale-105 transition-all duration-500 border-4 border-purple-200 hover:border-purple-400 card-shine animate-scaleIn delay-100">
            <div className="text-7xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float">📝</div>
            <h3 className="font-extrabold text-2xl mb-4 text-purple-800">Past Papers</h3>
            <Link to={`/past-papers/${classId}`} className="inline-block mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-extrabold shadow-2xl hover:shadow-glow transform hover:scale-110 transition-all duration-300 text-lg">
              📄 View Papers
            </Link>
          </div>

          <div className="group bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-3xl shadow-2xl hover:shadow-glow p-10 text-center transform hover:-translate-y-4 hover:scale-105 transition-all duration-500 border-4 border-green-200 hover:border-green-400 card-shine animate-scaleIn delay-200">
            <div className="text-7xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float">🎯</div>
            <h3 className="font-extrabold text-2xl mb-4 text-green-800">Practice Tests</h3>
            <Link to={`/mcqs/${classId}`} className="inline-block mt-6 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-extrabold shadow-2xl hover:shadow-glow transform hover:scale-110 transition-all duration-300 text-lg">
              ✍️ Start Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
