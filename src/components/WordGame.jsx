// src/components/WordGame.js
import React, { useState, useEffect } from 'react';
import './WordGame.css'; // Подключаем стили

const WordGame = () => {
  const initialColumn1 = ['Big', 'Small', 'Green'];
  const initialColumn2 = ['Apple', 'Car', 'House'];

  const [column1, setColumn1] = useState([...initialColumn1]);
  const [column2, setColumn2] = useState([...initialColumn2]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [currentPair, setCurrentPair] = useState({ left: '', right: '' });
  const [correctAnswers, setCorrectAnswers] = useState([
    'Big Apple',
    'Small Car',
    'Green House',
    // Добавьте другие возможные словосочетания в массив
  ]);

  const [allPairsCorrect, setAllPairsCorrect] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [resultMessageClass, setResultMessageClass] = useState('');

  useEffect(() => {
    // Check answers when selectedPairs is updated
    if (selectedPairs.length === column1.length) {
      const areAllPairsCorrect = selectedPairs.every((pair) =>
        correctAnswers.includes(`${pair.left} ${pair.right}`)
      );
      setAllPairsCorrect(areAllPairsCorrect);

      // If all pairs are selected and not all are correct, reset the game
      if (!areAllPairsCorrect) {
        resetGame();
        setResultMessage('Some pairs are incorrect. Please check again.');
        setResultMessageClass('incorrect-message');
      }
    }
  }, [selectedPairs, column1.length, correctAnswers]);

  const handleWordClick = (word, column) => {
    if (currentPair.left === word) {
      // If the clicked word is the same as the left part of the current pair, reset it
      setCurrentPair({ ...currentPair, left: '', leftColumn: '' });
    } else if (currentPair.right === word) {
      // If the clicked word is the same as the right part of the current pair, reset it
      setCurrentPair({ ...currentPair, right: '', rightColumn: '' });
    } else if (!currentPair.left) {
      // If the left part is not selected, set the clicked word as the left part
      setCurrentPair({ ...currentPair, left: word, leftColumn: column });
    } else if (!currentPair.right && currentPair.leftColumn !== column) {
      // If the right part is not selected and the clicked word is in the opposite column, set it as the right part
      setCurrentPair({ ...currentPair, right: word, rightColumn: column });
    }
  };

  const handleConfirmPair = () => {
    if (currentPair.left && currentPair.right) {
      const isPairConfirmed = selectedPairs.some(
        (pair) =>
          (pair.left === currentPair.left &&
            pair.right === currentPair.right) ||
          (pair.left === currentPair.right && pair.right === currentPair.left)
      );

      if (!isPairConfirmed) {
        setSelectedPairs((prevPairs) => [
          ...prevPairs,
          // Always store the pair with words in alphabetical order
          {
            left:
              currentPair.left < currentPair.right
                ? currentPair.left
                : currentPair.right,
            right:
              currentPair.left < currentPair.right
                ? currentPair.right
                : currentPair.left,
          },
        ]);
        setCurrentPair({ left: '', right: '' });

        // Filter out the selected pair from the columns
        setColumn1((prevColumn1) =>
          prevColumn1.filter(
            (word) =>
              word !== currentPair.left &&
              word !== currentPair.right &&
              !selectedPairs.some(
                (pair) => pair.left === word || pair.right === word
              )
          )
        );
        setColumn2((prevColumn2) =>
          prevColumn2.filter(
            (word) =>
              word !== currentPair.left &&
              word !== currentPair.right &&
              !selectedPairs.some(
                (pair) => pair.left === word || pair.right === word
              )
          )
        );
      } else {
        setResultMessage(
          'This pair has already been confirmed. Please choose a new pair.'
        );
        setResultMessageClass('incorrect-message');
      }
    }
  };

  const handleCheckAnswers = () => {
    const areAllPairsCorrect = selectedPairs.every(
      (pair) =>
        correctAnswers.includes(`${pair.left} ${pair.right}`) ||
        correctAnswers.includes(`${pair.right} ${pair.left}`)
    );
    if (areAllPairsCorrect) {
      setResultMessage('All pairs are correct!');
      setResultMessageClass('correct-message');
    } else {
      resetGame();
      setResultMessage('Some pairs are incorrect. Please check again.');
      setResultMessageClass('incorrect-message');
    }
  };

  const resetGame = () => {
    // Сбросить состояние игры
    setColumn1([...initialColumn1]);
    setColumn2([...initialColumn2]);
    setSelectedPairs([]);
    setCurrentPair({ left: '', right: '' });
    setAllPairsCorrect(false);
    setResultMessage('');
    setResultMessageClass('');
  };

  return (
    <div className="game">
      <button onClick={resetGame}>Restart Game</button>
      <div className="word-game">
        <div className="word-column">
          {column1.map((word, index) => (
            <div
              key={index}
              onClick={() => handleWordClick(word, 'left')}
              className={`word-item ${
                currentPair.left === word || currentPair.right === word
                  ? 'selected'
                  : ''
              }`}
            >
              {word}
            </div>
          ))}
        </div>
        <div className="word-column">
          {column2.map((word, index) => (
            <div
              key={index}
              onClick={() => handleWordClick(word, 'right')}
              className={`word-item ${
                currentPair.left === word || currentPair.right === word
                  ? 'selected'
                  : ''
              }`}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
      <div>
        <button
          onClick={handleConfirmPair}
          disabled={!currentPair.left || !currentPair.right}
        >
          Confirm Pair
        </button>

        <button
          onClick={handleCheckAnswers}
          disabled={selectedPairs.length < initialColumn1.length}
        >
          Check Answers
        </button>
      </div>

      {/* Добавленный блок для отображения выбранных пар и результатов */}
      <div className="selected-pairs">
        <h2>Selected Pairs</h2>
        <ul>
          {selectedPairs.map((pair, index) => (
            <li key={index}>
              {pair.left} - {pair.right}
            </li>
          ))}
        </ul>
      </div>
      <div className={`result-message ${resultMessageClass}`}>
        <p>{resultMessage}</p>
      </div>
    </div>
  );
};

export default WordGame;
