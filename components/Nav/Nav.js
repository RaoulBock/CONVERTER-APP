import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../context/Settings";

const Nav = ({ title }) => {
  return (
    <View style={styles.outline}>
      <Text style={styles.title}>{title}</Text>
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
