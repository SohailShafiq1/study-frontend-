import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { getClasses, getEntranceExams } from '../api';

/**
 * HeroSection Component - Main banner section
 * Displays title, subtitle, and quick action buttons
 */
const HeroSection = () => {
  const [quickLinks, setQuickLinks] = useState([
    { text: '9th Class', link: '/classes/9th', emoji: '📗' },
    { text: '10th Class', link: '/classes/10th', emoji: '📘' },
    { text: '1st Year', link: '/classes/11th', emoji: '📙' },
    { text: '2nd Year', link: '/classes/12th', emoji: '📕' },
    { text: 'MDCAT', link: '/entrance-exams?examId=mdcat', emoji: '🎓' },
    { text: 'NUMS', link: '/entrance-exams?examId=nums', emoji: '🏥' },
  ]);

  useEffect(() => {
    const fetchQuickLinks = async () => {
      try {
        const [classesRes, examsRes] = await Promise.all([getClasses(), getEntranceExams()]);
        const classesData = Array.isArray(classesRes.data) ? classesRes.data : [];
        const examsData = Array.isArray(examsRes.data) ? examsRes.data : [];
        const classes = classesData.slice(0, 4).map((c, i) => ({ 
          text: c.name, 
          link: `/classes/${c._id}`,
          emoji: ['📗', '📘', '📙', '📕'][i] || '📖'
        }));
        const exams = examsData.slice(0, 2).map((e, i) => ({ 
          text: e.name, 
          link: `/entrance-exams?examId=${e._id}`,
          emoji: ['🎓', '🏥'][i] || '📚'
        }));
        const merged = [...classes, ...exams];
        if (merged.length) setQuickLinks(merged);
      } catch (err) {
        console.error('Failed to fetch quick links:', err);
      }
    };
    fetchQuickLinks();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-primary to-indigo-700 py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-yellow-300 mr-2">⭐</span>
            <span className="font-semibold">Pakistan's #1 Free Study Platform</span>
            <span className="text-yellow-300 ml-2">⭐</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-lg">
            Study With <span className="text-yellow-300">Maryam</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 opacity-95">
            Your Complete Study Companion 📚
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Free Notes • Past Papers • MCQs • Mock Tests • Entrance Exam Prep
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-10 mb-12">
            {quickLinks.map((item, index) => (
              <Link 
                key={index} 
                to={item.link}
                className="group relative px-6 py-3 bg-white hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-base shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">{item.emoji}</span>
                {item.text}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            {[
              { number: '1000+', label: 'Study Notes', icon: '📝' },
              { number: '500+', label: 'Past Papers', icon: '📄' },
              { number: '5000+', label: 'MCQs', icon: '✅' },
              { number: '10K+', label: 'Students', icon: '🎓' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
