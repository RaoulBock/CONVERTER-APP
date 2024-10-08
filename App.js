import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppProvider, { AppContext } from "./context/AppProvider";
import { APP_PAGES, COLORS } from "./context/Settings";
import HomeScreen from "./components/Screen/HomeScreen";

function App() {
  return (
    <AppProvider>
      <NavWrapper />
    </AppProvider>
  );
}

const NavWrapper = () => {
  const { navPage, setNavPage } = React.useContext(AppContext);

  React.useEffect(() => {
    console.log("App Nav: ", navPage);
  }, [navPage]);

  return (
    <View style={styles.container}>
      {/* <StatusBar
        animated={true}
        backgroundColor={COLORS.WHITE}
        barStyle={"dark-content"}
        style="dark"
      /> */}
      {navPage === APP_PAGES.APP.HOME && <HomeScreen />}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLORS.BACKGROUND,
  },
});
