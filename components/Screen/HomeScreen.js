import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import React, { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";

import Button from "../Button/Button";
import { APP_ICONS, COLORS } from "../../context/Settings";
import { Ionicons } from "react-native-vector-icons";
import Models from "../Model/Model";
import PermissionScreen from "./PermissionScreen";
import SideMenu from "../Menu/SideMenu";
import { performOCR } from "../../utils/helpers";
import ResultView from "../Views/ResultView";
import { AppContext } from "../../context/AppProvider";
import EditView from "../Views/EditView";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const HomeScreen = () => {
  const {
    editViewVisable,
    setEditViewVisable,
    capturedImage,
    setCapturedImage,
  } = React.useContext(AppContext);
  const [permission, requestPermission] = useCameraPermissions();
  const facing = "back";
  const cameraRef = useRef(null);

  const [zoom, setZoom] = useState(0);
  const [selectedOption, setSelectedOption] = useState("Search");
  const [flashEnabled, setFlashEnabled] = React.useState(false);

  const [modelVisable, setModelVisable] = React.useState(false);
  // State to hold extracted text
  const [extractedText, setExtractedText] = React.useState("");

  const OPTIONS = [
    {
      name: "Translate",
      icon: APP_ICONS.TRANSLATE,
      onPress: () => console.log("Translate"),
    },
    {
      name: "Search",
      icon: APP_ICONS.SEARCH,
      onPress: () => console.log("Search"),
    },
    {
      name: "Homework",
      icon: APP_ICONS.HOMEWORK,
      onPress: () => console.log("Homework"),
    },
    {
      name: "Image to Text",
      icon: APP_ICONS.DOC,
      onPress: () => _takePicture_CONVERT_IMAGE_TO_TEXT(),
    },
  ];

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
      //setModelVisable(true);
      const photo = await cameraRef.current.takePictureAsync();
      // const data = await performOCR(photo);
      // setExtractedText(data);
      // console.log(data);
      setCapturedImage(photo.uri);
      setEditViewVisable(true);
    }
  };

  const onPinchGestureEvent = (event) => {
    const scale = event.nativeEvent.scale;
    const newZoom = Math.max(0, Math.min(1, zoom + (scale - 1) * 0.05));
    setZoom(newZoom);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {modelVisable && (
        <Models
          visible={modelVisable}
          onClose={setModelVisable}
          customHeight={windowHeight * 0.8}
          children={
            <ResultView
              title={"Copy to clipboard"}
              uri={capturedImage}
              data={extractedText}
              text={"Text extracted from image"}
            />
          }
        />
      )}
      {editViewVisable && (
        <Models
          visible={editViewVisable}
          onClose={setEditViewVisable}
          customHeight={windowHeight * 0.8}
          children={<EditView />}
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
          {/* <View style={styles.scanIconContainer}>
            <Ionicons
              name="scan"
              size={windowWidth * 1}
              color="rgba(255, 255, 255, 0.5)"
            />
          </View> */}
          <View style={[styles.buttonContainer]}>
            <Button
              title={OPTIONS.find((opt) => opt.name === selectedOption).icon}
              style={styles.cambutton}
              onPress={
                OPTIONS.find((opt) => opt.name === selectedOption).onPress
              }
            />
          </View>
        </CameraView>
      </PinchGestureHandler>
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
    borderRadius: 50,
  },
  selectedOption: {
    backgroundColor: COLORS.MAIN_BACKGROUND,
  },
  scanIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
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
});
