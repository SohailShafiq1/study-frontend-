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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/classes/${classId}`} className="hover:text-primary">
            {classId.toUpperCase()} Class
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{subjectName}</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {classId.toUpperCase()} Class {subjectName}
          </h1>
          <p className="text-xl text-gray-600">
            Complete chapter-wise notes, MCQs, and study material
          </p>
        </div>

        {/* Chapters List */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📑 Chapters
          </h2>
          <div className="space-y-4">
                {chapters.map((chapter) => {
                  const chapterId = chapter._id || chapter.id;
                  const chapterNotes = notes.filter((n) => {
                    const nCid = n.chapterId ? (n.chapterId._id || n.chapterId) : null;
                    return nCid === chapterId;
                  });
                  return (
                    <div
                      key={chapterId}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition border-l-4 border-primary"
                    >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {chapter.name}
                    </h3>
                    {chapterNotes.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {chapterNotes.map((note) => {
                          const noteId = note._id || note.id;
                          const pdf = note.pdfUrl || note.path || note.fileUrl || null;
                          return (
                            <div key={noteId} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200 hover:border-primary hover:bg-blue-50 transition">
                              <span className="font-medium text-gray-900">{note.title}</span>
                                  {pdf ? (
                                    (() => {
                                      const resolved = pdf.startsWith('http') ? pdf : `${BACKEND_ORIGIN}${pdf}`;
                                      return (
                                        <div className="flex gap-2">
                                          <a
                                            href={resolved}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                                            title="Open PDF in new tab"
                                          >
                                            👁️ View
                                          </a>
                                          <a
                                            href={resolved}
                                            download
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                                            title="Download PDF"
                                          >
                                            📥 Download
                                          </a>
                                        </div>
                                      );
                                    })()
                                  ) : (
                                <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">No PDF</span>
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📥</div>
            <h3 className="font-bold text-lg mb-2">Download All Notes</h3>
            <button className="mt-2 text-primary font-semibold hover:underline">
              Download PDF
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-bold text-lg mb-2">Past Papers</h3>
            <Link to={`/past-papers/${classId}`} className="mt-2 text-primary font-semibold hover:underline block">
              View Papers
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Practice Tests</h3>
            <Link to={`/mcqs/${classId}`} className="mt-2 text-primary font-semibold hover:underline block">
              Start Practice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
