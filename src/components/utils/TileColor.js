const COLOR_PRIORITY = {
  'purple.400': 5,
  'green.400':  4,
  'pink.400':   3, 
  'yellow.400': 2, 
  'gray.600' : 1,
  'transparent' : 1,
  'undefined' : 0 
};

export const getTileColor = (guess, targetData) => {
  const { targetWord, modifyIndex } = targetData;
  const guessArr = guess.split('');
  const colors = Array(5).fill('gray.600');

  const targetLetters = targetWord.split('').map((char, index) => ({
    char,
    isImposter: index === modifyIndex,
    used: false,
  }));

  guessArr.forEach((letter, i) => {
    if (letter === targetLetters[i].char) {
      colors[i] = targetLetters[i].isImposter ? 'purple.400' : 'green.400';
      targetLetters[i].used = true; 
      guessArr[i] = null;
    }
  });

  guessArr.forEach((letter, i) => {
    if (!letter) return; 

    const imposterMatchIndex = targetLetters.findIndex(
      (t) => t.char === letter && !t.used && t.isImposter
    );

    if (imposterMatchIndex !== -1) {
      colors[i] = 'pink.400';
      targetLetters[imposterMatchIndex].used = true;
      return;
    }

    const normalMatchIndex = targetLetters.findIndex(
      (t) => t.char === letter && !t.used && !t.isImposter
    );

    if (normalMatchIndex !== -1) {
      colors[i] = 'yellow.400';
      targetLetters[normalMatchIndex].used = true;
    }
  });

  return colors;
};

export const getKeyboardColors = (guesses, targetData) => {
  const keyColors = {};

  guesses.forEach((word) => {
    const rowColors = getTileColor(word, targetData);

    word.split('').forEach((letter, index) => {
      const color = rowColors[index];
      const currentScore = COLOR_PRIORITY[keyColors[letter] ?? 'undefined'];
      const newScore = COLOR_PRIORITY[color];

      if (newScore > currentScore) {
        if(color === 'gray.600')
          keyColors[letter] = 'transparent';
        else 
          keyColors[letter] = color;
      }
    });
  });

  return keyColors;
};