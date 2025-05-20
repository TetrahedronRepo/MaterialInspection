import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const DropBox = ({ id, label, containsItem, isCorrectDrop, itemImage, layout, onDropInteraction }) => {
  // Store the box's position and dimensions for drop detection
  const boxRef = useRef(null);
  const boxLayout = useRef(null);

  useEffect(() => {
    // If we have a ref to the box and the layout isn't yet measured
    if (boxRef.current && !boxLayout.current) {
      // Measure the box layout
      boxRef.current.measure((x, y, width, height, pageX, pageY) => {
        boxLayout.current = {
          x,
          y,
          x: pageX,
          y: pageY,
          width,
          height
        };
        // Send layout information to parent
        if (onDropInteraction) {
          onDropInteraction({ id, type: 'setLayout', layout: boxLayout.current });
        }
      });
    }
  }, [id, onDropInteraction]);

  // Determine box style based on whether it contains an item and if the drop was correct
  const getBoxStyle = () => {
    if (!containsItem) return styles.empty;
    return isCorrectDrop ? styles.correct : styles.incorrect;
  };

  return (
    <View
      ref={boxRef}
      style={[
        styles.container,
        getBoxStyle(),
      ]}
    >
      {containsItem ? (
        <Image source={itemImage} style={styles.image} resizeMode="contain" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    height: '70%',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    overflow: 'hidden',
  },
  empty: {
    borderColor: '#888',
    borderStyle: 'dashed',
  },
  correct: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
    backgroundColor: '#E8F5E9',
  },
  incorrect: {
    borderColor: '#F44336',
    borderStyle: 'solid',
    backgroundColor: '#FFEBEE',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default DropBox;