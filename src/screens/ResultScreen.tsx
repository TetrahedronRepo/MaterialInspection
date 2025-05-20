// import React, { useEffect, useState } from "react";
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity,
//   Dimensions,
//   Animated,
//   Image,
//   ScrollView,
//   Alert
// } from "react-native";
// import {useTest} from '../context/TestContext';
// import { LineChart } from "react-native-chart-kit";
// import { CommonActions } from "@react-navigation/native";
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';

// const { width: screenWidth } = Dimensions.get('window');

// const ResultsScreen = ({ route, navigation }) => {
//   const { timeUsed, totalSteps, stepsMisplaced, completionTime } = route.params;
//   const {employeeData, testScores, resetTest, testImages} = useTest();
//   const [employeePhotoUrl, setEmployeePhotoUrl] = useState(null);
//   const [scoreAnimation] = useState(new Animated.Value(0));
//   const [accuracyAnimation] = useState(new Animated.Value(0));
//   const [speedAnimation] = useState(new Animated.Value(0));
//   const [overallScoreAnimation] = useState(new Animated.Value(0));

//   const [isSaving, setSaving] = useState(false);
//   const [isSaved, setSaved] = useState(false);


//   // Calculate performance metrics
//   const timeScore = Math.max(0, 100 - (timeUsed / 60 * 100)); // Higher score for less time used
//   const accuracyScore = Math.max(0, 100 - (stepsMisplaced * 8)); // Each misplacement reduces score
  
//   // Calculate speed based on average time per correct placement
//   const avgTimePerStep = completionTime / totalSteps;
//   const speedScore = Math.max(0, 100 - (avgTimePerStep * 10)); // Lower avg time = higher score
  
//   // Overall performance score - weighted average
//   const overallScore = Math.round((timeScore * 0.3) + (accuracyScore * 0.5) + (speedScore * 0.2));
  
//   // Performance rating based on overall score
//   const getPerformanceRating = (score) => {
//     if (score >= 90) return "Outstanding";
//     if (score >= 80) return "Excellent";
//     if (score >= 70) return "Very Good";
//     if (score >= 60) return "Good";
//     if (score >= 50) return "Average";
//     if (score >= 40) return "Fair";
//     return "Needs Improvement";
//   };
  
//   // Historical performance data (this would normally come from storage)
//   // For demo purposes, we're creating mock data
//   const performanceData = [
//     { date: "First Try", score: Math.floor(Math.random() * 30) + 40 },
//     { date: "Second Try", score: Math.floor(Math.random() * 30) + 45 },
//     { date: "Third Try", score: Math.floor(Math.random() * 30) + 50 },
//     { date: "Fourth Try", score: Math.floor(Math.random() * 30) + 55 },
//     { date: "This Attempt", score: overallScore }
//   ];
  
//   // Prepare chart data
//   const chartData = {
//     labels: performanceData.map(item => item.date),
//     datasets: [
//       {
//         data: performanceData.map(item => item.score),
//         color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`, // Violet
//         strokeWidth: 2
//       }
//     ],
//     legend: ["Performance Score"]
//   };


//   // Function to save inspection results to Firestore
//   const saveInspectionResults = async () => {
//     try {
//       setSaving(true);
      
//       // Create a new document reference
//       const inspectionRef = firestore().collection('IncomingMaterialInspection');
      
//       // Upload employee photo if it's a local file (not a URL)
//       let photoUrl = employeeData.photo;
//       if (employeeData.photo && !employeeData.photo.startsWith('http')) {
//         const filename = `employee_photos/${employeeData.employeeCode}_${new Date().getTime()}.jpg`;
//         const storageRef = storage().ref(filename);
        
//         // Upload the image
//         await storageRef.putFile(employeeData.photo);
        
//         // Get the URL
//         photoUrl = await storageRef.getDownloadURL();
//         setEmployeePhotoUrl(photoUrl);
//       }
      
//       // Upload test images if available
//       const uploadedTestImages = [];
//       if (testImages && testImages.length > 0) {
//         for (let i = 0; i < testImages.length; i++) {
//           const testImg = testImages[i];
//           if (testImg && !testImg.startsWith('http')) {
//             const imageName = `test_images/${employeeData.employeeCode}_${new Date().getTime()}_${i}.jpg`;
//             const testImgRef = storage().ref(imageName);
            
