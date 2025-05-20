import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScoreDisplay = ({ score }) => {
  const getScoreColor = () => {
    if (score < 0) return styles.negativeScore;
    if (score < 10) return styles.lowScore;
    if (score < 20) return styles.mediumScore;
    return styles.highScore;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Score:</Text>
      <Text style={[styles.score, getScoreColor()]}>
        {score}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: '600',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  negativeScore: {
    color: '#d32f2f',
  },
  lowScore: {
    color: '#f57c00',
  },
  mediumScore: {
    color: '#2196f3',
  },
  highScore: {
    color: '#4caf50',
  },
});

export default ScoreDisplay;