import React, { useEffect, useState } from 'react';

/**
 * CursorFollower Component - Custom cursor with notes icon that follows mouse movement
 */
const CursorFollower = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot with notes icon */}
      <div
        className="fixed pointer-events-none z-[99999] transition-transform duration-150 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isHovering 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/60' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl shadow-blue-500/60'
        }`}>
          <span className="text-white text-lg font-bold">📝</span>
        </div>
      </div>

      {/* Trailing effect - larger glow */}
      <div
        className="fixed pointer-events-none z-[99998] transition-all duration-500 ease-out opacity-40"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl"></div>
      </div>
    </>
  );
};

export default CursorFollower;
