import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  PanResponder,
  Dimensions,
  Button,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const EDGE_HIT_SLOP = 20;

const EditView = ({ capturedImage, onCropComplete }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 400,
  });
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(true);

  useEffect(() => {
    Image.getSize(capturedImage, (width, height) => {
      const scaleFactor = Math.min(
        SCREEN_WIDTH / width,
        (SCREEN_HEIGHT - 100) / height
      );
      const scaledWidth = width * scaleFactor;
      const scaledHeight = height * scaleFactor;
      setImageSize({ width: scaledWidth, height: scaledHeight });

      setCropBox({
        x: (SCREEN_WIDTH - Math.min(scaledWidth, 300)) / 2,
        y: (SCREEN_HEIGHT - 100 - Math.min(scaledHeight, 400)) / 2,
        width: Math.min(scaledWidth, 300),
        height: Math.min(scaledHeight, 400),
      });
    });
  }, [capturedImage]);

  const createPanResponder = (edge) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        setCropBox((prevBox) => {
          let newBox = { ...prevBox };

          switch (edge) {
            case "left":
              newBox.x = Math.max(
                0,
                Math.min(newBox.x + gesture.dx, newBox.x + newBox.width - 100)
              );
              newBox.width -= gesture.dx;
              break;
            case "right":
              newBox.width = Math.max(
                100,
                Math.min(newBox.width + gesture.dx, imageSize.width - newBox.x)
              );
              break;
            case "top":
              newBox.y = Math.max(
                0,
                Math.min(newBox.y + gesture.dy, newBox.y + newBox.height - 100)
              );
              newBox.height -= gesture.dy;
              break;
            case "bottom":
              newBox.height = Math.max(
                100,
                Math.min(
                  newBox.height + gesture.dy,
                  imageSize.height - newBox.y
                )
              );
              break;
          }

          return newBox;
        });
      },
    });
  };

  const cropImage = async () => {
    try {
      const originX =
        (cropBox.x / imageSize.width) *
        Image.resolveAssetSource({ uri: capturedImage }).width;
      const originY =
        (cropBox.y / imageSize.height) *
        Image.resolveAssetSource({ uri: capturedImage }).height;
      const width =
        (cropBox.width / imageSize.width) *
        Image.resolveAssetSource({ uri: capturedImage }).width;
      const height =
        (cropBox.height / imageSize.height) *
        Image.resolveAssetSource({ uri: capturedImage }).height;

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        capturedImage,
        [{ crop: { originX, originY, width, height } }],
        { format: "png" }
      );
      setCroppedImage(manipulatedImage.uri);
      setIsCropping(false);
      if (onCropComplete) {
        onCropComplete(manipulatedImage.uri);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <Button title="Done" onPress={cropImage} />
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: croppedImage || capturedImage }}
          style={[styles.image, { width: "100%", height: "100%" }]}
        />
        {isCropping && (
          <View
            style={[
              styles.cropBox,
              {
                left: cropBox.x,
                top: cropBox.y,
                width: cropBox.width,
                height: cropBox.height,
              },
            ]}
          >
            <View
              style={[styles.edge, styles.leftEdge]}
              {...createPanResponder("left").panHandlers}
            />
            <View
              style={[styles.edge, styles.rightEdge]}
              {...createPanResponder("right").panHandlers}
            />
            <View
              style={[styles.edge, styles.topEdge]}
              {...createPanResponder("top").panHandlers}
            />
            <View
              style={[styles.edge, styles.bottomEdge]}
              {...createPanResponder("bottom").panHandlers}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    resizeMode: "contain",
  },
  cropBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  edge: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  leftEdge: {
    left: -EDGE_HIT_SLOP,
    top: 0,
    width: EDGE_HIT_SLOP * 2,
    height: "100%",
  },
  rightEdge: {
    right: -EDGE_HIT_SLOP,
    top: 0,
    width: EDGE_HIT_SLOP * 2,
    height: "100%",
  },
  topEdge: {
    top: -EDGE_HIT_SLOP,
    left: 0,
    width: "100%",
    height: EDGE_HIT_SLOP * 2,
  },
  bottomEdge: {
    bottom: -EDGE_HIT_SLOP,
    left: 0,
    width: "100%",
    height: EDGE_HIT_SLOP * 2,
  },
  controlsContainer: {},
});

export default EditView;
