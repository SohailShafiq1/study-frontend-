import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Card from '../components/Card';
import { getClasses, getEntranceExams, getNotes } from '../api';

/**
 * Home Page - Main landing page
 * Contains: Hero Section, Popular Study Sections, Classes Section
 */
const Home = () => {
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [notes, setNotes] = useState([]);
  const [hasPastPapers, setHasPastPapers] = useState(false);
  const [popularSections, setPopularSections] = useState([]);
  const [stats, setStats] = useState({ classes: 0, notes: 0, students: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const c = await getClasses();
        const classData = Array.isArray(c.data) ? c.data : [];
        setClasses(classData);
        setStats(prev => ({ ...prev, classes: classData.length }));
      } catch (e) {
        console.error('Failed to load classes:', e);
      }
      try {
        const ex = await getEntranceExams();
        setExams(Array.isArray(ex.data) ? ex.data : []);
      } catch (e) {
        console.error('Failed to load exams:', e);
      }
      try {
        const notesRes = await getNotes();
        const notesData = Array.isArray(notesRes.data) ? notesRes.data : [];
        setNotes(notesData);
        setStats(prev => ({ ...prev, notes: notesData.length, students: 1250 }));
        const found = notesData.some(n => {
          const name = n.documentTypeId ? (n.documentTypeId.name || '') : '';
          return name.toLowerCase().includes('past');
        });
        setHasPastPapers(Boolean(found));
      } catch (e) {
        console.error('Failed to load notes for past-papers check:', e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const secs = [];
    classes.slice(0, 4).forEach(cls => secs.push({ title: `${cls.name} Notes`, icon: '📘', description: `Complete notes for ${cls.name}`, link: `/classes/${cls._id}`, color: 'from-blue-500 to-indigo-600' }));
    exams.slice(0, 2).forEach(ex => secs.push({ title: `${ex.name} Prep`, icon: '🎓', description: `Materials for ${ex.name}`, link: `/entrance-exams?examId=${ex._id}`, color: 'from-purple-500 to-pink-600' }));
    if (hasPastPapers) {
      secs.push({ title: 'Past Papers', icon: '📄', description: 'Solved past papers', link: '/past-papers', color: 'from-green-500 to-teal-600' });
    }
    setPopularSections(secs);
  }, [classes, exams, hasPastPapers]);

  

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-2">{stats.classes}+</div>
              <div className="text-xl opacity-90">Classes Available</div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-2">{stats.notes}+</div>
              <div className="text-xl opacity-90">Study Materials</div>
            </div>
            <div className="transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-2">{stats.students}+</div>
              <div className="text-xl opacity-90">Happy Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Study Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              📚 EXPLORE MATERIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Study Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access comprehensive study material for all classes and entrance exams
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSections.map((section, index) => (
              <Link
                key={index}
                to={section.link}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {section.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold">
                    <span>Explore Now</span>
                    <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              🎒 CHOOSE YOUR LEVEL
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Select Your Class
            </h2>
            <p className="text-lg text-gray-600">
              Choose your class to access complete study material
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {classes.map((cls, index) => (
              <Link
                key={cls._id}
                to={`/classes/${cls._id}`}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Complete Study Material
                  </p>
                  <div className="inline-flex items-center text-primary font-semibold text-sm">
                    <span>View Resources</span>
                    <span className="ml-2 group-hover:ml-3 transition-all">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
              ✨ WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Study With Maryam?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-all duration-300">
              <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                <span className="text-5xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">High Quality Content</h3>
              <p className="text-gray-600 leading-relaxed">Expert-verified notes, handwritten solutions, and comprehensive study material crafted by educators</p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-xl transition-all duration-300">
              <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                <span className="text-5xl">🆓</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">100% Free</h3>
              <p className="text-gray-600 leading-relaxed">All resources available at absolutely no cost. Quality education should be accessible to everyone</p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
              <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform">
                <span className="text-5xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Mobile Friendly</h3>
              <p className="text-gray-600 leading-relaxed">Study anywhere, anytime on any device. Perfect responsive design for seamless learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who are achieving their academic goals with our free study materials
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/notes"
              className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Browse All Notes
            </Link>
            <Link
              to="/past-papers"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all"
            >
              View Past Papers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
