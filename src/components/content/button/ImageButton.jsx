import React from 'react';
import './ImageButton.css';

const ImageButton = ({ src, alt, onClick }) => {
  return (
    <button className="image-button" onClick={onClick}>
      <img src={src} alt={alt} className="image-button-img" />
    </button>
  );
};

export default ImageButton;
