import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TestInstructions = ({ testType }) => {
  const getInstructionDetails = () => {
    switch(testType) {
      case 'Machine Defect':
        return {
          icon: require('../assets/icons/machine-icon.png'),
          instructions: [
            'Carefully examine each machine defect image',
            'Drag images to the correct defect category',
            'Each correct match earns 5 points',
            'Incorrect matches will deduct 1 point'
          ]
        };
      case 'Casting Defect':
        return {
          icon: require('../assets/icons/casting-icon.png'),
          instructions: [
            'Identify casting defects accurately',
            'Match images to their specific defect type',
            'Precise categorization is key',
            'Maximize your score by correct matching'
          ]
        };
      case 'Paint Defect':
        return {
          icon: require('../assets/icons/paint-icon.png'),
          instructions: [
            'Analyze paint defect images thoroughly',
            'Drag images to matching defect boxes',
            'Attention to detail is crucial',
            'Aim for maximum accuracy'
          ]
        };
      default:
        return {
          icon: require('../assets/icons/default-icon.png'),
          instructions: [
            'Follow test instructions carefully',
            'Take your time to examine images',
            'Match items accurately',
            'Aim for the highest score possible'
          ]
        };
    }
  };

  const instructionDetails = getInstructionDetails();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image 
          source={instructionDetails.icon} 
          style={styles.icon} 
        />
        <Text style={styles.title}>{testType} Test Instructions</Text>
      </View>
      
      <View style={styles.instructionList}>
        {instructionDetails.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <Text style={styles.instructionText}>
              {`${index + 1}. ${instruction}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionList: {
    paddingLeft: 10,
  },
  instructionItem: {
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default TestInstructions;