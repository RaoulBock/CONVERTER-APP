import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { APP_ICONS, COLORS } from "../../context/Settings";
import Button from "../Button/Button";
import { TouchableOpacity } from "react-native-gesture-handler";

const ResultView = ({ onCopy, uri, data, text }) => {
  return (
    <View style={styles.outline}>
      <ScrollView>
        <View style={styles.container}>
          <Image source={{ uri: uri }} style={styles.image} resizeMode="auto" />
        </View>
        <View>
          <View style={styles.grid}>
            <Text style={styles.title}>{text}</Text>
            <TouchableOpacity onPress={onCopy}>
              <Text>{APP_ICONS.CLIPBOARD}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.data}>{data}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultView;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "700",
    color: COLORS.BLACK,
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 16,
  },
  container: {
    marginBottom: 16,
  },
  data: {
    alignSelf: "center",
    marginVertical: 16,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
