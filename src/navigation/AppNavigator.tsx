import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import InspectionScreen from "../screens/InspectionScreen";
import MixMatchGameScreen from "../screens/MixMatchGameScreen";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import EmployeeDetailsScreen from "../screens/EmployeeDetailsScreen";
import InstructionsScreen from "../screens/InstructionsScreen";
import ResultsScreen from "../screens/ResultScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Form" component={EmployeeDetailsScreen} />
        <Stack.Screen name="Intructions" component={InstructionsScreen} />
        <Stack.Screen name="Inspection" component={InspectionScreen} />
        <Stack.Screen name="MixMatchGame" component={MixMatchGameScreen} />
        <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
      </Stack.Navigator>
  );
};

export default AppNavigator;
