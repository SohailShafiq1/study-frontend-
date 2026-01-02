import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubjects } from '../api';
import SubjectCard from '../components/SubjectCard';

/**
 * ClassPage Component - Template for individual class pages (9th, 10th, 11th, 12th)
 * Displays subjects available for each class
 */
const ClassPage = () => {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects();
        const dataArray = Array.isArray(response.data) ? response.data : [];
        const filteredSubjects = dataArray.filter(subject => subject.classId._id === classId || subject.classId === classId);
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchSubjects();
  }, [classId]);

  // Class information
  const classInfo = {
    '9th': { title: '9th Class', fullName: 'Class 9 - Matric Part 1' },
    '10th': { title: '10th Class', fullName: 'Class 10 - Matric Part 2' },
    '11th': { title: '11th Class', fullName: '1st Year - FSc Part 1' },
    '12th': { title: '12th Class', fullName: '2nd Year - FSc Part 2' },
  };

  const currentClass = classInfo[classId] || { title: 'Class', fullName: 'Class' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 mb-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-4">
              📚 Class Material
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {currentClass.fullName}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Complete study material, notes, and resources for all subjects
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold">
                📖 {subjects.length} Subjects
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {subjects.map((subject) => {
            const sid = subject._id || subject.id;
            return (
              <SubjectCard
                key={sid}
                subject={subject.name}
                icon="📖"
                link={`/classes/${classId}/${sid}`}
                description="Study materials and notes"
              />
            );
          })}
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link to={`/past-papers/${classId}`} className="group bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Past Papers</h3>
            <p className="text-white/90">Previous years exam papers with solutions</p>
          </Link>

          <Link to={`/mcqs/${classId}`} className="group bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">✍️</div>
            <h3 className="text-2xl font-bold mb-3 text-white">MCQs Practice</h3>
            <p className="text-white/90">Multiple choice questions bank</p>
          </Link>

          <Link to="/study-tips" className="group bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💡</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Study Tips</h3>
            <p className="text-white/90">How to prepare effectively for exams</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
