import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { getClasses, getEntranceExams, getNotes } from '../api';

/**
 * Home Page - Main landing page
 * Optimized with improved error handling and consolidated data fetching.
 */
const Home = () => {
  const [classes, setClasses] = useState([]);
  const [popularSections, setPopularSections] = useState([]);
  const [stats, setStats] = useState({ classes: 0, notes: 0, students: 1250 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [classesRes, examsRes, notesRes] = await Promise.allSettled([
          getClasses(),
          getEntranceExams(),
          getNotes()
        ]);

        // Safely extract results
        const classData = classesRes.status === 'fulfilled' ? (classesRes.value?.data || []) : [];
        const examData = examsRes.status === 'fulfilled' ? (examsRes.value?.data || []) : [];
        const notesData = notesRes.status === 'fulfilled' ? (notesRes.value?.data || []) : [];

        setClasses(classData);

        // Check for existence of past papers safely
        const hasPastPapers = notesData.some(n => 
          n.documentTypeId?.name?.toLowerCase().includes('past')
        );

        // Update stats
        setStats(prev => ({
          ...prev,
          classes: classData.length,
          notes: notesData.length
        }));

        // Build popular sections array
        const secs = [];
        
        // Add Classes
        classData.slice(0, 4).forEach(cls => {
          secs.push({ 
            title: `${cls.name} Notes`, 
            icon: '📘', 
            description: `Complete notes for ${cls.name}`, 
            link: `/classes/${cls._id}`, 
            color: 'from-blue-500 to-indigo-600' 
          });
        });

        // Add Exams
        examData.slice(0, 2).forEach(ex => {
          secs.push({ 
            title: `${ex.name} Prep`, 
            icon: '🎓', 
            description: `Materials for ${ex.name}`, 
            link: `/entrance-exams?examId=${ex._id}`, 
            color: 'from-purple-500 to-pink-600' 
          });
        });

        // Add Past Papers if they exist
        if (hasPastPapers) {
          secs.push({ 
            title: 'Past Papers', 
            icon: '📄', 
            description: 'Solved past papers', 
            link: '/past-papers', 
            color: 'from-green-500 to-teal-600' 
          });
        }

        setPopularSections(secs);
      } catch (error) {
        console.error("Error in home data fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white relative overflow-hidden animate-gradient">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="transform hover:scale-110 transition-all duration-500">
              <div className="text-6xl font-extrabold mb-3 text-yellow-300 drop-shadow-2xl">{stats.classes}+</div>
              <div className="text-2xl font-bold opacity-95">Classes Available</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-500">
              <div className="text-6xl font-extrabold mb-3 text-yellow-300 drop-shadow-2xl">{stats.notes}+</div>
              <div className="text-2xl font-bold opacity-95">Study Materials</div>
            </div>
            <div className="transform hover:scale-110 transition-all duration-500">
              <div className="text-6xl font-extrabold mb-3 text-yellow-300 drop-shadow-2xl">{stats.students}+</div>
              <div className="text-2xl font-bold opacity-95">Happy Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Study Sections */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary rounded-full text-sm font-bold mb-6 border-2 border-primary/20">
              📚 EXPLORE MATERIALS
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Popular Study Resources
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularSections.map((section, index) => (
              <Link
                key={index}
                to={section.link}
                className="group relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-primary overflow-hidden transform hover:-translate-y-4"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${section.color} opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-125 transition-all duration-500">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{section.title}</h3>
                  <p className="text-gray-600 mb-6">{section.description}</p>
                  <div className="flex items-center text-primary font-bold">
                    <span>Explore Now</span>
                    <span className="ml-2 group-hover:ml-4 transition-all text-2xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 via-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Select Your Class
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {classes.map((cls) => (
              <Link
                key={cls._id}
                to={`/classes/${cls._id}`}
                className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-transparent hover:border-primary"
              >
                <div className="bg-gradient-to-br from-primary/20 to-blue-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-all">
                  <span className="text-5xl">🎒</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{cls.name}</h3>
                <div className="text-primary font-bold">View Resources →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-10 rounded-3xl bg-yellow-50 border-2 border-yellow-100 hover:border-yellow-400 transition-all">
              <span className="text-6xl block mb-6">✨</span>
              <h3 className="text-2xl font-bold mb-4">High Quality</h3>
              <p className="text-gray-600">Expert-verified notes and handwritten solutions.</p>
            </div>
            <div className="text-center p-10 rounded-3xl bg-green-50 border-2 border-green-100 hover:border-green-400 transition-all">
              <span className="text-6xl block mb-6">🆓</span>
              <h3 className="text-2xl font-bold mb-4">100% Free</h3>
              <p className="text-gray-600">Quality education accessible to everyone at no cost.</p>
            </div>
            <div className="text-center p-10 rounded-3xl bg-blue-50 border-2 border-blue-100 hover:border-blue-400 transition-all">
              <span className="text-6xl block mb-6">📱</span>
              <h3 className="text-2xl font-bold mb-4">Mobile Friendly</h3>
              <p className="text-gray-600">Study anywhere, anytime on any device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold mb-8">Ready to Start Learning?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/notes" className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl">
              Browse Notes
            </Link>
            <Link to="/past-papers" className="px-10 py-5 border-4 border-white text-white rounded-2xl font-bold text-xl">
              Past Papers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;