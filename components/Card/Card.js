import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../../context/Settings";

const Card = ({ title, icon, iconTwo, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.outline}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        <View style={styles.container}>
          <Text>{icon}</Text>
        </View>
        <Text>➜</Text>
        <View style={styles.container}>
          <Text>{iconTwo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  outline: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#7d60a3",
    marginHorizontal: 20,
    marginVertical: 16,
  },
  title: {
    color: COLORS.WHITE,
    fontWeight: "500",
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 50,
    padding: 10,
  },
});
