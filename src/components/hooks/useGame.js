import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const fetchAndModifyWord = async () => {
  const { data } = await axios.get('https://random-word-api.herokuapp.com/word?length=5');
  const word = data.toString();

  const originalWord = word.toUpperCase();

  const modifyIndex = Math.floor(Math.random() * 5);
  let newChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

  while (newChar === originalWord[modifyIndex]) {
    newChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  const splitWord = originalWord.split('');
  splitWord[modifyIndex] = newChar;
  const targetWord = splitWord.join('');
  console.log(`Word to guess: ${targetWord}`)
  return { targetWord, modifyIndex, originalWord, imposterChar: newChar };
};

export const useGame = () => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ['wordOfTheGame'],
    queryFn: fetchAndModifyWord,
    refetchOnWindowFocus: false,
  });

  const handleRestart = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    refetch();
  };

  const submitGuess = () => {
    if (currentGuess.length !== 5 || gameStatus !== 'playing') return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === data.targetWord) {
      setGameStatus('won');
    } else if (newGuesses.length >= 7) {
      setGameStatus('lost');
    }
  };

  const handleKeyup = (key) => {
    if (gameStatus !== 'playing' || isLoading) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  useEffect(() => {
    const listener = (e) => handleKeyup(e.key.toUpperCase());
    window.addEventListener('keyup', listener);
    return () => window.removeEventListener('keyup', listener);
  }, [currentGuess, gameStatus, isLoading]);

  return {
    guesses,
    currentGuess,
    gameStatus,
    targetData: data,
    isLoading,
    isError,
    error,
    handleKeyup,
    handleRestart,
  };
};