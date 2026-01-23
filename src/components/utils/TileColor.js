const COLOR_PRIORITY = {
  'purple.400': 5,
  'green.400':  4,
  'pink.400':   3, 
  'yellow.400': 2, 
  'gray.600' : 1,
  'transparent' : 1,
  'undefined' : 0 
};

export const getTileColor = (letter, index, targetWord, modifyIndex, imposterChar) => {
  if (!letter) return 'transparent';

  const isImposterChar = letter === imposterChar;
  const isCorrectPosition = letter === targetWord[index];

  if (isImposterChar && index === modifyIndex) return 'purple.400'; 
  if (isImposterChar && isCorrectPosition) return 'green.400'; 
  if (isImposterChar && targetWord.includes(letter)) return 'pink.400';

  if (isCorrectPosition) return 'green.400';
  if (targetWord.includes(letter)) return 'yellow.400';

  return 'gray.600';
};

export const getKeyboardColors = (guesses, targetData) => {
  const keyColors = {};

  guesses.forEach((word) => {
    word.split('').forEach((letter, index) => {
      const color = getTileColor(
        letter, 
        index, 
        targetData.targetWord, 
        targetData.modifyIndex, 
        targetData.imposterChar
      );
      const currentScore = COLOR_PRIORITY[keyColors[letter] ?? 'undefined'];
      const newScore = COLOR_PRIORITY[color];
      console.log("New score: ", newScore)
      console.log("Current score: ", currentScore)
      console.log("color: ", color)

      if (newScore > currentScore) {
        if (color === 'gray.600')
          keyColors[letter] = 'transparent';
        else
          keyColors[letter] = color;
      }
    });
  });

  return keyColors;
};