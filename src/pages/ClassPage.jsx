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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-16 mb-16 overflow-hidden animate-gradient animate-fadeInDown">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl animate-pulse-slow delay-500"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-block glass backdrop-blur-xl px-6 py-3 rounded-full text-white text-sm font-bold mb-6 border border-white/30 animate-scaleIn">
              📚 Class Material
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl animate-fadeInUp">
              {currentClass.fullName}
            </h1>
            <p className="text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed animate-fadeInUp delay-100">
              Complete study material, notes, and resources for all subjects
            </p>
            <div className="mt-10 flex justify-center gap-6 flex-wrap animate-fadeInUp delay-200">
              <div className="glass backdrop-blur-xl px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl border border-white/30">
                📖 {subjects.length} Subjects
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {subjects.map((subject, index) => {
            const sid = subject._id || subject.id;
            return (
              <div key={sid} className="animate-scaleIn" style={{ animationDelay: `${index * 100}ms` }}>
                <SubjectCard
                  subject={subject.name}
                  icon="📖"
                  link={`/classes/${classId}/${sid}`}
                  description="Study materials and notes"
                />
              </div>
            );
          })}
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Link to={`/past-papers/${classId}`} className="group bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl shadow-2xl hover:shadow-glow-purple p-10 text-center transform hover:-translate-y-4 hover:scale-105 transition-all duration-500 card-shine animate-scaleIn">
            <div className="text-7xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float">📝</div>
            <h3 className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg">Past Papers</h3>
            <p className="text-white/95 text-lg leading-relaxed">Previous years exam papers with solutions</p>
          </Link>

          <Link to={`/mcqs/${classId}`} className="group bg-gradient-to-br from-green-500 via-teal-600 to-emerald-600 rounded-3xl shadow-2xl hover:shadow-glow-purple p-10 text-center transform hover:-translate-y-4 hover:scale-105 transition-all duration-500 card-shine animate-scaleIn delay-100">
            <div className="text-7xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float">✍️</div>
            <h3 className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg">MCQs Practice</h3>
            <p className="text-white/95 text-lg leading-relaxed">Multiple choice questions bank</p>
          </Link>

          <Link to="/study-tips" className="group bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl shadow-2xl hover:shadow-glow-purple p-10 text-center transform hover:-translate-y-4 hover:scale-105 transition-all duration-500 card-shine animate-scaleIn delay-200">
            <div className="text-7xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-float">💡</div>
            <h3 className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg">Study Tips</h3>
            <p className="text-white/95 text-lg leading-relaxed">How to prepare effectively for exams</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
