import { Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Mailer from 'react-native-mail';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid } from 'react-native';

// Helper function to request storage permission
export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;
  
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "App needs access to your storage to download files",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

// Helper function to calculate percentage
export const calculatePercentage = (score) => {
  // Assuming each test has a maximum score of 100
  return Math.round((score / 20) * 100);
};

// Helper function to get performance band label based on score
export const getBandLabel = (percentage) => {
  let className, label;
  
  if (percentage >= 90) {
    className = "excellent";
    label = "Level 1";
  } else if (percentage >= 75) {
    className = "good";
    label = "Level 2";
  } else if (percentage >= 60) {
    className = "average";
    label = "Level 3";
  } else if (percentage >= 40) {
    className = "below-average";
    label = "Level 4";
  } else {
    className = "poor";
    label = "poor";
  }
  
  return `<span class="score-band ${className}">${label}</span>`;
};

// Function to generate certificate HTML
export const generateCertificateHTML = (resultData, date) => {
  const formattedDate = date.toISOString().split('T')[0];
  const totalScore = (resultData.testResults?.machineDefect || 0) + 
                      (resultData.testResults?.castingDefect || 0) + 
                      (resultData.testResults?.paintDefect || 0);
  
  // Calculate total percentage (assuming all tests sum to 300 max)
  const totalPercentage = Math.round((totalScore / 60) * 100);
  const employeePhoto = resultData.employeeInfo?.photoUrl || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Test Results Certificate</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 0;
          margin: 0;
        }
        .certificate {
          width: 100%;
          max-width: 800px;
          margin:0 auto;
          padding: 30px;
          box-sizing: border-box;
          border: 2px solid #1e3a8a;
          position: relative;
        }
        .certificate-header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 1px solid #1e3a8a;
          padding-bottom: 10px;
        }
        .company-name {
          font-size: 32px;
          font-weight: bold;
          color: #1e3a8a;
          margin: 0;
        }
        .certificate-title {
          font-size: 28px;
          font-weight: bold;
          margin: 16px 0;
          color: #1e3a8a;
          text-align: center;
        }
        .employee-details {
          margin: 20px 0;
          padding: 14px;
          background-color: #f7f7f7;
          border-radius: 5px;
        }
        .employee-name {
          font:italic
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        .employee-code {
          font-size: 18px;
          color: #555;
        }
        .test-date {
          font-size: 16px;
          color: #555;
          margin-top: 5px;
        }
        .results-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        .results-table th, .results-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .results-table th {
          background-color: #1e3a8a;
          color: white;
          font-weight: bold;
        }
        .results-table tr:nth-child(even) {
          background-color: #f2f6fc;
        }
        .total-score {
          background-color: #e8f5e9;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
        .total-score span {
          color: #2e7d32;
          font-size: 24px;
        }
        .certificate-footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #ccc;
          padding-top: 20px;
        }
        .signature {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }
        .signature-line {
          width: 200px;
          border-top: 1px solid #000;
          margin-top: 10px;
          text-align: center;
        }
        .score-band {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: bold;
          margin-left: 10px;
        }
        .excellent {
          background-color: #4CAF50;
          color: white;
        }
        .good {
          background-color: #8BC34A;
          color: white;
        }
        .average {
          background-color: #FFC107;
          color: black;
        }
        .below-average {
          background-color: #FF9800;
          color: black;
        }
        .poor {
          background-color: #F44336;
          color: white;
        }
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          color: rgba(200, 200, 200, 0.2);
          z-index: -1;
          font-weight: bold;
        }
        .desc {
          display:flex;
          justify-content: center;
          text-align: center;
          font-size: 18px;
          color: #333;
          margin: 20px 0;
          padding: 15px;
        }
        .desc p {
          text-align: center;
          margin-bottom: 15px;
          font-weight: 500;
          line-height: 1.5;
        }
        .desc img {
          width: 120px;
          height: 120px;
          display: block;
          margin: 20px auto;
          box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="watermark">ENDURANCE</div>
        <div class="certificate-header">
          <h1 class="company-name">ENDURANCE DOJO</h1>
          <p>Excellence in Defect Detection Training</p>
          </div>
          <h2 class="certificate-title">Defect Detection Proficiency Certificate</h2>
          
          
        <div class="desc">
        <p>This is to certify that Name <span class="employee-name"> ${resultData.employeeName}</span>,Employee ID <span class="employee-name"> ${resultData.employeeId}</span>, has successfully completed the Defect Detection Assessment on ${formattedDate}, achieving the following results:</p>
        <img src="${resultData.employeeInfo?.photoUrl || ''}" alt="Employee Photo"> 
        </div>        
        
        <table class="results-table">
          <thead>
            <tr>
              <th>Assessment Area</th>
              <th>Score</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Machine Defect Detection</td>
              <td>${resultData.testResults?.machineDefect || 0}/20</td>
              <td>
                ${getBandLabel(calculatePercentage(resultData.testResults?.machineDefect || 0))}
              </td>
            </tr>
            <tr>
              <td>Casting Defect Detection</td>
              <td>${resultData.testResults?.castingDefect || 0}/20</td>
              <td>
                ${getBandLabel(calculatePercentage(resultData.testResults?.castingDefect || 0))}
              </td>
            </tr>
            <tr>
              <td>Paint Defect Detection</td>
              <td>${resultData.testResults?.paintDefect || 0}/20</td>
              <td>
                ${getBandLabel(calculatePercentage(resultData.testResults?.paintDefect || 0))}
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="total-score">
          Overall Performance: <span>${totalPercentage}%</span>
          ${getBandLabel(totalPercentage)}
        </div>
        
        <div class="signature">
          <div>
            <div class="signature-line">Examiner Signature</div>
          </div>
          <div>
            <div class="signature-line">Training Director</div>
          </div>
        </div>
        
        <div class="certificate-footer">
          <p>This certificate validates the employee's proficiency in identifying various manufacturing defects.</p>
          <p>Endurance Dojo • Quality Assurance Division • Certificate ID: ED-${formattedDate}-${resultData.employeeId}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to download certificate
export const downloadCertificate = async (result) => {
  try {
    // Check for permissions on Android
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Storage permission is needed to save the file');
      return;
    }
    
    const date = result.timestamp ? new Date(result.timestamp.toDate()) : new Date();
    
    // Define file paths based on platform
    let downloadPath;
    let fileName = `${result.employeeId}_TestResult.pdf`;
    
    if (Platform.OS === 'ios') {
      downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    } else {
      // For Android, use the Downloads directory
      downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    }
    
    // Generate PDF document
    const pdfOptions = {
      html: generateCertificateHTML(result, date),
      fileName: fileName,
      directory: Platform.OS === 'ios' ? 'Documents' : 'Download',
      width: 612,
      height: 792,
      base64: false,
    };
    
    console.log('Attempting to generate PDF with options:', pdfOptions);
    const pdf = await RNHTMLtoPDF.convert(pdfOptions);
    console.log('PDF generation result:', pdf);
    
    if (!pdf || !pdf.filePath) {
      throw new Error('PDF generation failed - no file path returned');
    }
    
    // For Android, we may need to copy the file to ensure it's properly saved in Downloads
    if (Platform.OS === 'android') {
      // Check if the file exists at the generated path
      const fileExists = await RNFS.exists(pdf.filePath);
      console.log('File exists at original path:', fileExists);
      
      if (fileExists) {
        // Copy the file to the Downloads directory to ensure it's visible to the user
        await RNFS.copyFile(pdf.filePath, downloadPath);
        console.log('File copied to:', downloadPath);
        
        // Make the file visible in the Downloads folder for Android
        if (Platform.Version >= 29) { // Android 10 and above
          await RNFS.scanFile(downloadPath);
        }
      } else {
        throw new Error('Generated PDF file not found at expected path');
      }
    }
    
    // Verify the file exists at the final path
    const finalFileExists = await RNFS.exists(Platform.OS === 'android' ? downloadPath : pdf.filePath);
    console.log('Final file exists:', finalFileExists);
    
    if (finalFileExists) {
      Alert.alert(
        'Success', 
        `Certificate saved as ${fileName} in ${Platform.OS === 'ios' ? 'Documents' : 'Download'} folder`
      );
      return true;
    } else {
      throw new Error('Could not verify file was saved successfully');
    }
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Failed to download results: ' + error.message);
    return false;
  }
};

// Function to share certificate via email
export const shareViaEmail = async (result) => {
  try {
    const date = result.timestamp ? new Date(result.timestamp.toDate()) : new Date();
    
    // Generate PDF document
    const fileName = `${result.employeeId}TestResult.pdf`;
    const pdfOptions = {
      html: generateCertificateHTML(result, date),
      fileName: fileName,
      directory: 'Cache',
      width: 792,
      height: 612,
      base64: false,
    };
    
    const pdf = await RNHTMLtoPDF.convert(pdfOptions);
    
    // Send email
    Mailer.mail({
      subject: `Defect Detection Test Results for ${result.employeeName}`,
      body: `Please find attached the test results certificate for ${result.employeeName} (${result.employeeId})`,
      attachments: [{
        path: pdf.filePath,
        type: 'application/pdf',
        name: fileName,
      }],
      isHTML: false,
    }, (error, event) => {
      if (error) {
        Alert.alert('Error', 'Failed to send email: ' + error);
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Email error:', error);
    Alert.alert('Error', 'Failed to send email: ' + error.message);
    return false;
  }
};