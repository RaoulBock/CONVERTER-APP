import React from "react";
import { APP_PAGES } from "./Settings";

export const AppContext = React.createContext({
  navPage: "",
  setNavPage: (val) => {},
});

const AppProvider = ({ children }) => {
  const [navPage, setNavPage] = React.useState(APP_PAGES.APP.HOME);

  return (
    <AppContext.Provider
      value={{
        navPage,
        setNavPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
