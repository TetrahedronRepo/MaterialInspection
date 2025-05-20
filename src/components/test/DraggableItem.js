import React, { useRef, useEffect } from 'react';
import { Animated, Image, StyleSheet, PanResponder } from 'react-native';

const DraggableItem = ({ id, image, beingDragged, dropped, onDrag, onDragRelease }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const itemPosition = useRef({ x: 0, y: 0 });
  const initialPosition = useRef(null);
  
  // Reset animation when component mounts or when dropped state changes
  useEffect(() => {
    if (!dropped) {
      // Reset to initial position with a smooth animation
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        bounciness: 8
      }).start();
    }
  }, [dropped]);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !dropped,
      onMoveShouldSetPanResponder: () => !dropped,
      
      onPanResponderGrant: () => {
        // Store current position and set offset
        initialPosition.current = { x: pan.x._value, y: pan.y._value };
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
        pan.setValue({ x: 0, y: 0 });
        onDrag(id, true);
      },
      
      onPanResponderMove: (evt, gestureState) => {
        // Update current position for drop detection
        itemPosition.current = {
          x: gestureState.moveX,
          y: gestureState.moveY
        };
        
        // Update animated position
        Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        )(evt, gestureState);
      },
      
      onPanResponderRelease: () => {
        // Flatten offsets
        pan.flattenOffset();
        onDrag(id, false);
        
        // Call parent's callback with the item's current position
        if (onDragRelease) {
          onDragRelease(id, itemPosition.current);
        }
        
        // Always animate back to origin if not dropped
        if (!dropped) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 40,
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;
  

  // Don't render if dropped
  if (dropped) {
    return null;
  }
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: beingDragged ? 999 : 1,
          elevation: beingDragged ? 10 : 3,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={image} style={styles.image} resizeMode="cover" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: '50%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row'
    
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 5,
  },
});

export default DraggableItem;