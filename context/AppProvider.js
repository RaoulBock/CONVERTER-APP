import React from "react";
import { APP_PAGES } from "./Settings";

export const AppContext = React.createContext({
  navPage: "",
  setNavPage: (val) => {},
});

const AppProvider = ({ children }) => {
  const [navPage, setNavPage] = React.useState(APP_PAGES.APP.HOME);
  const [cameraModelVisable, setCameraModelVisable] = React.useState(false);
  const [galleryModelVisable, setGalleryModelVisable] = React.useState(false);

  return (
    <AppContext.Provider
      value={{
        navPage,
        setNavPage,
        cameraModelVisable,
        setCameraModelVisable,
        galleryModelVisable,
        setGalleryModelVisable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
