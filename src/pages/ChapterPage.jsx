import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import MCQItem from '../components/MCQItem';
import Button from '../components/Button';

/**
 * ChapterPage Component - Individual chapter notes page
 * Shows: PDF viewer, written notes, MCQs, navigation
 */
const ChapterPage = () => {
  const { classId, subjectId, chapterId } = useParams();

  // Extract chapter number from chapterId (e.g., "chapter-1" -> "1")
  const chapterNumber = chapterId.split('-')[1];

  // Sample chapter data (would come from API/database in real app)
  const chapterData = {
    title: `Chapter ${chapterNumber}: Introduction to Subject`,
    introduction: "This chapter covers the fundamental concepts and introduces key topics that will be explored in detail throughout the course.",
    content: `
      <h2>1. Overview</h2>
      <p>In this chapter, we will explore the basic concepts that form the foundation of this subject. Understanding these fundamentals is crucial for mastering advanced topics.</p>
      
      <h2>2. Key Concepts</h2>
      <ul>
        <li><strong>Concept 1:</strong> Detailed explanation of the first major concept</li>
        <li><strong>Concept 2:</strong> Understanding the second important principle</li>
        <li><strong>Concept 3:</strong> Application of theoretical knowledge</li>
      </ul>
      
      <h2>3. Important Definitions</h2>
      <p><strong>Definition 1:</strong> A precise explanation of key terminology</p>
      <p><strong>Definition 2:</strong> Another crucial definition to remember</p>
      
      <h2>4. Examples</h2>
      <p>Let's look at some practical examples to better understand these concepts:</p>
      <p><em>Example 1:</em> Detailed walkthrough of a practical application</p>
      
      <h2>5. Summary</h2>
      <p>This chapter introduced the fundamental concepts necessary for understanding advanced topics. Make sure to review all definitions and practice the examples provided.</p>
      
      <h2>6. Key Points to Remember</h2>
      <ul>
        <li>Point 1: Important fact to memorize</li>
        <li>Point 2: Critical concept for exams</li>
        <li>Point 3: Practical application tip</li>
      </ul>
    `,
    pdfUrl: '/sample-notes.pdf', // Sample PDF URL
  };

  // Sample MCQs for this chapter
  const chapterMCQs = [
    {
      question: "What is the main focus of this chapter?",
      options: {
        A: "Advanced applications",
        B: "Fundamental concepts",
        C: "Historical background",
        D: "Future predictions"
      },
      correctAnswer: "B",
      explanation: "This chapter focuses on fundamental concepts that form the foundation for understanding more complex topics."
    },
    {
      question: "Which concept is most important for understanding the basics?",
      options: {
        A: "Concept 1",
        B: "Concept 2",
        C: "All concepts are equally important",
        D: "None of the above"
      },
      correctAnswer: "C",
      explanation: "All fundamental concepts work together to provide a comprehensive understanding of the subject."
    },
  ];

  // Navigation functions
  const prevChapter = parseInt(chapterNumber) > 1 ? parseInt(chapterNumber) - 1 : null;
  const nextChapter = parseInt(chapterNumber) < 6 ? parseInt(chapterNumber) + 1 : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-base text-gray-700 max-w-6xl mx-auto font-bold animate-fadeInDown">
          <Link to="/" className="hover:text-purple-600 transition-colors duration-300">Home</Link>
          <span className="mx-3 text-xl">→</span>
          <Link to={`/classes/${classId}`} className="hover:text-purple-600 transition-colors duration-300">
            {classId.toUpperCase()} Class
          </Link>
          <span className="mx-3 text-xl">→</span>
          <Link to={`/classes/${classId}/${subjectId}`} className="hover:text-purple-600 transition-colors duration-300 capitalize">
            {subjectId.replace('-', ' ')}
          </Link>
          <span className="mx-3 text-xl">→</span>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">Chapter {chapterNumber}</span>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Chapter Title */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-16 mb-10 overflow-hidden animate-gradient animate-scaleIn">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
            </div>
            <div className="relative z-10 text-center">
              <div className="inline-block glass backdrop-blur-xl px-6 py-3 rounded-full text-white text-sm font-bold mb-6 border border-white/30">
                📖 Chapter Content
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl">
                {chapterData.title}
              </h1>
              <p className="text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
                {chapterData.introduction}
              </p>
            </div>
          </div>

          {/* PDF Viewer */}
          <PDFViewer 
            pdfUrl={chapterData.pdfUrl}
            title={`${classId.toUpperCase()}-${subjectId}-Chapter-${chapterNumber}`}
          />

          {/* Written Notes Content */}
          <div className="glass backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl p-10 mb-10 border-2 border-white card-shine animate-fadeInUp">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 flex items-center gap-4">
              <span className="text-5xl">📝</span> Complete Notes
            </h2>
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: chapterData.content }}
            />
          </div>

          {/* MCQs Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-2xl p-10 mb-10 border-4 border-green-200 card-shine animate-fadeInUp delay-100">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-8 flex items-center gap-4">
              <span className="text-5xl">✍️</span> Practice MCQs
            </h2>
            {chapterMCQs.map((mcq, index) => (
              <MCQItem key={index} mcq={mcq} index={index} />
            ))}
          </div>

          {/* Related Notes */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl p-10 mb-8 border-2 border-blue-200 animate-fadeInUp delay-200">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              🔗 Related Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to={`/classes/${classId}/${subjectId}`} className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 card-shine border-2 border-blue-200 hover:border-blue-400">
                <div className="font-extrabold text-gray-900 text-xl mb-2">📚 All Chapters</div>
                <div className="text-base text-gray-600 font-semibold">View all chapters for this subject</div>
              </Link>
              <Link to={`/past-papers/${classId}`} className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 card-shine border-2 border-blue-200 hover:border-blue-400">
                <div className="font-extrabold text-gray-900 text-xl mb-2">📝 Past Papers</div>
                <div className="text-base text-gray-600 font-semibold">Practice with previous exams</div>
              </Link>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {prevChapter ? (
              <Link to={`/classes/${classId}/${subjectId}/chapter-${prevChapter}`}>
                <Button text={`← Previous Chapter`} variant="outline" />
              </Link>
            ) : (
              <div></div>
            )}

            {nextChapter ? (
              <Link to={`/classes/${classId}/${subjectId}/chapter-${nextChapter}`}>
                <Button text={`Next Chapter →`} variant="primary" />
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
