import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import React, { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";

import Button from "../Button/Button";
import { APP_ICONS, APP_PAGES, COLORS } from "../../context/Settings";
import Models from "../Model/Model";
import PermissionScreen from "./PermissionScreen";
import { performOCR } from "../../utils/helpers";
import ResultView from "../Views/ResultView";
import { AppContext } from "../../context/AppProvider";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const HomeScreen = () => {
  const {
    capturedImage,
    setCapturedImage,
    setNavPage,
    extractedText,
    setExtractedText,
  } = React.useContext(AppContext);
  const [permission, requestPermission] = useCameraPermissions();
  const facing = "back";
  const cameraRef = useRef(null);
  const [zoom, setZoom] = useState(0);
  const [flashEnabled, setFlashEnabled] = React.useState(false);
  const [modelVisible, setModelVisible] = React.useState(false);

  const [loading, setLoading] = React.useState(false); // Loading state

  if (!permission) {
    return (
      <View style={styles.outline}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <PermissionScreen
        onPress={requestPermission}
        title={"Grant Permission."}
        icon_name={"camera-outline"}
        header={"Let's get you started."}
        description={
          "To proceed, we need your permission to access the camera on your device. This will allow us to offer you a seamless and enhanced experience. Please grant the necessary permissions to continue using all available features."
        }
      />
    );
  }

  const _takePicture_CONVERT_IMAGE_TO_TEXT = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setLoading(true); // Start loading
      const data = await performOCR(photo);
      setExtractedText(data);
      setModelVisible(true);
      console.log(data);
      setCapturedImage(photo.uri);
      setLoading(false); // Stop loading
      setNavPage(APP_PAGES.APP.RESULT);
    }
  };

  const onPinchGestureEvent = (event) => {
    const scale = event.nativeEvent.scale;
    const newZoom = Math.max(0, Math.min(1, zoom + (scale - 1) * 0.05));
    setZoom(newZoom);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {modelVisible && (
        <Models
          visible={modelVisible}
          onClose={setModelVisible}
          customHeight={windowHeight * 1}
          children={
            <ResultView
              title={"Copy to clipboard"}
              uri={capturedImage}
              data={extractedText}
            />
          }
        />
      )}

      <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
        <CameraView
          style={styles.camera}
          facing={facing}
          zoom={zoom}
          ref={cameraRef}
          enableTorch={flashEnabled}
        >
          <View style={styles.navBar}>
            <Text style={styles.navBarText}>BOOTH</Text>
            <TouchableOpacity onPress={() => setFlashEnabled(!flashEnabled)}>
              <Text style={styles.navBarIcon}>
                {flashEnabled ? APP_ICONS.FLASH_ON : APP_ICONS.FLASH_OFF}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={APP_ICONS.DOC}
              style={styles.cambutton}
              onPress={_takePicture_CONVERT_IMAGE_TO_TEXT}
            />
          </View>

          {/* Loading indicator */}
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color={COLORS.WHITE} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
        </CameraView>
      </PinchGestureHandler>
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
    marginBottom: 30,
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
  loadingContainer: {
    position: "absolute",
    bottom: "50%",
    alignSelf: "center",
  },
  loadingText: {
    color: COLORS.WHITE,
    marginTop: 10,
  },
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    zIndex: 2,
  },
  navBarIcon: {
    color: COLORS.WHITE,
    fontSize: 24,
  },
  navBarText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)", // Dark overlay with transparency
    justifyContent: "center",
    alignItems: "center",
  },
});
