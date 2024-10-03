import { Ionicons, AntDesign } from "react-native-vector-icons";

export const APP_PAGES = {
  APP: {
    HOME: "HOME",
  },
};

export const COLORS = {
  MAIN_BACKGROUND: "#fff",
  BACKGROUND: "#6f39b6",
  WHITE: "#fff",
  BLACK: "#1B1B1B",
};

export const APP_ICONS = {
  CAMERA: (
    <Ionicons name={"camera-outline"} style={{ color: "#fff", fontSize: 20 }} />
  ),
  GALLARY: (
    <Ionicons name={"image-outline"} style={{ color: "#fff", fontSize: 20 }} />
  ),
  PDF: <AntDesign name={"pdffile1"} style={{ color: "#fff", fontSize: 20 }} />,
  ADD: (
    <Ionicons name={"add-outline"} style={{ color: "#fff", fontSize: 20 }} />
  ),
  DOC: (
    <Ionicons
      name={"document-text-outline"}
      style={{ color: "#fff", fontSize: 20 }}
    />
  ),
};
