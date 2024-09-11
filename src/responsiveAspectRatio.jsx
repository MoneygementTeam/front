import React, { useState, useEffect } from 'react';

const ResponsiveAspectRatio = ({ ratio = 16 / 9, children, className = '' }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let width, height;

      if (viewportWidth / viewportHeight > ratio) {
        height = viewportHeight;
        width = height * ratio;
      } else {
        width = viewportWidth;
        height = width / ratio;
      }

      setDimensions({ width, height });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions(); // 초기 렌더링 시 실행

    return () => window.removeEventListener('resize', updateDimensions);
  }, [ratio]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
        className={`bg-white overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveAspectRatio;