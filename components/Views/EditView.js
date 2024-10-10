import { StyleSheet, Text, View, Image, Button } from "react-native";
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppProvider";
import * as ImageManipulator from "expo-image-manipulator";

const EditView = () => {
  const { capturedImage, setCapturedImage } = useContext(AppContext);
  const [editedImage, setEditedImage] = useState(capturedImage);

  // Function to crop the image
  const cropImage = async () => {
    const result = await ImageManipulator.manipulateAsync(
      editedImage,
      [{ crop: { originX: 0, originY: 0, width: 200, height: 200 } }], // Predefined crop area
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    setEditedImage(result.uri);
    setCapturedImage(result.uri); // Update the captured image after cropping
  };

  return (
    <View style={styles.container}>
      <Text>Crop the Image</Text>
      {editedImage && (
        <Image source={{ uri: editedImage }} style={styles.image} />
      )}

      <Button title="Crop" onPress={cropImage} />
    </View>
  );
};

export default EditView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});