//             // Upload the image
//             await testImgRef.putFile(testImg);
            
//             // Get the URL
//             const imgUrl = await testImgRef.getDownloadURL();
//             uploadedTestImages.push(imgUrl);
//           } else if (testImg) {
//             // If already a URL, just add it to the array
//             uploadedTestImages.push(testImg);
//           }
//         }
//       }
      
//       // Data to be saved
//       const inspectionData = {
//         employeeDetails: {
//           name: employeeData.name,
//           employeeCode: employeeData.employeeCode,
//           photoUrl: photoUrl,
//           testDate: firestore.Timestamp.now(),
//         },
//         testResults: {
//           timeScore: parseFloat(timeScore.toFixed(1)),
//           accuracyScore: parseFloat(accuracyScore.toFixed(1)),
//           speedScore: parseFloat(speedScore.toFixed(1)),
//           overallScore: overallScore,
//           performanceRating: getPerformanceRating(overallScore),
//           totalSteps: totalSteps,
//           stepsMisplaced: stepsMisplaced,
//           timeSaved: parseFloat((60 - timeUsed).toFixed(1)),
//           avgTimePerStep: parseFloat(avgTimePerStep.toFixed(1)),
//           completionTime: completionTime
//         },
//         timestamp: firestore.Timestamp.now(),
//         testImageUrls: uploadedTestImages.length > 0 ? uploadedTestImages : testImages || []
//       };
      
//       // Add the document to Firestore
//       await inspectionRef.add(inspectionData);
      
//       setSaved(true);
//       setSaving(false);
//       Alert.alert(
//         "Success", 
//         "Inspection results saved successfully.",
//         [{ text: "OK" }]
//       );
//     } catch (error) {
//       console.error("Error saving inspection results:", error);
//       setSaving(false);
//       Alert.alert(
//         "Error", 
//         "Failed to save inspection results. Please try again.",
//         [{ text: "OK" }]
//       );
//     }
//   };

  
//   useEffect(() => {
//     // Animate the score displays
//     Animated.parallel([
//       Animated.timing(scoreAnimation, {
//         toValue: timeScore,
//         duration: 1500,
//         useNativeDriver: false
//       }),
//       Animated.timing(accuracyAnimation, {
//         toValue: accuracyScore,
//         duration: 1500,
//         useNativeDriver: false
//       }),
//       Animated.timing(speedAnimation, {
//         toValue: speedScore,
//         duration: 1500,
//         useNativeDriver: false
//       }),
//       Animated.timing(overallScoreAnimation, {
//         toValue: overallScore,
//         duration: 2000,
//         useNativeDriver: false
//       })
//     ]).start();
//   }, []);
  
