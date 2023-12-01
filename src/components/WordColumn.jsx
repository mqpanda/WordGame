// src/components/WordColumn.js
import React from 'react';

const WordColumn = ({ words, onDragStart }) => {
  return (
    <div className="word-column" onDragStart={onDragStart}>
      {words.map((word, index) => (
        <div key={index} draggable className="word-item">
          {word}
        </div>
      ))}
    </div>
  );
};

export default WordColumn;
