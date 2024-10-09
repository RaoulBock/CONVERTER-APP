import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const SideMenu = ({ icon, name, title, data }) => {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      {data.map((e, i) => {
        return (
          <TouchableOpacity style={styles.outline} key={i} onPress={e.onPress}>
            <Text>{icon}</Text>
            <Text style={styles.name}>{name}</Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

export default SideMenu;

const styles = StyleSheet.create({});
