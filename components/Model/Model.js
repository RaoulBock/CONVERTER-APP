import React, { useRef, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";

const windowHeight = Dimensions.get("window").height;

const Models = ({ visible, onClose, children, customHeight }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const abortController = React.useRef(new AbortController()).current;

  React.useEffect(() => {
    return () => {
      // Clean up: cancel ongoing requests when unmounting the component
      abortController.abort();
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        if (gesture.dy > 0) {
          Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(
            e,
            gesture
          );
        }
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dy > 100) {
          console.log("Request cancellation initiated");
          abortController.abort(); // Cancel ongoing requests
          onClose();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.modalContent,
            { height: customHeight || windowHeight * 0.5 },
            { transform: [{ translateY: pan.y }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#1d1d1dab",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 8,
    elevation: 5,
  },
  searchInput: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  countryItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  countryItem: {
    fontSize: 16,
    fontWeight: "bold",
  },
  countryCode: {
    fontSize: 16,
    color: "#666",
  },
  closeButton: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Models;
