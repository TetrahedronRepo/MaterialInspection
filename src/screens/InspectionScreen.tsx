import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";

const steps = [
  "Step 1: Receive Material at Inspection Area",
  "Step 2: Visual Inspection",
  "Step 3: Compare Against Standards",
  "Step 4: Sampling and Quality Control Testing",
  "Step 5: Labeling and Storage of Accepted Materials",
  "Step 6: Reporting and Documentation",
  "Step 7: Continuous Improvement & Feedback",
  "Step 8: Approve or Reject Material",
];

const InspectionScreen = ({ navigation }) => {  


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SOP for Incoming Material Inspection</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.boxContainer}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={index}
              style={styles.box}
              onPress={() => {
                // Handle step selection if needed
              }}
            >
              <Text style={styles.boxText}>{step}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MixMatchGame")}
      >
        <Text style={styles.buttonText}>Go to Mix-Match Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "##9C27B0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#9C27B0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9C27B0",
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
  scrollContainer: {
    paddingBottom: 20,
  },
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems:'center',
    justifyContent: "space-between",
  },
  box: {
    width: '40%',
    height: '20%',
    backgroundColor: "#a37cf0",
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  boxText: {
    fontSize: 16,
    fontWeight:'bold',
    textAlign: "center",
    color: "#fff",
  },
  button: {
    backgroundColor: "#9C27B0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InspectionScreen;