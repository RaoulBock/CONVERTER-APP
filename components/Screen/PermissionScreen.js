import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { APP_ICONS, COLORS } from "../../context/Settings";
import Button from "../Button/Button";
import { Ionicons, AntDesign } from "react-native-vector-icons";

const PermissionScreen = ({ onPress, title }) => {
  return (
    <View style={styles.outline}>
      <View style={styles.icon}>
        <Ionicons
          name={"camera-outline"}
          style={{ color: COLORS.BACKGROUND, fontSize: 30 }}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Let's get you started</Text>
        <Text style={styles.text}>
          To proceed, we need your permission to access the camera on your
          device. This will allow us to offer you a seamless and enhanced
          experience. Please grant the necessary permissions to continue using
          all available features.
        </Text>
      </View>
      <View style={{ position: "absolute", bottom: 10, width: "90%" }}>
        <Button
          onPress={onPress}
          title={title}
          style={{ backgroundColor: COLORS.WHITE }}
          styleText={{ color: COLORS.BACKGROUND, fontWeight: "700" }}
        />
      </View>
    </View>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  outline: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontWeight: "700",
    fontSize: 26,
    color: COLORS.MAIN_BACKGROUND,
  },
  text: {
    marginHorizontal: 26,
    marginTop: 6,
    color: "#ededed",
  },
  icon: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 50,
  },
  container: {
    alignSelf: "center",
    alignItems: "center",
    marginVertical: 16,
  },
});
