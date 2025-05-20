import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TestProvider } from "./src/context/TestContext";
import { NavigationContainer } from "@react-navigation/native";


const App = () => {
  return (
    <SafeAreaProvider>
      <TestProvider>
        <NavigationContainer>
          <AppNavigator/>
        </NavigationContainer>
      </TestProvider>
    </SafeAreaProvider>
  )
};

export default App;
