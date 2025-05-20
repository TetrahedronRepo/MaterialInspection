import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import UserProfile from '../components/common/UserProfile';
import Button from '../components/common/Button';

import { useTest } from '../context/TestContext';
import { useFocusEffect } from '@react-navigation/native';
import { downloadCertificate, shareViaEmail } from '../utils/certificateUtils';

const EmployeeResultCard = ({result}) => {
  // Check if timestamp exists and convert it to a Date object
  const date = result.timestamp
    ? new Date(result.timestamp.toDate())
    : new Date();

  // Extract employee details from the nested structure
  const employeeDetails = result.employeeDetails || {};
  const testResults = result.testResults || {};
  
  // Calculate the color based on the score
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Green for high scores
    if (score >= 60) return '#2196F3'; // Blue for medium scores
    if (score >= 40) return '#FF9800'; // Orange for low-medium scores
    return '#F44336'; // Red for low scores
  };
  
  // Get performance rating text and color
  const performanceRating = testResults.performanceRating || 'N/A';
  const getRatingColor = (rating) => {
    switch(rating) {
      case 'Outstanding': return '#4CAF50';
      case 'Excellent': return '#8BC34A';
      case 'Very Good': return '#03A9F4';
      case 'Good': return '#2196F3';
      case 'Average': return '#FF9800';
      case 'Fair': return '#FB8C00';
      case 'Needs Improvement': return '#F44336';
      default: return '#757575';
    }
  };
  
  const handleDownload = () => {
    downloadCertificate(result);
  };

  const handleEmailShare = () => {
    shareViaEmail(result);
  };

  return (
    <View style={styles.card}>
      {/* Employee Header with Photo */}
      <View style={styles.cardHeader}>
        <View style={styles.employeeInfoContainer}>
          {employeeDetails.photoUrl ? (
            <Image 
              source={{uri: employeeDetails.photoUrl}} 
              style={styles.employeePhoto} 
            />
          ) : (
            <View style={[styles.employeePhoto, styles.noPhotoPlaceholder]}>
              <Text style={styles.photoPlaceholderText}>
                {(employeeDetails.name || '').substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{employeeDetails.name || 'Unknown'}</Text>
            <Text style={styles.employeeId}>ID: {employeeDetails.employeeCode || 'N/A'}</Text>
            <Text style={styles.timestamp}>{date.toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={[styles.ratingBadge, {backgroundColor: getRatingColor(performanceRating)}]}>
          <Text style={styles.ratingText}>{performanceRating}</Text>
        </View>
      </View>
      
      {/* Overall Score */}
      <View style={styles.overallScoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreCircleValue}>{testResults.overallScore || 0}</Text>
          <Text style={styles.scoreCircleLabel}>Overall</Text>
        </View>
      </View>
      
      {/* Metrics with Progress Bars */}
      <View style={styles.metricsContainer}>
        {/* Time Efficiency */}
        <View style={styles.metricItem}>
          <View style={styles.metricLabelContainer}>
            <Text style={styles.metricLabel}>Time</Text>
            <Text style={styles.metricValue}>{testResults.timeScore || 0}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${testResults.timeScore || 0}%`,
                    backgroundColor: getScoreColor(testResults.timeScore || 0)
                  }
                ]} 
              />
            </View>
          </View>
        </View>
        
        {/* Accuracy */}
        <View style={styles.metricItem}>
          <View style={styles.metricLabelContainer}>
            <Text style={styles.metricLabel}>Accuracy</Text>
            <Text style={styles.metricValue}>{testResults.accuracyScore || 0}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${testResults.accuracyScore || 0}%`,
                    backgroundColor: getScoreColor(testResults.accuracyScore || 0)
                  }
                ]} 
              />
            </View>
          </View>
        </View>
        
        {/* Speed */}
        <View style={styles.metricItem}>
          <View style={styles.metricLabelContainer}>
            <Text style={styles.metricLabel}>Speed</Text>
            <Text style={styles.metricValue}>{testResults.speedScore || 0}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${testResults.speedScore || 0}%`,
                    backgroundColor: getScoreColor(testResults.speedScore || 0)
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
      
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{testResults.totalSteps || 0}</Text>
          <Text style={styles.statLabel}>Steps</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{testResults.stepsMisplaced || 0}</Text>
          <Text style={styles.statLabel}>Misplacements</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{testResults.timeSaved?.toFixed(1) || '0.0'}s</Text>
          <Text style={styles.statLabel}>Time Saved</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{testResults.avgTimePerStep?.toFixed(1) || '0.0'}s</Text>
          <Text style={styles.statLabel}>Sec/Step</Text>
        </View>
      </View>
      
      {/* Action Buttons */}
      {/* <View style={styles.actions}>
        <Button
          title="Download Certificate"
          onPress={handleDownload}
          style={[styles.actionButton, styles.downloadButton]}
          icon="download"
        />
        <Button
          title="Share via Email"
          onPress={handleEmailShare}
          style={[styles.actionButton, styles.shareButton]}
          icon="mail"
        />
      </View> */}
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [employeeResults, setEmployeeResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => { 
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        try {
          // Fetch user profile data
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();

          if (userDoc.exists) {
            setUserData(userDoc.data());
          }
        } catch (userError) {
          console.log('Error getting user data:', userError);
          // Continue even if user profile fetch fails
        }
      }

      // Fetch employee test results
      try {
        const resultsSnapshot = await firestore()
          .collection('IncomingMaterialInspection')
          .orderBy('timestamp', 'desc')
          .get();

        if (resultsSnapshot.empty) {
          console.log('No employee results found');
          setEmployeeResults([]);
          setFilteredResults([]);
        } else {
          const fetchedResults = resultsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('Fetched results:', fetchedResults.length);
          setEmployeeResults(fetchedResults);
          setFilteredResults(fetchedResults);
        }
      } catch (firestoreError) {
        console.log('Error accessing employees collection:', firestoreError);
        setError('Failed to load employee data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults(employeeResults);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = employeeResults.filter((result) => {
        const employeeDetails = result.employeeDetails || {};
        const employeeName = (employeeDetails.name || '').toLowerCase();
        const employeeId = (employeeDetails.employeeCode || '').toLowerCase();
        
        return employeeName.includes(query) || employeeId.includes(query);
      });
      setFilteredResults(filtered);
    }
  }, [searchQuery, employeeResults]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        // Clean up if needed
      };
    }, [])
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Incoming Material Inspection</Text>
        {userData && <UserProfile userData={userData} />}
      </View>

      <View style={styles.content}>
        <View style={styles.resultsHeaderContainer}>
          <Text style={styles.resultsHeader}>Employee Test Results</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Employee ID or Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {error ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : filteredResults.length > 0 ? (
          <FlatList
            data={filteredResults}
            keyExtractor={item => item.id}
            renderItem={({item}) => <EmployeeResultCard result={item} />}
            style={styles.resultsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6200ee']}
              />
            }
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            {searchQuery.length > 0 ? (
              <Text style={styles.noResultsText}>
                No results found for "{searchQuery}"
              </Text>
            ) : (
              <>
                <Text style={styles.noResultsText}>
                  No employee test results found.
                </Text>
                <Text style={styles.subText}>
                  Complete a test to see results here.
                </Text>
              </>
            )}
          </View>
        )}
                <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.takeTestButton}
            onPress={() => {
              navigation.navigate('Form');
            }}>
            <Text style={styles.takeTestButtonText}>START TEST</Text>
          </TouchableOpacity>
        </View>

      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  contentCenter: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#9C27B0',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  buttons: {
    width: '100%',
  },
  takeTestButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
  },
  takeTestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    height: 46,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsList: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  cardContent: {
    gap: 8,
    marginBottom: 10,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  employeeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  noPhotoPlaceholder: {
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  employeeDetails: {
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  employeeId: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overallScoreContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  scoreCircleValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreCircleLabel: {
    color: 'white',
    fontSize: 12,
  },
  metricsContainer: {
    marginVertical: 10,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabelContainer: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#555',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  downloadButton: {
    backgroundColor: '#673AB7',
  },
  shareButton: {
    backgroundColor: '#00BCD4',
  },
});

export default HomeScreen;