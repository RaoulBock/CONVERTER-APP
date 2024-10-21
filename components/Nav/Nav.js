import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../../context/Settings";

const Nav = ({ title, icon, iconTwo, onPress, onPressTwo }) => {
  return (
    <View style={styles.outline}>
      {icon && (
        <TouchableOpacity onPress={onPress}>
          <Text>{icon}</Text>
        </TouchableOpacity>
      )}
      {title && <Text style={styles.title}>{title}</Text>}
      {iconTwo && (
        <TouchableOpacity onPress={onPressTwo}>
          <Text>{iconTwo}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Nav;

const styles = StyleSheet.create({
  outline: {
    padding: 16,
  },
  title: {
    color: COLORS.WHITE,
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
  },
});
