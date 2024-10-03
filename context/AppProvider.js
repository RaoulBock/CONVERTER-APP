import React from "react";
import { APP_PAGES } from "./Settings";

export const AppContext = React.createContext({
  navPage: "",
  setNavPage: (val) => {},
});

const AppProvider = ({ children }) => {
  const [navPage, setNavPage] = React.useState(APP_PAGES.APP.HOME);
  const [cameraModelVisable, setCameraModelVisable] = React.useState(false);
  const [docModelVisable, setDocModelVisable] = React.useState(false);
  const [pdfToDocModelVisable, setPDFToDocModelVisable] = React.useState(false);

  return (
    <AppContext.Provider
      value={{
        navPage,
        setNavPage,
        cameraModelVisable,
        setCameraModelVisable,
        docModelVisable,
        setDocModelVisable,
        pdfToDocModelVisable,
        setPDFToDocModelVisable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
