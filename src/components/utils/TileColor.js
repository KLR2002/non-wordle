export const getTileColor = (letter, index, targetWord, modifyIndex, imposterChar) => {
  if (!letter) return 'transparent';

  const isImposterChar = letter === imposterChar;
  const isCorrectPosition = letter === targetWord[index];

  if (isImposterChar && index === modifyIndex) return 'purple.400'; 
  if (isImposterChar && targetWord.includes(letter)) return 'pink.400';

  if (isCorrectPosition) return 'green.400';
  if (targetWord.includes(letter)) return 'yellow.400';

  return 'gray.600';
};