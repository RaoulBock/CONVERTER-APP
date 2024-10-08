import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import Button from "../Button/Button";
import { APP_ICONS, COLORS } from "../../context/Settings";

const HomeScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const facing = "back";
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [selectedOption, setSelectedOption] = useState("Search");

  if (!permission) {
    return (
      <View style={styles.outline}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.outline}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const _takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      setCapturedImage(photo.uri);
    }
  };

  const onPinchGestureEvent = (event) => {
    const scale = event.nativeEvent.scale;
    const newZoom = Math.max(0, Math.min(1, zoom + (scale - 1) * 0.05));
    setZoom(newZoom);
  };

  const OPTIONS = [
    {
      name: "Translate",
      icon: APP_ICONS.TRANSLATE,
    },
    {
      name: "Search",
      icon: APP_ICONS.SEARCH,
    },
    {
      name: "Homework",
      icon: APP_ICONS.HOMEWORK,
    },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
      {!capturedImage && (
        <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
          <CameraView
            style={styles.camera}
            facing={facing}
            zoom={zoom}
            ref={cameraRef}
          >
            <View style={[styles.buttonContainer]}>
              <Button
                title={OPTIONS.find((opt) => opt.name === selectedOption).icon}
                style={styles.cambutton}
                onPress={_takePicture}
              />
            </View>
          </CameraView>
        </PinchGestureHandler>
      )}
      <View style={styles.extraOptions}>
        {OPTIONS.map((option, index) => {
          const isSelected = selectedOption === option.name;
          return (
            <TouchableOpacity
              style={[styles.textOption, isSelected && styles.selectedOption]}
              key={index}
              onPress={() => setSelectedOption(option.name)}
            >
              <Text style={[styles.text, isSelected && styles.selectedText]}>
                {option.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  outline: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  cambutton: {
    width: 70,
    height: 70,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 500,
    backgroundColor: COLORS.WHITE,
    borderWidth: 4,
    borderColor: "#d9d9d9",
    marginHorizontal: 6,
  },
  message: {
    marginVertical: 10,
  },
  extraOptions: {
    backgroundColor: "#000",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  text: {
    color: "white",
    fontWeight: "500",
  },
  selectedText: {
    color: "black",
  },
  textOption: {
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    padding: 10,
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: COLORS.MAIN_BACKGROUND,
  },
});
