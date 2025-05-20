// import React, { createContext, useState, useContext } from 'react';

// const TestContext = createContext();

// export const useTest = () => useContext(TestContext);

// export const TestProvider = ({ children }) => {
//   const [employeeData, setEmployeeData] = useState({
//     name: '',
//     employeeCode: '',
//     testDate: new Date(),
//     photo: null,
//   });
  
//   const [testScores, setTestScores] = useState({
//     machineDefect: 0,
//     castingDefect: 0,
//     paintDefect: 0,
//   });
  
//   const [testCompleted, setTestCompleted] = useState({
//     machineDefect: false,
//     castingDefect: false,
//     paintDefect: false,
//   });
  
//   const updateEmployeeData = (data) => {
//     setEmployeeData({ ...employeeData, ...data });
//   };
  
//   const updateTestScore = (testType, score) => {
//     let scoreKey;
  
//     // Convert test type string to the correct key
//     if (testType === "Machine Defect") {
//       scoreKey = "machineDefect";
//     } else if (testType === "Casting Defect") {
//       scoreKey = "castingDefect";
//     } else if (testType === "Paint Defect") {
//       scoreKey = "paintDefect";
//     } else {
//       // If no match, use the testType as is
//       scoreKey = testType;
//     }
    
//     // Fixed: Using scoreKey instead of testType here
//     setTestScores({ ...testScores, [scoreKey]: score });
//     setTestCompleted({ ...testCompleted, [scoreKey]: true });
//   };
  
//   const resetTest = () => {
//     setTestScores({
//       machineDefect: 0,
//       castingDefect: 0,
//       paintDefect: 0,
//     });
//     setTestCompleted({
//       machineDefect: false,
//       castingDefect: false,
//       paintDefect: false,
//     });
//   };
  
//   return (
//     <TestContext.Provider
//       value={{
//         employeeData,
//         updateEmployeeData,
//         testScores,
//         updateTestScore,
//         testCompleted,
//         resetTest,
//       }}
//     >
//       {children}
//     </TestContext.Provider>
//   );
// };

import React, { createContext, useState, useContext } from 'react';

const TestContext = createContext();

export const useTest = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    employeeCode: '',
    testDate: new Date(),
    photo: null,
  });
  
  const [testScores, setTestScores] = useState({
    machineDefect: 0,
    castingDefect: 0,
    paintDefect: 0,
  });
  
  const [testCompleted, setTestCompleted] = useState({
    machineDefect: false,
    castingDefect: false,
    paintDefect: false,
  });
  
  // Add a new state to track the current test type
  const [currentTestType, setCurrentTestType] = useState(null);
  
  const updateEmployeeData = (data) => {
    setEmployeeData({ ...employeeData, ...data });
  };
  
  const updateTestScore = (testType, score) => {
    let scoreKey;
  
    // Convert test type string to the correct key
    if (testType === "Machine Defect") {
      scoreKey = "machineDefect";
    } else if (testType === "Casting Defect") {
      scoreKey = "castingDefect";
    } else if (testType === "Paint Defect") {
      scoreKey = "paintDefect";
    } else {
      // If no match, use the testType as is
      scoreKey = testType;
    }
    
    // Fixed: Using scoreKey instead of testType here
    setTestScores({ ...testScores, [scoreKey]: score });
    setTestCompleted({ ...testCompleted, [scoreKey]: true });
  };
  
  // Add a new function to update the current test type
  const setTestType = (testType) => {
    setCurrentTestType(testType);
  };
  
  const resetTest = () => {
    setTestScores({
      machineDefect: 0,
      castingDefect: 0,
      paintDefect: 0,
    });
    setTestCompleted({
      machineDefect: false,
      castingDefect: false,
      paintDefect: false,
    });
  };
  
  return (
    <TestContext.Provider
      value={{
        employeeData,
        updateEmployeeData,
        testScores,
        updateTestScore,
        testCompleted,
        resetTest,
        currentTestType,
        setTestType,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};