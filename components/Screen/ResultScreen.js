import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  Clipboard,
} from "react-native";
import React from "react";
import Nav from "../Nav/Nav";
import { APP_ICONS, APP_PAGES, COLORS } from "../../context/Settings";
import { AppContext } from "../../context/AppProvider";

const ResultScreen = () => {
  const { setNavPage, capturedImage, extractedText, setExtractedText } =
    React.useContext(AppContext);

  const handleCopy = async () => {
    try {
      await Clipboard.setString(extractedText);
      console.log("Text copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <ScrollView style={styles.outline}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setNavPage(APP_PAGES.APP.HOME)}>
          <Text style={styles.navBarIcon}>{APP_ICONS.BACK}</Text>
        </TouchableOpacity>
        <Text style={styles.navBarText}>Results</Text>
        <TouchableOpacity onPress={() => handleCopy}>
          <Text style={styles.navBarIcon}>{APP_ICONS.CLIPBOARD}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Image
          source={{ uri: capturedImage }}
          style={styles.image}
          resizeMode="auto"
        />
      </View>
      <View>
        <Text style={styles.data} selectable={true}>
          {extractedText}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  navBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 16,
    marginTop: 10,
  },
  navBarIcon: {
    color: COLORS.WHITE,
    fontSize: 24,
  },
  navBarText: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 360,
  },
  data: {
    paddingHorizontal: 6,
    width: "100%",
    fontWeight: "500",
    color: COLORS.BLACK,
    fontSize: 24,
  },
});
