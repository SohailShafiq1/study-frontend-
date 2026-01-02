import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Card Component - Reusable Card for various content types
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {string} icon - Emoji or icon
 * @param {string} link - Link URL
 * @param {string} bgColor - Background color class
 */
const Card = ({ title, description, icon, link, bgColor = 'bg-gradient-to-br from-white to-gray-50' }) => {
  return (
    <Link to={link} className="block group">
      <div className={`${bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 h-full border-2 border-gray-200 hover:border-primary transform hover:-translate-y-3 hover:scale-105 card-shine relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="text-5xl mb-5 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{icon}</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 group-hover:from-primary group-hover:to-purple-600 transition-all">{title}</h3>
        {description && (
          <p className="text-gray-600 text-base leading-relaxed">{description}</p>
        )}
      </div>
    </Link>
  );
};

export default Card;
