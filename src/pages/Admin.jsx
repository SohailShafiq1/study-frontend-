import React, { useState, useEffect, useRef } from 'react';
import {
  getClasses, createClass, deleteClass,
  getSubjects, createSubject, deleteSubject,
  getChapters, createChapter, deleteChapter,
  getNotes, uploadNote, deleteNote,
  getEntranceExams, uploadEntranceExam, deleteEntranceExam,
  getDocumentTypes, createDocumentType
} from '../api';

const Admin = () => {
  // UI States
  const [activeTab, setActiveTab] = useState('structure');
  const [expandedSection, setExpandedSection] = useState(null);

  // Data States
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [entranceExams, setEntranceExams] = useState([]);

  // Input States
  const [newClass, setNewClass] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [selectedClassForChapter, setSelectedClassForChapter] = useState('');
  const [selectedSubjectForChapter, setSelectedSubjectForChapter] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [pastTitle, setPastTitle] = useState('');
  const [pastPdfFile, setPastPdfFile] = useState(null);
  const [pastYear, setPastYear] = useState('');
  const pastFileInputRef = useRef(null);
  const [newExamName, setNewExamName] = useState('');
  const [examPdfFile, setExamPdfFile] = useState(null);

  // Refs for file inputs
  const noteFileInputRef = useRef(null);
  const examFileInputRef = useRef(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    fetchClasses();
    fetchSubjects();
    fetchChapters();
    fetchNotes();
    fetchEntranceExams();
    fetchDocumentTypes();
  };

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await getChapters();
      setChapters(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await getNotes();
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchEntranceExams = async () => {
    try {
      const response = await getEntranceExams();
      setEntranceExams(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching entrance exams:', error);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const res = await getDocumentTypes();
      setDocumentTypes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const addClass = async () => {
    if (newClass) {
      try {
        await createClass({ name: newClass });
        setNewClass('');
        fetchClasses();
      } catch (error) {
        console.error('Error adding class:', error);
      }
    }
  };

  const addSubject = async () => {
    if (newSubject && selectedClass) {
      try {
        await createSubject({ name: newSubject, classId: selectedClass });
        setNewSubject('');
        fetchSubjects();
      } catch (error) {
        console.error('Error adding subject:', error);
      }
    }
  };

  const addChapter = async () => {
    if (newChapter && selectedSubjectForChapter) {
      try {
        await createChapter({ name: newChapter, subjectId: selectedSubjectForChapter });
        setNewChapter('');
        fetchChapters();
      } catch (error) {
        console.error('Error adding chapter:', error);
      }
    }
  };

  const addNote = async () => {
    if (!selectedChapter || !pdfFile) {
      alert('Please select a chapter and a PDF file');
      return;
    }
    try {
      const chapter = chapters.find(c => c._id.toString() === selectedChapter.toString());
      if (!chapter) return;

      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('title', noteTitle || pdfFile.name);
      formData.append('chapterId', selectedChapter);
      
      // Handle both populated and unpopulated subjectId
      const subId = typeof chapter.subjectId === 'object' ? chapter.subjectId._id : chapter.subjectId;
      formData.append('subjectId', subId);

      await uploadNote(formData);
      alert('Note uploaded successfully!');
      setNoteTitle('');
      setPdfFile(null);
      if (noteFileInputRef.current) noteFileInputRef.current.value = '';
      fetchNotes();
    } catch (error) {
      console.error('Error uploading note:', error);
    }
  };

  const addEntranceExam = async () => {
    if (newExamName && examPdfFile) {
      try {
        const formData = new FormData();
        formData.append('pdf', examPdfFile);
        formData.append('name', newExamName);

        await uploadEntranceExam(formData);
        setNewExamName('');
        setExamPdfFile(null);
        if (examFileInputRef.current) examFileInputRef.current.value = '';
        fetchEntranceExams();
      } catch (error) {
        console.error('Error uploading entrance exam:', error);
      }
    }
  };

  const ensurePastDocType = async (chapterId) => {
    // look for existing document type named 'Past Paper' for this chapter
    try {
      const existing = documentTypes.find(dt => dt.name.toLowerCase() === 'past paper' && ((dt.chapterId?._id || dt.chapterId) === chapterId));
      if (existing) return existing._id;
      const res = await createDocumentType({ name: 'Past Paper', chapterId });
      // refresh document types
      fetchDocumentTypes();
      return res.data._id;
    } catch (error) {
      console.error('Error ensuring Past Paper document type:', error);
      throw error;
    }
  };

  const addPastPaper = async () => {
    if (!selectedChapter || !pastPdfFile) {
      alert('Select a chapter and choose a PDF for the past paper');
      return;
    }
    try {
      const chapter = chapters.find(c => c._id.toString() === selectedChapter.toString());
      if (!chapter) return;
      const subId = typeof chapter.subjectId === 'object' ? chapter.subjectId._id : chapter.subjectId;
      const docTypeId = await ensurePastDocType(selectedChapter);

      const formData = new FormData();
      formData.append('pdf', pastPdfFile);
      formData.append('title', pastTitle || pastPdfFile.name);
      formData.append('chapterId', selectedChapter);
      formData.append('subjectId', subId);
      formData.append('documentTypeId', docTypeId);
      if (pastYear) formData.append('year', pastYear);

      await uploadNote(formData);
      alert('Past paper uploaded successfully');
      setPastTitle('');
      setPastPdfFile(null);
      setPastYear('');
      if (pastFileInputRef.current) pastFileInputRef.current.value = '';
      fetchNotes();
    } catch (error) {
      console.error('Error adding past paper:', error);
      alert('Failed to upload past paper');
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await deleteClass(id);
      setClasses(prev => prev.filter(c => c._id !== id));
      // also remove related subjects/chapters/notes locally
      setSubjects(prev => prev.filter(s => (s.classId?._id || s.classId) !== id));
      setChapters(prev => prev.filter(ch => {
        const sid = typeof ch.subjectId === 'object' ? ch.subjectId._id : ch.subjectId;
        return subjects.findIndex(s => (s._id === sid && (s.classId?._id || s.classId) === id)) === -1;
      }));
      fetchAllData();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await deleteSubject(id);
      setSubjects(prev => prev.filter(s => s._id !== id));
      setChapters(prev => prev.filter(ch => (ch.subjectId?._id || ch.subjectId) !== id));
      fetchChapters();
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Failed to delete subject: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteChapter = async (id) => {
    if (!window.confirm('Delete this chapter?')) return;
    try {
      await deleteChapter(id);
      setChapters(prev => prev.filter(ch => ch._id !== id));
      setNotes(prev => prev.filter(n => n.chapterId !== id));
      fetchNotes();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Failed to delete chapter: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteEntranceExam = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    try {
      await deleteEntranceExam(id);
      setEntranceExams(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      console.error('Error deleting entrance exam:', error);
      alert('Failed to delete exam: ' + (error.response?.data?.message || error.message));
    }
  };

  // Get orphaned subjects (subjects without a class)
  const orphanedSubjects = subjects.filter(s => !s.classId);

  // Group chapters by subject to identify duplicates
  const chaptersBySubject = {};
  chapters.forEach(ch => {
    const subId = ch.subjectId?._id || ch.subjectId;
    if (!chaptersBySubject[subId]) chaptersBySubject[subId] = [];
    chaptersBySubject[subId].push(ch);
  });

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const tabs = [
    { id: 'structure', name: 'Academic Structure', icon: '🏗️', color: 'blue' },
    { id: 'content', name: 'Content Upload', icon: '📤', color: 'purple' },
    { id: 'exams', name: 'Entrance Exams', icon: '🎓', color: 'emerald' },
    { id: 'library', name: 'Library', icon: '📚', color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage academic structure and content with ease</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl shadow-lg">
              <span className="text-lg font-bold text-white">Study with Maryam</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{classes.length}</div>
              <div className="text-sm text-blue-600 font-medium mt-1">Classes</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-700">{subjects.length}</div>
              <div className="text-sm text-purple-600 font-medium mt-1">Subjects</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="text-3xl font-bold text-indigo-700">{chapters.length}</div>
              <div className="text-sm text-indigo-600 font-medium mt-1">Chapters</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
              <div className="text-3xl font-bold text-pink-700">{notes.length}</div>
              <div className="text-sm text-pink-600 font-medium mt-1">Total Notes</div>
            </div>
          </div>
        </div>

        {/* Cleanup Section - Show orphaned and duplicate data */}
        {(orphanedSubjects.length > 0) && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-orange-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">⚠️</span>
              Data Cleanup Needed
            </h2>
            
            {/* Orphaned Subjects */}
            {orphanedSubjects.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-orange-800 mb-3">
                  Orphaned Subjects ({orphanedSubjects.length}) - Not assigned to any class
                </h3>
                <div className="space-y-2">
                  {orphanedSubjects.map(sub => (
                    <div key={sub._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <div>
                        <span className="font-semibold text-gray-900">{sub.name}</span>
                        <span className="text-xs text-gray-500 ml-3 font-mono bg-gray-100 px-2 py-1 rounded">{sub._id.slice(-8)}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteSubject(sub._id)} 
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicate Chapters */}
            {Object.values(chaptersBySubject).some(chs => chs.length > 1) && (
              <div>
                <h3 className="font-bold text-orange-800 mb-3">
                  Duplicate Chapters - Subjects with multiple chapters with similar names
                </h3>
                <div className="space-y-4">
                  {Object.entries(chaptersBySubject).map(([subId, chs]) => {
                    if (chs.length <= 1) return null;
                    const subjectName = subjects.find(s => s._id === subId)?.name || 'Unknown';
                    return (
                      <div key={subId}>
                        <p className="font-medium text-gray-700 mb-2">{subjectName}</p>
                        <div className="space-y-2 ml-4">
                          {chs.map(ch => (
                            <div key={ch._id} className="flex items-center justify-between p-3 bg-white rounded border border-orange-200">
                              <div>
                                <span className="font-medium text-gray-900">{ch.name}</span>
                                <span className="text-xs text-gray-500 ml-2">(ID: {ch._id.slice(-8)})</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">
                                  {chapters.filter(c => c._id === ch._id).length === 1 ? 'Keep' : 'Review'}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleDeleteChapter(ch._id)} 
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-700 text-white shadow-lg scale-105`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {/* Add Class Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('addClass')}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-xl shadow-lg">
                    <span className="text-3xl">🏫</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Add New Class</h3>
                    <p className="text-sm text-gray-500">Create a new class level (e.g., Class 9, Class 10)</p>
                  </div>
                </div>
                <span className="text-2xl text-gray-400">
                  {expandedSection === 'addClass' ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedSection === 'addClass' && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      placeholder="e.g. Class 10"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button 
                      onClick={addClass} 
                      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                    >
                      ✨ Add
                    </button>
                  </div>
                  
                  {/* Existing Classes */}
                  {classes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-700 mb-3">Existing Classes ({classes.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {classes.map(cls => (
                          <div key={cls._id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <span className="font-semibold text-gray-800">{cls.name}</span>
                            <button 
                              onClick={() => handleDeleteClass(cls._id)} 
                              className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-all duration-200"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add Subject Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('addSubject')}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-xl shadow-lg">
                    <span className="text-3xl">📖</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Add New Subject</h3>
                    <p className="text-sm text-gray-500">Add subjects to classes (e.g., Biology, Chemistry)</p>
                  </div>
                </div>
                <span className="text-2xl text-gray-400">
                  {expandedSection === 'addSubject' ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedSection === 'addSubject' && (
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-t border-gray-200">
                  <div className="space-y-3">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 font-medium"
                    >
                      <option value="">🎯 Select Class First</option>
                      {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                    </select>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Subject Name (e.g., Biology)"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      />
                      <button 
                        onClick={addSubject} 
                        disabled={!selectedClass}
                        className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-purple-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                      >
                        ➕ Add
                      </button>
                    </div>
                  </div>
                  
                  {/* Subject Library */}
                  {subjects.length > 0 && (
                    <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
                      <h4 className="font-semibold text-gray-700">Subject Library ({subjects.length})</h4>
                      {classes.map(cls => {
                        const classSubjects = subjects.filter(s => (s.classId?._id || s.classId) === cls._id);
                        if (classSubjects.length === 0) return null;
                        return (
                          <div key={cls._id}>
                            <h5 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-2 bg-purple-100 px-3 py-2 rounded-lg">{cls.name}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                              {classSubjects.map(sub => (
                                <div key={sub._id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-purple-100 shadow-sm">
                                  <span className="font-medium text-gray-800">{sub.name}</span>
                                  <button 
                                    onClick={() => handleDeleteSubject(sub._id)} 
                                    className="text-red-500 text-sm hover:bg-red-100 px-2 py-1 rounded-lg"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add Chapter Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('addChapter')}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-4 rounded-xl shadow-lg">
                    <span className="text-3xl">📑</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Add New Chapter</h3>
                    <p className="text-sm text-gray-500">Add chapters to subjects</p>
                  </div>
                </div>
                <span className="text-2xl text-gray-400">
                  {expandedSection === 'addChapter' ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedSection === 'addChapter' && (
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-t border-gray-200">
                  <div className="space-y-3">
                    <select
                      value={selectedClassForChapter}
                      onChange={(e) => setSelectedClassForChapter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium"
                    >
                      <option value="">🎯 Select Class</option>
                      {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                    </select>
                    <select
                      value={selectedSubjectForChapter}
                      onChange={(e) => setSelectedSubjectForChapter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium"
                      disabled={!selectedClassForChapter}
                    >
                      <option value="">📚 Select Subject</option>
                      {subjects.filter(s => (s.classId?._id || s.classId) === selectedClassForChapter).map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newChapter}
                        onChange={(e) => setNewChapter(e.target.value)}
                        placeholder="Chapter Name"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                      <button 
                        onClick={addChapter} 
                        disabled={!selectedSubjectForChapter}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                      >
                        ➕ Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Upload Study Notes */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('uploadNotes')}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-xl shadow-lg">
                    <span className="text-3xl">📝</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Upload Study Notes</h3>
                    <p className="text-sm text-gray-500">Upload PDF notes for chapters</p>
                  </div>
                </div>
                <span className="text-2xl text-gray-400">
                  {expandedSection === 'uploadNotes' ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedSection === 'uploadNotes' && (
                <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-medium"
                    >
                      <option value="">📚 Select Subject</option>
                      {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                    </select>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-medium"
                      disabled={!selectedSubject}
                    >
                      <option value="">📑 Select Chapter</option>
                      {chapters.filter(ch => (ch.subjectId?._id || ch.subjectId) === selectedSubject).map(ch => (
                        <option key={ch._id} value={ch._id}>{ch.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Note Title (Optional)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-all duration-200 bg-white">
                      <input
                        type="file"
                        ref={noteFileInputRef}
                        accept="application/pdf"
                        onChange={(e) => setPdfFile(e.target.files[0])}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                      {pdfFile && (
                        <p className="mt-3 text-sm text-green-600 font-medium">✓ File selected: {pdfFile.name}</p>
                      )}
                    </div>
                    <button 
                      onClick={addNote} 
                      className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      🚀 Upload Note
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Past Papers */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('uploadPastPapers')}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl shadow-lg">
                    <span className="text-3xl">📄</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Upload Past Papers</h3>
                    <p className="text-sm text-gray-500">Upload previous years' examination papers</p>
                  </div>
                </div>
                <span className="text-2xl text-gray-400">
                  {expandedSection === 'uploadPastPapers' ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedSection === 'uploadPastPapers' && (
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <select
                      value={selectedSubject}
                      onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(''); }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 font-medium"
                    >
                      <option value="">📚 Select Subject</option>
                      {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                    </select>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 font-medium"
                      disabled={!selectedSubject}
                    >
                      <option value="">📑 Select Chapter</option>
                      {chapters.filter(ch => (ch.subjectId?._id || ch.subjectId) === selectedSubject).map(ch => (
                        <option key={ch._id} value={ch._id}>{ch.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={pastTitle}
                      onChange={(e) => setPastTitle(e.target.value)}
                      placeholder="Past Paper Title (e.g. MDCAT 2023 - Biology)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                    />
                    <input
                      type="text"
                      value={pastYear}
                      onChange={(e) => setPastYear(e.target.value)}
                      placeholder="Year (e.g. 2023)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-yellow-400 transition-all duration-200 bg-white">
                      <input
                        type="file"
                        ref={pastFileInputRef}
                        accept="application/pdf"
                        onChange={(e) => setPastPdfFile(e.target.files[0])}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                      />
                      {pastPdfFile && (
                        <p className="mt-3 text-sm text-green-600 font-medium">✓ File selected: {pastPdfFile.name}</p>
                      )}
                    </div>
                    <button 
                      onClick={addPastPaper} 
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      📤 Upload Past Paper
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-6">
            {/* Upload Entrance Exams */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection('uploadExams')}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-xl shadow-lg">
                    <span className="text-3xl">🎓</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Upload Entrance Exams</h3>
                    <p className="text-sm text-gray-500">Upload MDCAT, NUMS, and other entrance exam papers</p>
                  </div>
                </div>
                <span className="text-2xl text-gray-400">
                  {expandedSection === 'uploadExams' ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedSection === 'uploadExams' && (
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newExamName}
                      onChange={(e) => setNewExamName(e.target.value)}
                      placeholder="Exam Name (e.g. MDCAT 2024)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 transition-all duration-200 bg-white">
                      <input
                        type="file"
                        ref={examFileInputRef}
                        accept="application/pdf"
                        onChange={(e) => setExamPdfFile(e.target.files[0])}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      {examPdfFile && (
                        <p className="mt-3 text-sm text-green-600 font-medium">✓ File selected: {examPdfFile.name}</p>
                      )}
                    </div>
                    <button 
                      onClick={addEntranceExam} 
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      ✅ Upload Entrance Exam
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Entrance Exams List */}
            {entranceExams.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  Uploaded Entrance Exams
                  <span className="ml-auto bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-sm font-bold px-3 py-1 rounded-full">{entranceExams.length}</span>
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {entranceExams.map(exam => (
                    <div key={exam._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{exam.name}</p>
                        <p className="text-xs text-gray-600">Uploaded entrance exam</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteEntranceExam(exam._id)} 
                        className="text-red-600 font-medium hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Notes Library */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                All Uploaded Notes
                <span className="ml-auto bg-gradient-to-r from-pink-500 to-pink-700 text-white text-sm font-bold px-3 py-1 rounded-full">{notes.length}</span>
              </h3>
              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-3">📭</p>
                  <p>No notes uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {notes.map(note => {
                    const chapter = chapters.find(ch => ch._id.toString() === note.chapterId?.toString());
                    return (
                      <div key={note._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-lg">{note.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            📑 {chapter?.name || 'Chapter Unknown'}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteNote(note._id)} 
                          className="text-red-600 font-medium hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ display: 'none' }}>
          {/* Left Column: Structure Management */}
          <div className="space-y-8">
            {/* Add Class Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl mr-3 text-2xl shadow-lg">🏫</span>
                Add New Class
              </h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  placeholder="e.g. Class 10"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button onClick={addClass} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg">
                  ✨ Add Class
                </button>
              </div>
            </div>

            {/* List Classes Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Existing Classes
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {classes.map(cls => (
                  <div key={cls._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                    <span className="font-semibold text-gray-800">{cls.name}</span>
                    <button 
                      onClick={() => handleDeleteClass(cls._id)} 
                      className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Subject Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-xl mr-3 text-2xl shadow-lg">📖</span>
                Add Subject
              </h2>
              <div className="space-y-3">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 font-medium"
                >
                  <option value="">🎯 Select Class</option>
                  {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                </select>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Subject Name"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  />
                  <button 
                    onClick={addSubject} 
                    disabled={!selectedClass} 
                    className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-purple-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    ➕ Add
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Management View */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Subject Library
              </h2>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {classes.map(cls => (
                  <div key={cls._id} className="mb-4">
                    <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wider mb-2 bg-purple-50 px-3 py-2 rounded-lg">{cls.name}</h3>
                    <div className="space-y-2 ml-2">
                      {subjects.filter(s => (s.classId?._id || s.classId) === cls._id).map(sub => (
                        <div key={sub._id} className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
                          <span className="font-medium text-gray-800">{sub.name}</span>
                          <button 
                            onClick={() => handleDeleteSubject(sub._id)} 
                            className="text-red-500 text-sm font-medium hover:bg-red-100 px-3 py-1 rounded-lg transition-all duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Content Management */}
          <div className="space-y-8">
            {/* Add Chapter Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-3 rounded-xl mr-3 text-2xl shadow-lg">📑</span>
                Add Chapter
              </h2>
              <div className="space-y-3">
                <select
                  value={selectedClassForChapter}
                  onChange={(e) => setSelectedClassForChapter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium"
                >
                  <option value="">🎯 Select Class</option>
                  {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                </select>
                <select
                  value={selectedSubjectForChapter}
                  onChange={(e) => setSelectedSubjectForChapter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium"
                  disabled={!selectedClassForChapter}
                >
                  <option value="">📚 Select Subject</option>
                  {subjects.filter(s => (s.classId?._id || s.classId) === selectedClassForChapter).map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    placeholder="Chapter Name"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                  <button 
                    onClick={addChapter} 
                    disabled={!selectedSubjectForChapter} 
                    className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    ➕ Add
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Notes Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-br from-red-400 to-red-600 p-3 rounded-xl mr-3 text-2xl shadow-lg">📝</span>
                Upload Study Note (PDF)
              </h2>
              <div className="space-y-4">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-medium"
                >
                  <option value="">📚 Select Subject</option>
                  {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-medium"
                  disabled={!selectedSubject}
                >
                  <option value="">📑 Select Chapter</option>
                  {chapters.filter(ch => (ch.subjectId?._id || ch.subjectId) === selectedSubject).map(ch => (
                    <option key={ch._id} value={ch._id}>{ch.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note Title (Optional)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-red-400 transition-all duration-200">
                  <input
                    type="file"
                    ref={noteFileInputRef}
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                </div>
                <button 
                  onClick={addNote} 
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  🚀 Upload Note
                </button>
              </div>
            </div>

            {/* Notes Library List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Current Notes
                <span className="ml-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">{notes.length}</span>
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notes.map(note => {
                  const chapter = chapters.find(ch => ch._id.toString() === note.chapterId?.toString());
                  return (
                    <div key={note._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-lg">{note.title}</p>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mt-1 font-medium">
                          📖 {chapter?.name || 'Chapter Unknown'}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteNote(note._id)} 
                        className="text-red-600 font-medium hover:bg-red-100 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Entrance Exams Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-xl mr-3 text-2xl shadow-lg">🎓</span>
                Entrance Exams
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  placeholder="Exam Name (e.g. MDCAT 2024)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-emerald-400 transition-all duration-200">
                  <input
                    type="file"
                    ref={examFileInputRef}
                    accept="application/pdf"
                    onChange={(e) => setExamPdfFile(e.target.files[0])}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                <button 
                  onClick={addEntranceExam} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ✅ Upload Entrance Exam
                </button>
              </div>
            </div>

            {/* Past Papers Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl mr-3 text-2xl shadow-lg">📄</span>
                Upload Past Paper
              </h2>
              <div className="space-y-4">
                <select
                  value={selectedSubject}
                  onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(''); }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 font-medium"
                >
                  <option value="">📚 Select Subject</option>
                  {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 font-medium"
                  disabled={!selectedSubject}
                >
                  <option value="">📑 Select Chapter</option>
                  {chapters.filter(ch => (ch.subjectId?._id || ch.subjectId) === selectedSubject).map(ch => (
                    <option key={ch._id} value={ch._id}>{ch.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={pastTitle}
                  onChange={(e) => setPastTitle(e.target.value)}
                  placeholder="Past Paper Title (e.g. MDCAT 2023 - Biology)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                />
                <input
                  type="text"
                  value={pastYear}
                  onChange={(e) => setPastYear(e.target.value)}
                  placeholder="Year (e.g. 2023)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-yellow-400 transition-all duration-200">
                  <input
                    type="file"
                    ref={pastFileInputRef}
                    accept="application/pdf"
                    onChange={(e) => setPastPdfFile(e.target.files[0])}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                  />
                </div>
                <button 
                  onClick={addPastPaper} 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  📤 Upload Past Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;