import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { baselightTheme } from "./utils/theme/DefaultColors.jsx";
import AppProvider from "./context/ContextPanel.jsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider theme={baselightTheme}>
          <App />
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  </Provider>
);
