import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Dimensions,
  Vibration
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Snackbar from "react-native-snackbar";

const correctOrder = [
  "Step 1: Receive Material at Inspection Area",
  "Step 2: Visual Inspection",
  "Step 3: Compare Against Standards",
  "Step 4: Sampling and Quality Control Testing",
  "Step 5: Labeling and Storage of Accepted Materials",
  "Step 6: Reporting and Documentation",
  "Step 7: Continuous Improvement & Feedback",
  "Step 8: Approve or Reject Material",
];


// Create shorter display versions for the small cards
const shortSteps = [
  "Receive Material at Inspection Area",
  "Visual Inspection",
  "Compare Against Standards",
  "Sampling and Quality Control Testing",
  "Labeling and Storage of Accepted Materials",
  "Reporting and Documentation",
  "Continuous Improvement & Feedback",
  "Approve or Reject Material",
];

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
const { width: screenWidth } = Dimensions.get('window');

const MixMatchGameScreen = ({ navigation }) => {
  // Map the correct order with both full text and short display text
  const [steps, setSteps] = useState(correctOrder.map((step, index) => ({
    id: index,
    fullText: step,
    shortText: shortSteps[index],
    isCorrect: null // null = not checked, true = correct, false = incorrect
  })));
  
  const [shuffledSteps, setShuffledSteps] = useState(shuffleArray([...steps]));
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerColor, setTimerColor] = useState("#4CAF50"); // Green
  const [checking, setChecking] = useState(false);
  
  // Add these variables inside the MixMatchGameScreen component:
