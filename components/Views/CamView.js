import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { AppContext } from "../../context/AppProvider";
import Button from "../Button/Button";
import { COLORS } from "../../context/Settings";

const CamView = () => {
  const { setCameraModelVisable } = React.useContext(AppContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = React.useState("back");
  const [cameraRef, setCameraRef] = React.useState(null);
  const [capturedImage, setCapturedImage] = React.useState(null);

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // setCameraModelVisable(false);
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const _takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      console.log(photo);
      setCapturedImage(photo.uri);
    }
  };

  const _retakePicture = () => {
    setCapturedImage(null);
  };

  return (
    <>
      {!capturedImage ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          flash="true"
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.button} onPress={_takePicture}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity> */}
            <Button onPress={_takePicture} title={"Take Photo"} />
          </View>
        </CameraView> // Show the captured image
      ) : (
        <View style={styles.camera}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />

          <Button onPress={_retakePicture} title={"Convert"} />
          <Button
            onPress={_retakePicture}
            title={"Take Another"}
            style={{
              marginTop: 10,
              borderWidth: 1,
              borderColor: COLORS.BACKGROUND,
              backgroundColor: COLORS.WHITE,
            }}
            styleText={{ color: COLORS.BACKGROUND }}
          />
        </View>
      )}
    </>
  );
};

export default CamView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    height: "100%",
  },
  buttonContainer: {
    margin: 20,
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    //flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "black",
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  capturedImage: {
    resizeMode: "cover",
    flex: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  message: {
    marginVertical: 16,
  },
});
