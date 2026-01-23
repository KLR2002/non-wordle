import { useMemo } from 'react';
import { Box, VStack, Heading, Button, Text, SimpleGrid, Flex, Spinner } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { getTileColor, getKeyboardColors } from './utils/TileColor';
import { useGame } from './hooks/useGame';


const flip = keyframes`
  0% { transform: rotateX(0); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0); }
`;

const Tile = ({ letter, color, delay = 0, isCompleted }) => {
  return (
    <Flex
      justify="center"
      align="center"
      w={['50px', '60px']} 
      h={['50px', '60px']}
      fontSize={['xl', '2xl']}
      fontWeight="bold"
      border="2px solid"
      borderColor={color === 'transparent' ? 'gray.600' : 'transparent'}
      bg={color === 'transparent' ? 'transparent' : color}
      color="white"
      textTransform="uppercase"
      animation={isCompleted ? `${flip} 0.5s ease forwards ${delay}s` : 'none'}
      sx={{
         transition: 'background-color 0.2s ease-in 0.25s', 
      }}
    >
      {letter}
    </Flex>
  );
};


const KEYS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  ['ENTER', ...'ZXCVBNM'.split(''), 'BACKSPACE'],
];


const Keyboard = ({ onKey, keyColors }) => (
  <VStack spacing={2} mt={8} w="100%" px={2}> 
    {KEYS.map((row, i) => (
      <Flex key={i} gap={1} w="100%" justify="center">
        {row.map((key) => {
          const bg = keyColors[key] ?? 'gray.600';
          const isSpecialKey = key.length > 1;

          return (
            <Button
              key={key}
              onClick={() => onKey(key)}
              h={['45px', '55px']} 
              flex={isSpecialKey ? 1.5 : 1} 
              px={1} 
              bg={bg}
              color="white"
              _hover={{ filter: 'brightness(1.2)' }}
              transition="background-color 0.3s ease"
              fontSize={isSpecialKey ? 'xs' : ['sm', 'md']} 
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </Button>
          );
        })}
      </Flex>
    ))}
  </VStack>
);




export default function NonWordle() {
  const { 
    guesses, 
    currentGuess, 
    gameStatus, 
    targetData, 
    isLoading, 
    isError,
    error,
    handleKeyup, 
    handleRestart 
  } = useGame();

  const keyboardColors = useMemo(() => {
    if (!targetData) return {};
    return getKeyboardColors(guesses, targetData);
  }, [guesses, targetData]);

    if (isError) {
    return (
      <Box h="100vh" bg="gray.900" color="white" p={10} textAlign="center">
        <Heading size="md" color="red.400">Error fetching word</Heading>
        <Text my={4}>{error.message}</Text>
        <Button onClick={handleRestart}>Try Again</Button>
      </Box>
    );
  }

  if (isLoading || !targetData) {
    return (
      <Flex h="100vh" justify="center" align="center" bg="gray.900" color="white">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const empties = Array(6 - Math.min(guesses.length, 6)).fill('');

  return (
      <Box minH="100vh" bg="gray.900" color="white" py={10}>
        <VStack spacing={6} w="100%" maxW="500px" mx="auto">
          <Heading color="purple.300">Non-Wordle</Heading>
          
          <Text fontSize="sm" color="gray.400" textAlign='center'>
            One letter is fake! <br />
            <Text as="span" color="purple.400" fontWeight="bold">Purple</Text> = Found fake letter at fake spot<br />
            <Text as="span" color="pink.400" fontWeight="bold">Pink</Text> = Found fake letter, wrong spot
          </Text>

          <VStack spacing={2}>
            {guesses.map((word, i) => {
              const rowColors = getTileColor(word, targetData);
              return (<SimpleGrid key={i} columns={5} spacing={2}>
                {word.split('').map((letter, idx) => (
                  <Tile
                    key={idx}
                    letter={letter}
                    isCompleted={true}
                    delay={idx * 0.1} 
                    color={rowColors[idx]}
                  />
                ))}
              </SimpleGrid>)
              })}

            {gameStatus === 'playing' && (
               <SimpleGrid columns={5} spacing={2}>
                 {[...Array(5)].map((_, i) => (
                   <Tile 
                      key={i} 
                      letter={currentGuess[i] || ''} 
                      color="transparent" 
                      isCompleted={false} 
                   />
                 ))}
               </SimpleGrid>
            )}

            {gameStatus === 'playing' && empties.map((_, i) => (
              <SimpleGrid key={i} columns={5} spacing={2}>
                {[...Array(5)].map((_, idx) => (
                  <Box key={idx} w={['50px', '60px']} h={['50px', '60px']} border="2px solid" borderColor="gray.800" />
                ))}
              </SimpleGrid>
            ))}
          </VStack>

          {gameStatus !== 'playing' && (
            <VStack>
              <Heading size="md">
                {gameStatus === 'won' ? 'You Win!' : 'Game Over'}
              </Heading>
              <Text>The word was: {targetData.targetWord}</Text>
              <Text>The original word was: {targetData.originalWord}</Text>
              <Button colorScheme="purple" onClick={handleRestart}>
                Play Again
              </Button>
            </VStack>
          )}

          <Keyboard onKey={handleKeyup} keyColors={keyboardColors}/>
          
        </VStack>
      </Box>
  );
}