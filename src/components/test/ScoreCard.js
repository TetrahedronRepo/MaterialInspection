import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScoreCard = ({ currentScore, maxScore, questionScore, defectiveCount }) => {
  return (
    <View style={styles.scoreCard}>
      <Text style={styles.ruleTitle}>Scoring Rules:</Text>
      <View style={styles.scoringRules}>
        <View>
        <Text style={styles.ruleText}>✓ Correct match: {questionScore} points</Text>
        <Text style={styles.ruleText}>✗ Incorrect match: {defectiveCount} point</Text>
        </View>
        <View>
        <Text style={styles.currentScore}>{currentScore} out of {maxScore}</Text>
        </View>
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Drag the images to the matching defect type boxes.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  currentScore: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 15,
  },
  scoringRules: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop: 5,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  ruleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  instructions: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  instructionText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});

export default ScoreCard;