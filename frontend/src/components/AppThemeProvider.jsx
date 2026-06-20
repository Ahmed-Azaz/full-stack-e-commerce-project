import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import i18n from "../i18n";

const rtlCache = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin]
});

const ltrCache = createCache({
    key: "muiltr"
});

export default function AppThemeProvider({ children }) {
    const language = useSelector((state) => state.language.value);

    useEffect(() => {
        i18n.changeLanguage(language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }, [language]);

    const theme = useMemo(
        () =>
            createTheme({
                direction: language === "ar" ? "rtl" : "ltr",
                typography: {
                    fontFamily:
                        language === "ar"
                            ? "Cairo, Arial, sans-serif"
                            : "Roboto, Arial, sans-serif"
                }
            }),
        [language]
    );

    return (
        <CacheProvider value={language === "ar" ? rtlCache : ltrCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}