import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import EmployeeForm from '../components/employee/EmployeeForm';


const EmployeeDetailsScreen = ({ navigation }) => {
  const handleSubmit = () => {
    // Navigate to Instructions screen after successful form submission
    navigation.navigate('Intructions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Employee Details</Text>
      </View>
        <Text style={styles.headerSubtitle}>
          Please fill in your details before starting the defect test
        </Text>
      <View style={styles.formContainer}>
        <EmployeeForm onSubmit={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  },
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
  },
  headerTitle: {
    textAlign:"center",
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  headerSubtitle: {
    textAlign:"center",
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default EmployeeDetailsScreen;