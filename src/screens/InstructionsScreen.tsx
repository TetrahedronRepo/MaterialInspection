import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  SafeAreaView
} from "react-native";

const InstructionsScreen = ({ navigation }) => {
  const [language, setLanguage] = useState("english"); // "english" or "hindi"
  
  const toggleLanguage = () => {
    setLanguage(language === "english" ? "hindi" : "english");
  };
  
  const startGame = () => {
    navigation.navigate("Inspection");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {language === "english" ? "How to Play" : "खेलने का तरीका"}
        </Text>
        <TouchableOpacity 
          style={styles.languageToggle} 
          onPress={toggleLanguage}
        >
          <Text style={styles.languageToggleText}>
            {language === "english" ? "हिंदी में देखें" : "View in English"}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {language === "english" ? (
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Game Objective</Text>
                <Text style={styles.instructionText}>
                  Arrange all SOP (Standard Operating Procedure) steps in the correct sequence within the time limit of 60 seconds.
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Shuffled Steps</Text>
                <Text style={styles.instructionText}>
                  At the top section of the screen, you'll see all 12 steps shuffled in random order. These are the steps you need to arrange.
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Selecting Steps</Text>
                <Text style={styles.instructionText}>
                  Tap on a step in the top section to add it to the bottom section. The steps should be selected in the correct sequence from Step 1 to Step 12.
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Correct Placement</Text>
                <Text style={styles.instructionText}>
                  If you place a step in the correct position, its border will turn green. The game continues and you can select the next step.
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Incorrect Placement</Text>
                <Text style={styles.instructionText}>
                  If you place a step in the wrong position, the border will turn red, the device will vibrate, and a message will appear. The step will return to the available steps pool.
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Time Limit</Text>
                <Text style={styles.instructionText}>
                  You have 60 seconds to complete the sequence. The timer circle at the top right shows your remaining time. As time decreases, the timer color changes from green to orange to red.
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Performance Scoring</Text>
                <Text style={styles.instructionText}>
                  Your performance is scored based on time taken, accuracy (fewer misplacements), and speed (how quickly you place each step correctly).
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>Winning the Game</Text>
                <Text style={styles.instructionText}>
                  Successfully arrange all 12 steps in the correct order to win. You'll see a results screen with your performance statistics.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>खेल का उद्देश्य</Text>
                <Text style={styles.instructionText}>
                  60 सेकंड की समय सीमा के भीतर सभी एसओपी (स्टैंडर्ड ऑपरेटिंग प्रोसीजर) चरणों को सही क्रम में व्यवस्थित करें।
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>अव्यवस्थित चरण</Text>
                <Text style={styles.instructionText}>
                  स्क्रीन के ऊपरी हिस्से में, आपको सभी 12 चरण यादृच्छिक क्रम में मिल जाएंगे। इन्हें आपको व्यवस्थित करना है।
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>चरणों का चयन</Text>
                <Text style={styles.instructionText}>
                  ऊपरी भाग में किसी चरण पर टैप करके उसे नीचे के भाग में जोड़ें। चरणों को चरण 1 से चरण 12 तक सही क्रम में चुना जाना चाहिए।
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>सही स्थान पर रखना</Text>
                <Text style={styles.instructionText}>
                  यदि आप किसी चरण को सही स्थान पर रखते हैं, तो उसकी सीमा हरी हो जाएगी। खेल जारी रहता है और आप अगले चरण का चयन कर सकते हैं।
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>गलत स्थान पर रखना</Text>
                <Text style={styles.instructionText}>
                  यदि आप किसी चरण को गलत स्थान पर रखते हैं, तो सीमा लाल हो जाएगी, डिवाइस में कंपन होगा, और एक संदेश दिखाई देगा। चरण उपलब्ध चरणों के पूल में वापस आ जाएगा।
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>समय सीमा</Text>
                <Text style={styles.instructionText}>
                  आपके पास अनुक्रम को पूरा करने के लिए 60 सेकंड हैं। ऊपरी दाएं में टाइमर सर्कल आपका शेष समय दिखाता है। जैसे-जैसे समय कम होता है, टाइमर का रंग हरे से नारंगी और फिर लाल हो जाता है।
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>प्रदर्शन स्कोरिंग</Text>
                <Text style={styles.instructionText}>
                  आपके प्रदर्शन का मूल्यांकन लिए गए समय, सटीकता (कम गलतियां), और गति (आप प्रत्येक चरण को कितनी जल्दी सही ढंग से रखते हैं) के आधार पर किया जाता है।
                </Text>
              </View>
            </View>
            
            <View style={styles.instructionItem}>
              <View style={styles.iconContainer}>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>खेल जीतना</Text>
                <Text style={styles.instructionText}>
                  जीतने के लिए सभी 12 चरणों को सही क्रम में सफलतापूर्वक व्यवस्थित करें। आपको अपने प्रदर्शन के आंकड़ों के साथ एक परिणाम स्क्रीन दिखाई देगी।
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Example visualization */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>
            {language === "english" ? "Game Preview" : "गेम पूर्वावलोकन"}
          </Text>
          
          <View style={styles.exampleImageContainer}>
            <View style={styles.exampleSection}>
              <Text style={styles.exampleSectionTitle}>
                {language === "english" ? "Available Steps" : "उपलब्ध चरण"}
              </Text>
              <View style={styles.exampleStepsContainer}>
                <View style={styles.exampleCard}>
                  <Text style={styles.exampleCardText}>Step 4</Text>
                </View>
                <View style={styles.exampleCard}>
                  <Text style={styles.exampleCardText}>Step 2</Text>
                </View>
                <View style={styles.exampleCard}>
                  <Text style={styles.exampleCardText}>Step 5</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.exampleSection}>
              <Text style={styles.exampleSectionTitle}>
                {language === "english" ? "Selected Order" : "चयनित क्रम"}
              </Text>
              <View style={styles.exampleStepsContainer}>
                <View style={[styles.exampleCard, styles.correctCard]}>
                  <Text style={styles.exampleCardText}>Step 1</Text>
                </View>
                <View style={[styles.exampleCard, styles.correctCard]}>
                  <Text style={styles.exampleCardText}>Step 3</Text>
                </View>
                <View style={[styles.exampleCard, styles.incorrectCard]}>
                  <Text style={styles.exampleCardText}>Step 6</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>
            {language === "english" ? "Start Game" : "खेल शुरू करें"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#9C27B0",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  languageToggle: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageToggleText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  instructionsContainer: {
    padding: 15,
  },
  instructionItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  exampleContainer: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    textAlign: "center",
  },
  exampleImageContainer: {
    marginBottom: 10,
  },
  exampleSection: {
    marginBottom: 15,
  },
  exampleSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666666",
    marginBottom: 10,
  },
  exampleStepsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  exampleCard: {
    width: 80,
    height: 40,
    backgroundColor: "#9C27B0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  correctCard: {
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  incorrectCard: {
    borderWidth: 3,
    borderColor: "#F44336",
  },
  exampleCardText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  startButton: {
    backgroundColor: "#9C27B0",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default InstructionsScreen;