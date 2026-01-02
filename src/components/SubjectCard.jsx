import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SubjectCard Component - Card for displaying subject information
 * @param {string} subject - Subject name
 * @param {string} icon - Subject icon/emoji
 * @param {string} link - Link to subject page
 * @param {string} description - Brief description
 */
const SubjectCard = ({ subject, icon, link, description }) => {
  return (
    <Link to={link} className="block group">
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-10 border-2 border-gradient-to-br from-blue-200 to-purple-200 hover:border-primary transform hover:-translate-y-4 hover:scale-105 card-shine overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="text-7xl mb-5 text-center transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 animate-float relative z-10">{icon}</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3 text-center relative z-10">{subject}</h3>
        {description && (
          <p className="text-gray-700 text-sm text-center mt-2 font-semibold relative z-10">{description}</p>
        )}
      </div>
    </Link>
  );
};

export default SubjectCard;
