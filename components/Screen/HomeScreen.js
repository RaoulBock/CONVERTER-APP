import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
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

  const _retakePicture = () => {
    setCapturedImage(null);
  };

  const OPTIONS = [
    {
      name: "PICTURE",
      icon: APP_ICONS.CAMERA,
    },
  ];

  const onPinchGestureEvent = (event) => {
    const scale = event.nativeEvent.scale;
    const newZoom = Math.max(0, Math.min(1, zoom + (scale - 1) * 0.05));
    setZoom(newZoom);
  };

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
              <ScrollView horizontal>
                {OPTIONS.map((e, i) => {
                  return (
                    <Button
                      key={i}
                      title={e.icon}
                      style={styles.cambutton}
                      onPress={_takePicture}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </CameraView>
        </PinchGestureHandler>
      )}
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
    bottom: 0,
    alignSelf: "center",
  },
  cambutton: {
    width: 70,
    height: 70,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 500,
    backgroundColor: COLORS.WHITE,
    borderWidth: 6,
    borderColor: "#d9d9d9",
    marginHorizontal: 6,
  },
  message: {
    marginVertical: 10,
  },
});
