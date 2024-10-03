import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import React from "react";
import Nav from "../Nav/Nav";
import Card from "../Card/Card";
import { APP_ICONS } from "../../context/Settings";
import { AppContext } from "../../context/AppProvider";
import Models from "../Model/Model";
import CamView from "../Views/CamView";
import DocToPdfView from "../Views/DocToPdfView";
import PdfToDocView from "../Views/PdfToDocVIew";

const HomeScreen = () => {
  const {
    setCameraModelVisable,
    cameraModelVisable,
    docModelVisable,
    setDocModelVisable,
    pdfToDocModelVisable,
    setPDFToDocModelVisable,
  } = React.useContext(AppContext);

  const COVERT_CAMERA_TO_PDF = () => {
    console.log("Converting image from camera to PDF");
    setCameraModelVisable(true);
  };

  const CONVERT_DOC_TO_PDF = () => {
    console.log("Converting document to PDF");
    setDocModelVisable(true);
  };

  const CONVERT_PDF_DOC = () => {
    console.log("Converting PDF to document");
    setPDFToDocModelVisable(true);
  };

  return (
    <View style={styles.outline}>
      {cameraModelVisable && (
        <Models
          visible={cameraModelVisable}
          onClose={setCameraModelVisable}
          children={<CamView />}
          customHeight={"97%"}
        />
      )}

      {docModelVisable && (
        <Models
          visible={docModelVisable}
          onClose={setDocModelVisable}
          children={<DocToPdfView />}
          customHeight={"97%"}
        />
      )}

      {pdfToDocModelVisable && (
        <Models
          visible={pdfToDocModelVisable}
          onClose={setPDFToDocModelVisable}
          children={<PdfToDocView />}
          customHeight={"97%"}
        />
      )}

      <Nav title={"Image Converor"} />
      <Card
        icon={APP_ICONS.CAMERA}
        iconTwo={APP_ICONS.PDF}
        title={"Image To PDF"}
        onPress={COVERT_CAMERA_TO_PDF}
      />
      <Card
        icon={APP_ICONS.DOC}
        iconTwo={APP_ICONS.PDF}
        title={"Doc To PDF"}
        onPress={CONVERT_DOC_TO_PDF}
      />

      <Card
        icon={APP_ICONS.PDF}
        iconTwo={APP_ICONS.DOC}
        title={"PDF To DOC"}
        onPress={CONVERT_PDF_DOC}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  outline: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
  },
});