//   const playAgain = () => {
//     // Navigate back to game screen
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [
//           { name: 'MixMatchGameScreen' }
//         ],
//       })
//     );
//   };
  
//   const goToHome = () => {
//     // Navigate to home screen
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [
//           { name: 'Home' }
//         ],
//       })
//     );
//   };



//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Results Summary</Text>
//       </View>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.employeeInfo}>
//         <View style={styles.photoContainer}>
//           <Image
//             source={{uri: employeePhotoUrl || employeeData.photo}}
//             style={styles.employeePhoto}
//             resizeMode="cover"
//           />
//         </View>
//         <Text style={styles.employeeInfoText}>Name: {employeeData.name}</Text>
//         <Text style={styles.employeeInfoText}>
//           Employee Code: {employeeData.employeeCode}
//         </Text>
//         <Text style={styles.employeeInfoText}>
//           Test Date: {employeeData.testDate.toDateString()}
//         </Text>
//       </View>

//       {/* Performance Overview */}
//       <View style={styles.overallScoreContainer}>
//         <Text style={styles.overallScoreLabel}>Your Performance</Text>
//         <Animated.Text style={styles.overallScoreValue}>
//           {overallScoreAnimation.interpolate({
//             inputRange: [0, overallScore],
//             outputRange: ['0', overallScore.toString()]
//           })}%
//         </Animated.Text>
//         <Text style={styles.ratingText}>{getPerformanceRating(overallScore)}</Text>
//       </View>
      
//       {/* Detailed Metrics */}
//       <View style={styles.metricsContainer}>
//         <View style={styles.metricItem}>
//           <Text style={styles.metricLabel}>Time Efficiency</Text>
//           <View style={styles.progressBar}>
//             <Animated.View 
//               style={[
//                 styles.progressFill, 
//                 { 
//                   width: scoreAnimation.interpolate({
//                     inputRange: [0, 100],
//                     outputRange: ['0%', '100%']
//                   }),
//                   backgroundColor: '#9C27B0' // Violet
//                 }
//               ]} 
//             />
//           </View>
//           <Animated.Text style={styles.metricValue}>
//             {scoreAnimation.interpolate({
//               inputRange: [0, timeScore],
//               outputRange: ['0', timeScore.toFixed(1).toString()]
//             })}%
//           </Animated.Text>
//         </View>
        
//         <View style={styles.metricItem}>
//           <Text style={styles.metricLabel}>Accuracy</Text>
//           <View style={styles.progressBar}>
//             <Animated.View 
//               style={[
//                 styles.progressFill, 
//                 { 
//                   width: accuracyAnimation.interpolate({
//                     inputRange: [0, 100],
//                     outputRange: ['0%', '100%']
//                   }),
//                   backgroundColor: '#4CAF50' // Green
//                 }
//               ]} 
//             />
//           </View>
//           <Animated.Text style={styles.metricValue}>
//             {accuracyAnimation.interpolate({
//               inputRange: [0, accuracyScore],
//               outputRange: ['0', accuracyScore.toFixed(1).toString()]
//             })}%
//           </Animated.Text>
//         </View>
        
//         <View style={styles.metricItem}>
//           <Text style={styles.metricLabel}>Speed</Text>
//           <View style={styles.progressBar}>
//             <Animated.View 
//               style={[
//                 styles.progressFill, 
//                 { 
//                   width: speedAnimation.interpolate({
//                     inputRange: [0, 100],
//                     outputRange: ['0%', '100%']
//                   }),
//                   backgroundColor: '#2196F3' // Blue
//                 }
//               ]} 
//             />
//           </View>
//           <Animated.Text style={styles.metricValue}>
//             {speedAnimation.interpolate({
//               inputRange: [0, speedScore],
//               outputRange: ['0', speedScore.toFixed(1).toString()]
//             })}%
//           </Animated.Text>
//         </View>
//       </View>
      
//       {/* Stats Summary */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{totalSteps}</Text>
//           <Text style={styles.statLabel}>Total Steps</Text>
//         </View>
        
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{stepsMisplaced}</Text>
//           <Text style={styles.statLabel}>Misplacements</Text>
//         </View>
        
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{(60 - timeUsed).toFixed(1)}s</Text>
//           <Text style={styles.statLabel}>Time Saved</Text>
//         </View>
        
//         <View style={styles.statItem}>
//           <Text style={styles.statValue}>{(avgTimePerStep).toFixed(1)}s</Text>
//           <Text style={styles.statLabel}>Avg Time/Step</Text>
//         </View>
//       </View>
      
//       {/* Performance Chart */}
//       <View style={styles.chartContainer}>
//         <Text style={styles.chartTitle}>Performance History</Text>
//         <LineChart
//           data={chartData}
//           width={screenWidth - 40}
//           height={180}
//           chartConfig={{
//             backgroundColor: "#ffffff",
//             backgroundGradientFrom: "#ffffff",
//             backgroundGradientTo: "#ffffff",
//             decimalPlaces: 0,
//             color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             style: {
//               borderRadius: 16
//             },
//             propsForDots: {
//               r: "6",
//               strokeWidth: "2",
//               stroke: "#9C27B0"
//             }
//           }}
//           bezier
//           style={styles.chart}
//         />
//       </View>
      
//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.homeButton]} 
//           onPress={goToHome}
//         >
//           <Text style={styles.buttonText}>Home</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.playAgainButton]} 
//           onPress={playAgain}
//         >
//           <Text style={styles.buttonText}>Play Again</Text>
//         </TouchableOpacity>
//       </View>
//       </ScrollView>
     
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F5F5F5",
//   },
//   header: {
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//   },
//   overallScoreContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 15,
//   },
//   overallScoreLabel: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 5,
//   },
//   overallScoreValue: {
//     fontSize: 48,
//     fontWeight: "bold",
//     color: "#9C27B0", // Violet to match game theme
//   },
//   ratingText: {
//     fontSize: 20,
//     fontWeight: "500",
//     color: "#333",
//     marginTop: 5,
//   },
//   metricsContainer: {
//     marginVertical: 15,
//   },
//   metricItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   metricLabel: {
//     fontSize: 14,
//     color: "#555",
//     width: "25%",
//   },
//   progressBar: {
//     flex: 1,
//     height: 12,
//     backgroundColor: "#E0E0E0",
//     borderRadius: 6,
//     overflow: "hidden",
//     marginHorizontal: 10,
//   },
//   progressFill: {
//     height: "100%",
//   },
//   metricValue: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//     width: "15%",
//     textAlign: "right",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 15,
//   },
//   statItem: {
//     alignItems: "center",
//     width: "24%",
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#9C27B0", // Violet
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#666",
//     textAlign: "center",
//     marginTop: 4,
//   },
//   chartContainer: {
//     marginVertical: 15,
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   chartTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   chart: {
//     borderRadius: 8,
//     paddingRight: 20,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 15,
//   },
//   actionButton: {
//     paddingVertical: 12,
//     borderRadius: 8,
//     flex: 1,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   homeButton: {
//     backgroundColor: "#757575", // Gray
//   },
//   playAgainButton: {
//     backgroundColor: "#9C27B0", // Violet
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },employeeInfo: {
//     width: '100%',
//     padding: 15,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     marginBottom: 20,
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   photoContainer: {
//     marginRight: 15,
//   },
//   employeePhoto: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#2196F3',
//   },
//   employeeInfoText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });

// export default ResultsScreen;

import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  ScrollView,
  Alert
} from "react-native";
import {useTest} from '../context/TestContext';
import { LineChart } from "react-native-chart-kit";
import { CommonActions } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const { width: screenWidth } = Dimensions.get('window');

const ResultsScreen = ({ route, navigation }) => {
  const { timeUsed, totalSteps, stepsMisplaced, completionTime } = route.params;
  const {employeeData, testImages} = useTest();
  const [employeePhotoUrl, setEmployeePhotoUrl] = useState(null);
  const [scoreAnimation] = useState(new Animated.Value(0));
  const [accuracyAnimation] = useState(new Animated.Value(0));
  const [speedAnimation] = useState(new Animated.Value(0));
  const [overallScoreAnimation] = useState(new Animated.Value(0));
  const [isSaving, setSaving] = useState(false);
  const [isSaved, setSaved] = useState(false);

  // Calculate performance metrics
  const timeScore = Math.max(0, 100 - (timeUsed / 60 * 100)); // Higher score for less time used
  const accuracyScore = Math.max(0, 100 - (stepsMisplaced * 8)); // Each misplacement reduces score
  
  // Calculate speed based on average time per correct placement
  const avgTimePerStep = completionTime / totalSteps;
  const speedScore = Math.max(0, 100 - (avgTimePerStep * 10)); // Lower avg time = higher score
  
  // Overall performance score - weighted average
  const overallScore = Math.round((timeScore * 0.3) + (accuracyScore * 0.5) + (speedScore * 0.2));
  
  // Performance rating based on overall score
  const getPerformanceRating = (score) => {
    if (score >= 90) return "Outstanding";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 50) return "Average";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };
  
  // Historical performance data (this would normally come from storage)
  // For demo purposes, we're creating mock data
  const performanceData = [
    { date: "First Try", score: Math.floor(Math.random() * 30) + 40 },
    { date: "Second Try", score: Math.floor(Math.random() * 30) + 45 },
    { date: "Third Try", score: Math.floor(Math.random() * 30) + 50 },
    { date: "Fourth Try", score: Math.floor(Math.random() * 30) + 55 },
    { date: "This Attempt", score: overallScore }
  ];
  
  // Prepare chart data
  const chartData = {
    labels: performanceData.map(item => item.date),
    datasets: [
      {
        data: performanceData.map(item => item.score),
        color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`, // Violet
        strokeWidth: 2
      }
    ],
    legend: ["Performance Score"]
  };

  // Function to save inspection results to Firestore
  const saveInspectionResults = async () => {
    try {
      setSaving(true);
      
      // Create a new document reference
      const inspectionRef = firestore().collection('IncomingMaterialInspection');
      
      // Upload employee photo if it's a local file (not a URL)
      let photoUrl = employeeData.photo;
      if (employeeData.photo && !employeeData.photo.startsWith('http')) {
        const filename = `employee_photos/${employeeData.employeeCode}_${new Date().getTime()}.jpg`;
        const storageRef = storage().ref(filename);
        
        // Upload the image
        await storageRef.putFile(employeeData.photo);
        
        // Get the URL
        photoUrl = await storageRef.getDownloadURL();
        setEmployeePhotoUrl(photoUrl);
      }
      
      // Upload test images if available
      const uploadedTestImages = [];
      if (testImages && testImages.length > 0) {
        for (let i = 0; i < testImages.length; i++) {
          const testImg = testImages[i];
          if (testImg && !testImg.startsWith('http')) {
            const imageName = `test_images/${employeeData.employeeCode}_${new Date().getTime()}_${i}.jpg`;
            const testImgRef = storage().ref(imageName);
            
            // Upload the image
            await testImgRef.putFile(testImg);
            
            // Get the URL
            const imgUrl = await testImgRef.getDownloadURL();
            uploadedTestImages.push(imgUrl);
          } else if (testImg) {
            // If already a URL, just add it to the array
            uploadedTestImages.push(testImg);
          }
        }
      }
      
      // Data to be saved
      const inspectionData = {
        employeeDetails: {
          name: employeeData.name,
          employeeCode: employeeData.employeeCode,
          photoUrl: photoUrl,
          testDate: firestore.Timestamp.now(),
        },
        testResults: {
          timeScore: parseFloat(timeScore.toFixed(1)),
          accuracyScore: parseFloat(accuracyScore.toFixed(1)),
          speedScore: parseFloat(speedScore.toFixed(1)),
          overallScore: overallScore,
          performanceRating: getPerformanceRating(overallScore),
          totalSteps: totalSteps,
          stepsMisplaced: stepsMisplaced,
          timeSaved: parseFloat((60 - timeUsed).toFixed(1)),
          avgTimePerStep: parseFloat(avgTimePerStep.toFixed(1)),
          completionTime: completionTime
        },
        timestamp: firestore.Timestamp.now(),
        testImageUrls: uploadedTestImages.length > 0 ? uploadedTestImages : testImages || []
      };
      
      // Add the document to Firestore
      await inspectionRef.add(inspectionData);
      
      setSaved(true);
      setSaving(false);
      Alert.alert(
        "Success", 
        "Inspection results saved successfully.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error saving inspection results:", error);
      setSaving(false);
      Alert.alert(
        "Error", 
        "Failed to save inspection results. Please try again.",
        [{ text: "OK" }]
      );
    }
  };
  
  useEffect(() => {
    // Animate the score displays
    Animated.parallel([
      Animated.timing(scoreAnimation, {
        toValue: timeScore,
        duration: 1500,
        useNativeDriver: false
      }),
      Animated.timing(accuracyAnimation, {
        toValue: accuracyScore,
        duration: 1500,
        useNativeDriver: false
      }),
      Animated.timing(speedAnimation, {
        toValue: speedScore,
        duration: 1500,
        useNativeDriver: false
      }),
      Animated.timing(overallScoreAnimation, {
        toValue: overallScore,
        duration: 2000,
        useNativeDriver: false
      })
    ]).start();
  }, []);
  
  const playAgain = () => {
    // Navigate back to game screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'MixMatchGame' }
        ],
      })
    );
  };
  
  const goToHome = () => {
    // Navigate to home screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Home' }
        ],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Results Summary</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.employeeInfo}>
        <View style={styles.photoContainer}>
          <Image
            source={{uri: employeePhotoUrl || employeeData.photo}}
            style={styles.employeePhoto}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.employeeInfoText}>Name: {employeeData.name}</Text>
        <Text style={styles.employeeInfoText}>
          Employee Code: {employeeData.employeeCode}
        </Text>
        <Text style={styles.employeeInfoText}>
          Test Date: {employeeData.testDate.toDateString()}
        </Text>
      </View>

      {/* Performance Overview */}
      <View style={styles.overallScoreContainer}>
        <Text style={styles.overallScoreLabel}>Your Performance</Text>
        <Animated.Text style={styles.overallScoreValue}>
          {overallScoreAnimation.interpolate({
            inputRange: [0, overallScore],
            outputRange: ['0', overallScore.toString()]
          })}%
        </Animated.Text>
        <Text style={styles.ratingText}>{getPerformanceRating(overallScore)}</Text>
      </View>
      
      {/* Detailed Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Time Efficiency</Text>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  width: scoreAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: '#9C27B0' // Violet
                }
              ]} 
            />
          </View>
          <Animated.Text style={styles.metricValue}>
            {scoreAnimation.interpolate({
              inputRange: [0, timeScore],
              outputRange: ['0', timeScore.toFixed(1).toString()]
            })}%
          </Animated.Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Accuracy</Text>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  width: accuracyAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: '#4CAF50' // Green
                }
              ]} 
            />
          </View>
          <Animated.Text style={styles.metricValue}>
            {accuracyAnimation.interpolate({
              inputRange: [0, accuracyScore],
              outputRange: ['0', accuracyScore.toFixed(1).toString()]
            })}%
          </Animated.Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Speed</Text>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  width: speedAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: '#2196F3' // Blue
                }
              ]} 
            />
          </View>
          <Animated.Text style={styles.metricValue}>
            {speedAnimation.interpolate({
              inputRange: [0, speedScore],
              outputRange: ['0', speedScore.toFixed(1).toString()]
            })}%
          </Animated.Text>
        </View>
      </View>
      
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalSteps}</Text>
          <Text style={styles.statLabel}>Total Steps</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stepsMisplaced}</Text>
          <Text style={styles.statLabel}>Misplacements</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(60 - timeUsed).toFixed(1)}s</Text>
          <Text style={styles.statLabel}>Time Saved</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(avgTimePerStep).toFixed(1)}s</Text>
          <Text style={styles.statLabel}>Avg Time/Step</Text>
        </View>
      </View>
      
      {/* Performance Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Performance History</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={180}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#9C27B0"
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>
      
      {/* Save Results Button */}
      <TouchableOpacity 
        style={[
          styles.saveButton, 
          (isSaving || isSaved) && styles.disabledButton
        ]} 
        onPress={saveInspectionResults}
        disabled={isSaving || isSaved}
      >
        <Text style={styles.buttonText}>
          {isSaving ? "Saving..." : isSaved ? "Saved ✓" : "Save Results"}
        </Text>
      </TouchableOpacity>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.homeButton]} 
          onPress={goToHome}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.playAgainButton]} 
          onPress={playAgain}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  overallScoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  overallScoreLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  overallScoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#9C27B0", // Violet to match game theme
  },
  ratingText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginTop: 5,
  },
  metricsContainer: {
    marginVertical: 15,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: "#555",
    width: "25%",
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  progressFill: {
    height: "100%",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: "15%",
    textAlign: "right",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  statItem: {
    alignItems: "center",
    width: "24%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9C27B0", // Violet
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  chartContainer: {
    marginVertical: 15,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    borderRadius: 8,
    paddingRight: 20,
  },
  saveButton: {
    backgroundColor: "#FF9800", // Orange
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD", // Gray when disabled
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#757575", // Gray
  },
  playAgainButton: {
    backgroundColor: "#9C27B0", // Violet
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  employeeInfo: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  photoContainer: {
    marginRight: 15,
  },
  employeePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  employeeInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ResultsScreen;