const [stepsMisplaced, setStepsMisplaced] = useState(0);
const startTimeRef = useRef(Date.now());
const stepTimesRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        // Update timer color based on time remaining
        if (newTime <= 20) {
          setTimerColor("#F44336"); // Red
        } else if (newTime <= 40) {
          setTimerColor("#FF9800"); // Orange
        }
        
        if (newTime <= 0) {
          clearInterval(timer);
          Alert.alert("Time's Up!", "Your time has expired. Try again!");
          resetGame();
          return 60;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
const resetGame = () => {
  setSelectedOrder([]);
  // Reset all steps to initial state (no correct/incorrect marking)
  const resetSteps = steps.map(step => ({
    ...step,
    isCorrect: null
  }));
  setSteps(resetSteps);
  setShuffledSteps(shuffleArray([...resetSteps]));
  setTimeLeft(60);
  setTimerColor("#4CAF50");
  setChecking(false);
  setStepsMisplaced(0);
  startTimeRef.current = Date.now();
  stepTimesRef.current = [];
};

  const checkOrder = () => {
    if (selectedOrder.length !== correctOrder.length) {
      Alert.alert("Incomplete", "Please arrange all the steps before checking.");
      return;
    }
    
    const orderedIds = selectedOrder.map(step => step.id);
    const correctIds = steps.map(step => step.id);
    
    if (JSON.stringify(orderedIds) === JSON.stringify(correctIds)) {
      // Mark all as correct for visual feedback
      const allCorrect = selectedOrder.map(step => ({
        ...step,
        isCorrect: true
      }));
      setSelectedOrder(allCorrect);
      Alert.alert("Success!", "You arranged the SOP correctly!");
    } else {
      // Should not reach here due to real-time checking
      resetGame();
    }
  };

  // Modify the handleSelect function:
const handleSelect = (step) => {
  if (selectedOrder.find(s => s.id === step.id) || checking) return;
  
  // Record the time of this selection
  const now = Date.now();
  stepTimesRef.current.push({
    stepId: step.id,
    timeStamp: now
  });
  
  // Add to selected order
  const updatedSelectedOrder = [...selectedOrder, step];
  setSelectedOrder(updatedSelectedOrder);
  
  // Remove from shuffled steps
  setShuffledSteps(shuffledSteps.filter(item => item.id !== step.id));
  
  // Check if this selection is correct (in real-time)
  const newSelection = updatedSelectedOrder[updatedSelectedOrder.length - 1];
  const correctPosition = updatedSelectedOrder.length - 1;
  
  // Mark this step as correct or incorrect
  if (newSelection.id === correctPosition) {
    // This step is in the correct position
    const updatedSelected = updatedSelectedOrder.map((s, i) => {
      if (s.id === newSelection.id) {
        return { ...s, isCorrect: true };
      }
      return s;
    });
    setSelectedOrder(updatedSelected);
    
    // Check if all steps have been placed correctly
    if (updatedSelectedOrder.length === correctOrder.length) {
      const totalTime = (now - startTimeRef.current) / 1000; // Convert to seconds
      
      // Navigate to results screen with performance data
      navigation.navigate("ResultsScreen", {
        timeUsed: 60 - timeLeft,
        totalSteps: correctOrder.length,
        stepsMisplaced: stepsMisplaced,
        completionTime: totalTime
      });
    }
  } else {
    // This step is in the wrong position
    setChecking(true);
    setStepsMisplaced(prev => prev + 1);
    
    // Mark as incorrect and show in UI briefly
    const updatedSelected = updatedSelectedOrder.map((s, i) => {
      if (s.id === newSelection.id) {
        return { ...s, isCorrect: false };
      }
      return s;
    });
    setSelectedOrder(updatedSelected);
    
    // Vibrate to indicate wrong selection
    Vibration.vibrate(300);
    
    // Show snackbar with wrong sequence message
    Snackbar.show({
      text: "Wrong sequence! Try again.",
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: "#F44336",
    });
    
    // Small delay to show the user the incorrect selection before resetting
    setTimeout(() => {
      // Return the step back to shuffled steps
      setShuffledSteps([...shuffledSteps, newSelection]);
      
      // Remove from selected order
      setSelectedOrder(updatedSelectedOrder.filter(s => s.id !== newSelection.id));
      setChecking(false);
    }, 1500);
  }
};

  
  // Calculate timer properties
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / 60);

  // Helper function to determine border color based on correctness
  const getBorderColor = (step) => {
    if (step.isCorrect === null) return "#9C27B0"; // Default violet
    return step.isCorrect ? "#4CAF50" : "#F44336"; // Green for correct, red for incorrect
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mix & Match SOP Steps</Text>
        
        {/* Circular Timer */}
        <View style={styles.timerContainer}>
          <Svg width={70} height={70}>
            <Circle
              cx="35"
              cy="35"
              r={radius}
              stroke="#E0E0E0"
              strokeWidth="5"
              fill="none"
            />
            <Circle
              cx="35"
              cy="35"
              r={radius}
              stroke={timerColor}
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90, 35, 35)"
            />
          </Svg>
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>
      </View>
      
      <View style={styles.gameContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Steps</Text>
          <ScrollView>
            <View style={styles.cardGrid}>
              {shuffledSteps.map((step, index) => (
                <TouchableOpacity
                  key={`shuffled-${step.id}`}
                  style={styles.stepCard}
                  onPress={() => handleSelect(step)}
                  disabled={checking}
                >
                  <Text style={styles.stepText}>{step.shortText}</Text>
                </TouchableOpacity>
              ))}
              {shuffledSteps.length === 0 && (
                <Text style={styles.emptyMessage}>All steps have been selected</Text>
              )}
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Selected Order</Text>
          <ScrollView>
            <View style={styles.selectedGrid}>
              {selectedOrder.map((step, index) => (
                <View
                  key={`selected-${step.id}`}
                  style={[
                    styles.selectedCard,
                    { 
                      borderColor: getBorderColor(step),
                      borderWidth: step.isCorrect !== null ? 3 : 0
                    }
                  ]}
                >
                  <Text style={styles.numberBadge}>{index + 1}</Text>
                  <Text style={styles.selectedStepText}>{step.shortText}</Text>
                </View>
              ))}
              {selectedOrder.length === 0 && (
                <Text style={styles.emptyMessage}>Select steps to begin</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
      
      {/* <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.checkButton} 
          onPress={checkOrder}
          disabled={checking || selectedOrder.length !== correctOrder.length}
        >
          <Text style={styles.buttonText}>Check Order</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 70,
    height: 70,
  },
  timerText: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  gameContainer: {
    flex: 1,
    flexDirection: "column",
  },
  section: {
    flex: 1,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    borderRadius: 8,
    padding: 10,
  },
  selectedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    borderRadius: 8,
    padding: 10,
  },
  stepCard: {
    width: (screenWidth - 100) / 4, // 4 cards per row
    height: 50, // Make rectangular instead of square
    margin: 5,
    backgroundColor: "#9C27B0", // Violet color
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    width: (screenWidth - 100) / 4, // 4 cards per row
    height: 50, // Make rectangular instead of square
    margin: 5,
    backgroundColor: "#9C27B0", // Violet color
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  selectedStepText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  numberBadge: {
    position: "absolute",
    top: -8,
    left: -8,
    width: 20,
    height: 20,
    backgroundColor: "#333",
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 20,
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    width: "100%",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  checkButton: {
    backgroundColor: "#9C27B0", // Match violet theme
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MixMatchGameScreen;