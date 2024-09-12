import React, { useState, useEffect } from 'react';

const MonsterCard = ({ monster, cardIndex }) => {
  const [hoverStyle, setHoverStyle] = useState('');
  const [transformStyle, setTransformStyle] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const [initialPosition, setInitialPosition] = useState({ top: 0, left: 0 });

  const handleMouseMove = (e) => {
    const card = e.target;
    const cardRect = card.getBoundingClientRect();
    const pos = [e.clientX - cardRect.left, e.clientY - cardRect.top];

    const w = cardRect.width;
    const h = cardRect.height;
    const px = Math.abs(Math.floor((100 / w) * pos[0]) - 100);
    const py = Math.abs(Math.floor((100 / h) * pos[1]) - 100);
    const pa = 50 - px + (50 - py);

    const lp = 50 + (px - 50) / 1.5;
    const tp = 50 + (py - 50) / 1.5;
    const px_spark = 50 + (px - 50) / 7;
    const py_spark = 50 + (py - 50) / 7;
    const p_opc = 20 + Math.abs(pa) * 1.5;

    const ty = ((tp - 50) / 2) * -1;
    const tx = ((lp - 50) / 1.5) * 0.5;

    const transform = `rotateX(${ty}deg) rotateY(${tx}deg)`;

    const style = `
      .card${cardIndex}:hover:before { background-position: ${lp}% ${tp}%; }
      .card${cardIndex}:hover:after { background-position: ${px_spark}% ${py_spark}%; opacity: ${p_opc / 100}; }
    `;

    setHoverStyle(style);
    setTransformStyle({ transform });
  };

  const handleMouseOut = () => {
    setTransformStyle({});
    setHoverStyle('');
  };

  const handleClick = (e) => {
      const cardRect = e.target.getBoundingClientRect();

      if (!isZoomed) {
        setInitialPosition({
          top: cardRect.top,
          left: cardRect.left,
        });
      }

      setCardPosition({
        top: cardRect.top,
        left: cardRect.left,
      });

      setIsZoomed((prev) => !prev);
    };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.card${cardIndex}`)) {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isZoomed, cardIndex]);

  const zoomStyle = isZoomed
    ? {
        position: 'fixed',
        top: `${initialPosition.top}px`,
        left: `${initialPosition.left}px`,
        transform: `translate(${window.innerWidth / 2 - initialPosition.left}px, ${
          window.innerHeight / 2 - initialPosition.top
        }px) scale(1.1)`,
        transition: 'transform 0.5s ease, top 0.5s ease, left 0.5s ease',
        zIndex: 1000,
        maxWidth: '80vw',
        maxHeight: '80vh',
      }
    : {
        position: 'relative',
        transition: 'transform 0.5s ease',
      };

  return (
    <>
      <style>{hoverStyle}</style>
      <div
        className={`card holo-card card${cardIndex}`}
        style={transformStyle}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      >
        <img
          src={monster.imageUrl}
          alt={`Monster ${monster.nftId}`}
          className="card-image"
        />
      </div>
    </>
  );
};

export default MonsterCard;
