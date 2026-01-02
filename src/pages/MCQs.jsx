import React, { useState } from 'react';
import Card from '../components/Card';
import MCQItem from '../components/MCQItem';

/**
 * MCQs Page - Multiple Choice Questions Bank
 */
const MCQs = () => {
  const mcqCategories = [
    { title: '9th Class MCQs', icon: '📝', description: 'Practice MCQs for all subjects', link: '/mcqs/9th' },
    { title: '10th Class MCQs', icon: '✍️', description: 'Matric exam MCQs', link: '/mcqs/10th' },
    { title: '11th Class MCQs', icon: '📋', description: 'FSc Part 1 MCQs', link: '/mcqs/11th' },
    { title: '12th Class MCQs', icon: '📄', description: 'FSc Part 2 MCQs', link: '/mcqs/12th' },
    { title: 'MDCAT MCQs', icon: '🎓', description: '5000+ MDCAT questions', link: '/mcqs/mdcat' },
    { title: 'NUMS MCQs', icon: '⚕️', description: 'NUMS practice questions', link: '/mcqs/nums' },
  ];

  // Sample MCQs for demonstration
  const sampleMCQs = [
    {
      question: "What is the powerhouse of the cell?",
      options: {
        A: "Nucleus",
        B: "Mitochondria",
        C: "Ribosome",
        D: "Golgi apparatus"
      },
      correctAnswer: "B",
      explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration, which provides energy for cellular activities."
    },
    {
      question: "Which of the following is NOT a renewable energy source?",
      options: {
        A: "Solar power",
        B: "Wind energy",
        C: "Coal",
        D: "Hydroelectric power"
      },
      correctAnswer: "C",
      explanation: "Coal is a fossil fuel and is non-renewable. It takes millions of years to form and cannot be replenished within a human lifetime."
    },
    {
      question: "What is the chemical formula for water?",
      options: {
        A: "H2O2",
        B: "H2O",
        C: "HO2",
        D: "H3O"
      },
      correctAnswer: "B",
      explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom, represented by the chemical formula H2O."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-12 mb-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-4">
              🎯 Practice & Test
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              MCQs Bank
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Practice with thousands of multiple choice questions. 
              Test your knowledge and prepare for exams with detailed explanations.
            </p>
          </div>
        </div>

        {/* MCQs Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {mcqCategories.map((category, index) => (
            <Card
              key={index}
              title={category.title}
              description={category.description}
              icon={category.icon}
              link={category.link}
            />
          ))}
        </div>

        {/* Sample MCQs Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6 text-center">
            🎯 Sample MCQs
          </h2>
          <p className="text-gray-700 text-lg mb-8 text-center max-w-3xl mx-auto">
            Try these sample questions to see how our MCQs work. Click on an option to reveal the answer.
          </p>

          {sampleMCQs.map((mcq, index) => (
            <MCQItem key={index} mcq={mcq} index={index} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border-2 border-green-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">5000+</div>
            <p className="text-gray-700 font-semibold text-lg">Total MCQs</p>
          </div>
          <div className="group bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border-2 border-blue-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">100%</div>
            <p className="text-gray-700 font-semibold text-lg">Verified Answers</p>
          </div>
          <div className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-xl hover:shadow-2xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">50+</div>
            <p className="text-gray-700 font-semibold text-lg">Topics Covered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQs;
