import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../context/Settings";

const Button = ({ onPress, title, style, styleText }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, styleText]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 14,
    color: COLORS.WHITE,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.BACKGROUND,
  },
});
