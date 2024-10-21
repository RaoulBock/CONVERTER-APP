import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
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
const OPTION_WIDTH = 100; // Width of each option item

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
  const [activeOptionIndex, setActiveOptionIndex] = React.useState(0);
  const scrollViewRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: activeOptionIndex * OPTION_WIDTH,
        animated: true,
      });
    }
  }, [activeOptionIndex]);

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

  const OPTIONS_MENU = [
    {
      name: "Image to Text",
      icon: APP_ICONS.DOC,
      onPress: _takePicture_CONVERT_IMAGE_TO_TEXT,
    },
    {
      name: "Image detection",
      icon: APP_ICONS.SEARCH,
      onPress: () => console.log("Image detection pressed"),
    },
  ];

  return (
    <GestureHandlerRootView style={styles.container}>
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

          <View style={styles.optionsContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              // snapToInterval={OPTION_WIDTH}
              snapToAlignment="center"
              contentContainerStyle={[
                styles.scrollViewContent,
                { paddingHorizontal: (windowWidth - OPTION_WIDTH) / 2 },
              ]}
              onMomentumScrollEnd={(event) => {
                const contentOffset = event.nativeEvent.contentOffset.x;
                const pageNum = Math.round(contentOffset / OPTION_WIDTH);
                setActiveOptionIndex(pageNum);
              }}
            >
              {OPTIONS_MENU.map((option, index) => (
                <View key={index} style={styles.optionItem}>
                  <Button
                    title={option.icon}
                    style={[
                      styles.optionButton,
                      index === activeOptionIndex && styles.activeOptionButton,
                    ]}
                    onPress={option.onPress}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

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
    flexDirection: "row",
    alignItems: "center",
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
  optionsContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    height: 100,
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  optionItem: {
    width: OPTION_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  optionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  activeOptionButton: {
    backgroundColor: COLORS.WHITE,
  },
  optionText: {
    color: COLORS.WHITE,
    marginTop: 8,
    fontSize: 12,
  },
});
