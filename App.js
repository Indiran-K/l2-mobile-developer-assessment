import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// Set initial values for timer and score
const initialTimer = 120;
const initialScore = 0;

// Define the Balloon component
const Balloon = ({ onPress }) => {
  return (
    <View style={styles.balloon} onStartShouldSetResponder={() => true} onResponderRelease={onPress}>
      <Text style={styles.balloonText}>🎈</Text>
    </View>
  );
};

// Define the Game component
const Game = () => {
  // Set state variables for timer, score, balloons, and game status
  const [timer, setTimer] = useState(initialTimer);
  const [score, setScore] = useState(initialScore);
  const [balloons, setBalloons] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Function to start the game
  const startGame = () => {
    setIsGameStarted(true);
  };

  // Function to reset the game
  const resetGame = () => {
    setIsGameStarted(false);
    setTimer(initialTimer);
    setScore(initialScore);
    setBalloons([]);
  };

  // Function to handle balloon popping
  const handleBalloonPop = (index) => {
    // Update score and remove the popped balloon from the array
    setScore(score + 2);
    setBalloons(balloons.filter((_, i) => i !== index));
  };

  // Function to generate new balloons
  const generateBalloon = () => {
    if (isGameStarted) {
      // Generate a random horizontal position for the balloon
      const randomPosition = Math.floor(Math.random() * window.innerWidth);
      // Add a new balloon to the array with a unique key and the handleBalloonPop function as a prop
      setBalloons([...balloons, { key: Math.random(), position: randomPosition, onPress: handleBalloonPop }]);
    }
  };

  // Function to update the timer
  const updateTimer = () => {
    if (isGameStarted && timer > 0) {
      // Decrement the timer by 1 second and update the state
      setTimer(timer - 1);
    } else {
      // End the game when the timer reaches 0
      setIsGameStarted(false);
    }
  };

  // Use useEffect to generate new balloons at random intervals
  useEffect(() => {
    const interval = setInterval(() => {
      generateBalloon();
    }, Math.random() * 1000 + 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [isGameStarted]);

  // Use useEffect to update the timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timer, isGameStarted]);

  // Render the game components
  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timer}</Text>
      <Text style={styles.score}>Score: {score}</Text>
      {isGameStarted && balloons.map((balloon, index) => (
        <Balloon key={balloon.key} onPress={() => handleBalloonPop(index)} style={{ left: balloon.position }} />
      ))}
      {!isGameStarted && (
        <View>
          <Text style={styles.endGameText}>Game Over!</Text>
          <Button title="Play Again" onPress={resetGame} />
        </View>
      )}
      {!isGameStarted && (
        <Button title="Start" onPress={startGame} />
      )}
    </View>
  );
};

// Define the styles for the game components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balloon: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloonText: {
    fontSize: 24,
    color: '#fff',
  },
  endGameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

// Export the Game component for use in other parts of the application
export default Game;
