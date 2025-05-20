import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestReport = ({ title, score }) => {
  const getPerformanceLabel = () => {
    if (score < 10) return 'Poor';
    if (score < 20) return 'Average';
    if (score < 30) return 'Good';
    return 'Excellent';
  };

  const getScoreColor = () => {
    if (score < 10) return styles.poorScore;
    if (score < 20) return styles.averageScore;
    if (score < 30) return styles.goodScore;
    return styles.excellentScore;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score:</Text>
        <Text style={[styles.score, getScoreColor()]}>
          {score}
        </Text>
      </View>
      <Text style={styles.performanceLabel}>
        Performance: {getPerformanceLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#666',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  poorScore: {
    color: '#d32f2f',
  },
  averageScore: {
    color: '#f57c00',
  },
  goodScore: {
    color: '#2196f3',
  },
  excellentScore: {
    color: '#4caf50',
  },
});

export default TestReport;