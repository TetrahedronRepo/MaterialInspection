import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DraggableItem from './DraggableItem';
import DropBox from './DropBox';
import Button from '../common/Button';
import { useTest } from '../../context/TestContext';
import ScoreCard from './ScoreCard';
import { Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const DragDropTest = ({
  testType,
  defectData,
  onComplete,
}) => {
  const navigation = useNavigation();
  const { updateTestScore } = useTest();
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dropBox, setDropBox] = useState(null);
  const [draggableItems, setDraggableItems] = useState([]);
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [testFinalized, setTestFinalized] = useState(false);
  
  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');
  
  // Store drop box layout for collision detection
  const dropBoxLayout = useRef(null);
  // Keep a direct reference to current drop box state to avoid stale closure issues
  const currentDropBox = useRef(null);

  // Load the current question
  useEffect(() => {
    loadQuestion(currentQuestionIndex);
    // Calculate max possible score (5 points per question)
    setMaxPossibleScore(defectData.questions.length * 5);
  }, [defectData, currentQuestionIndex]);

  // Auto-navigate to Results screen when all questions are completed
  useEffect(() => {
    if (allQuestionsCompleted && !testFinalized) {
      // Add a small delay before navigating
      const timer = setTimeout(() => {
        finalizeTestAndNavigate();
      }, 1000); // 1 second delay before navigation
      
      return () => clearTimeout(timer);
    }
  }, [allQuestionsCompleted, testFinalized]);

  const loadQuestion = (index) => {
    // Get the current question data
    const questionData = defectData.questions[index];
    
    // Reset question completion state
    setQuestionCompleted(false);
    
    if (!questionData) {
      // No more questions
      setAllQuestionsCompleted(true);
      return;
    }
    
    // Prepare the drop box
    const box = {
      ...questionData.dropBox,
      containsItem: null,
      isCorrectDrop: false,
      itemImage: null,
    };

    // Combine correct and incorrect items
    const allItems = [
      questionData.correctItem,
      ...questionData.incorrectItems.slice(0, 3),
    ];

    // Shuffle the items
    const shuffledItems = allItems.sort(() => Math.random() - 0.5);

    setDropBox(box);
    currentDropBox.current = box; // Initialize ref with box
    
    setDraggableItems(
      shuffledItems.map(item => ({
        ...item,
        beingDragged: false,
        dropped: false,
      })),
    );
  };

  // Update our ref whenever dropBox state changes
  useEffect(() => {
    currentDropBox.current = dropBox;
  }, [dropBox]);

  const handleDrag = (itemId, dragState) => {
    setDraggableItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, beingDragged: dragState } : item,
      ),
    );
  };

  const handleDragRelease = (itemId, position) => {
    // Check if the item was dropped on the valid drop box
    if (isOverDropBox(position)) {
      handleDrop(itemId);
    }
  };

  const isOverDropBox = (position) => {
    // Check if the position is within the drop box bounds
    if (!dropBoxLayout.current) return false;
    
    const layout = dropBoxLayout.current;
    
    return (
      position.x >= layout.x &&
      position.x <= layout.x + layout.width &&
      position.y >= layout.y &&
      position.y <= layout.y + layout.height
    );
  };

  const handleDropBoxInteraction = (data) => {
    if (data.type === 'setLayout') {
      // Store the drop box layout
      dropBoxLayout.current = data.layout;
    }
  };

  const showSnackbar = (message, type = 'info') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const finalizeTestAndNavigate = () => {
    // Mark test as finalized to prevent multiple calls
    setTestFinalized(true);
    
    // Convert testType to the correct key format
    let scoreKey;
    if (testType === "Machine Defect") {
      scoreKey = "machineDefect";
    } else if (testType === "Casting Defect") {
      scoreKey = "castingDefect";
    } else if (testType === "Paint Defect") {
      scoreKey = "paintDefect";
    }

    updateTestScore(testType, totalScore);

    // Call the onComplete callback with the score if provided
    if (onComplete) {
      onComplete(totalScore);
    }
    
    // Navigate to Results screen
    navigation.navigate('Results');
  };

  const handleDrop = (itemId) => {
    // Don't process if question is already completed
    if (questionCompleted) return;
    
    // Find the item
    const item = draggableItems.find(i => i.id === itemId);
    
    // Get the current state of the box directly from our ref to avoid stale closures
    const box = currentDropBox.current;
    
    // Check if the drop box is already occupied
    if (box.containsItem !== null) {
      // Show a red snackbar for the error
      showSnackbar('Box already occupied. Try again with a different item.', 'error');
      return;
    }

    // Get current question
    const currentQuestion = defectData.questions[currentQuestionIndex];
    
    // Check if the drop is correct (item id matches correctItem id)
    const isCorrect = itemId === currentQuestion.correctItem.id;

    // Scoring: 5 points for correct, 0 for incorrect
    if (isCorrect) {
      // Add 5 points for a correct match
      setTotalScore(prevScore => prevScore + 5);
      showSnackbar('Correct! +5 points', 'success');
    } else {
      setTotalScore(prevScore => prevScore - 1);
      showSnackbar('Incorrect. 0 points', 'warning');
    }
    
    // Create updated box object
    const updatedBox = {
      ...box,
      containsItem: itemId,
      isCorrectDrop: isCorrect,
      itemImage: item.image
    };

    // Update state and ref
    setDropBox(updatedBox);
    currentDropBox.current = updatedBox;

    // Update draggable item state
    setDraggableItems(prev =>
      prev.map(i =>
        i.id === itemId ? { ...i, dropped: true, beingDragged: false } : i,
      ),
    );

    // Mark question as completed
    setQuestionCompleted(true);
    
    // Automatically move to the next question after a short delay
    // This gives the user time to see the feedback
    setTimeout(() => {
      // Next question or finish test if all questions completed
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex >= defectData.questions.length) {
        // All questions completed
        setAllQuestionsCompleted(true);
      } else {
        // Move to next question
        setCurrentQuestionIndex(nextIndex);
      }
    }, 1500); // 1.5 second delay to show feedback
  };


  // Don't render until data is loaded
  if (!dropBox && !allQuestionsCompleted) return null;

  // // If all questions completed, we're navigating away, so just show a loading state
  // if (allQuestionsCompleted) {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <Text style={styles.loadingText}>Loading Results...</Text>
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>
          {testType} Test - Question {currentQuestionIndex + 1} of {defectData.questions.length}
        </Text>
      </View>
      <View style={styles.testArea}>
        <View style={styles.dropBoxArea}>
          <DropBox
            key={dropBox.id}
            id={dropBox.id}
            label={dropBox.label}
            containsItem={dropBox.containsItem}
            isCorrectDrop={dropBox.isCorrectDrop}
            itemImage={dropBox.itemImage}
            onDropInteraction={handleDropBoxInteraction}
          />
          <View style={styles.scoringInfoContainer}>
            <ScoreCard
              currentScore={totalScore}
              maxScore={maxPossibleScore}
              questionScore={+5}
              defectiveCount={0}
            />
          </View>
        </View>

        <View style={styles.draggableArea}>
          {draggableItems.map(item => (
            <DraggableItem
              key={item.id}
              id={item.id}
              image={item.image}
              beingDragged={item.beingDragged}
              dropped={item.dropped}
              onDrag={handleDrag}
              onDragRelease={handleDragRelease}
            />
          ))}
        </View>
      </View>


      {/* Snackbar for error and success messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1000}
        style={{
          backgroundColor: snackbarType === 'error' 
            ? '#F44336' 
            : snackbarType === 'success' 
              ? '#4CAF50' 
              : snackbarType === 'warning'
                ? '#FF9800'
                : '#323232'
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  testArea: {
    flex: 1,
    flexDirection: 'row',
  },
  dropBoxArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  draggableArea: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
  },
  scoringInfoContainer: {
    width: '100%',
    marginTop: 10,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
  },
});

export default DragDropTest;