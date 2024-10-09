import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../context/Settings";

const SideMenu = ({ title, data }) => {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      {data && (
        <>
          {data.map((e, i) => {
            return (
              <TouchableOpacity
                style={styles.outline}
                key={i}
                onPress={e.onPress}
                activeOpacity={0.8}
              >
                <Text style={styles.icon}>{e.icon}</Text>
                <Text style={styles.name}>{e.name}</Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "700",
    color: COLORS.BLACK,
    fontSize: 16,
  },
  outline: {
    borderBottomWidth: 1,
    borderBottomColor: "#ededed",
    paddingBottom: 16,
  },
  name: {
    textAlign: "center",
  },
});
