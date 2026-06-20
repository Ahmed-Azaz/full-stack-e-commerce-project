import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./store/store";
import App from "./App";
import AppThemeProvider from "./components/AppThemeProvider";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <BrowserRouter>
                    <AppThemeProvider>
             
                            <App />
                     
                    </AppThemeProvider>
                </BrowserRouter>
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
);