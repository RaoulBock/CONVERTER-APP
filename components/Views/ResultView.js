import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Clipboard,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { APP_ICONS, COLORS } from "../../context/Settings";

const ResultView = ({ onCopy, uri, data, text }) => {
  const handleCopy = async () => {
    try {
      await Clipboard.setString(data);
      // Optionally, you can add some feedback here, like a toast message
      console.log("Text copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <View style={styles.outline}>
      <View style={styles.container}>
        <Image source={{ uri: uri }} style={styles.image} resizeMode="auto" />
      </View>
      <View>
        <View style={styles.grid}>
          <Text style={styles.title}>{text}</Text>
          <TouchableOpacity onPress={handleCopy}>
            <Text>{APP_ICONS.CLIPBOARD}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text style={styles.data} selectable={true}>
            {data}
          </Text>
        </ScrollView>
      </View>
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
    paddingHorizontal: 6,
    width: "100%",
    fontWeight: "500",
    color: COLORS.BLACK,
    fontSize: 24,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
