import React, { useContext, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { AppContext } from "../../context/AppProvider";
import Button from "../Button/Button";
import { COLORS } from "../../context/Settings";

const CamView = () => {
  const { setCameraModelVisable } = useContext(AppContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const generatePDF = async () => {
    if (!capturedImage) {
      console.error("No image captured");
      return;
    }

    try {
      // Convert the image to a base64 string
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const html = `
        <html>
          <body>
            <img src="${base64Image}" alt="Captured Image" style="width: 100%; max-width: 600px;" />
          </body>
        </html>
      `;

      const file = await Print.printToFileAsync({
        html: html,
        base64: false,
      });

      await shareAsync(file.uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
    }
  };

  if (!permission) {
    return (
      <View>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
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
            <Button onPress={_takePicture} title={"Take Photo"} />
          </View>
        </CameraView>
      ) : (
        <View style={styles.camera}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          <Button onPress={generatePDF} title={"Convert to PDF"} />
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
