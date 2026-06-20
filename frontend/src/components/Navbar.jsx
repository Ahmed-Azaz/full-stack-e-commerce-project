import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Badge
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout } from "../store/authSlice";
import { clearCartState } from "../store/cartSlice";
import { clearFavoritesState } from "../store/favoritesSlice";
import { setLanguage } from "../store/languageSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const token = useSelector((state) => state.auth.token);
    const cartCount = useSelector((state) => state.cart.items.length);
    const favoritesCount = useSelector((state) => state.favorites.items.length);
    const language = useSelector((state) => state.language.value);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCartState());
        dispatch(clearFavoritesState());
        navigate("/login");
    };

    const toggleLanguage = () => {
        dispatch(setLanguage(language === "en" ? "ar" : "en"));
    };

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ gap: 1, flexWrap: "wrap", background: "linear-gradient(to left, #5C258D  , #4389A2  )" }}>
                <Typography
                    component={RouterLink}
                    to="/products"
                    variant="h6"
                    sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
                >
                    {t("shop")}
                </Typography>

                <Button color="inherit" component={RouterLink} to="/products">
                    {t("products")}
                </Button>

                {token && (
                    <>
                        <Button color="inherit" component={RouterLink} to="/profile" startIcon={<PersonIcon />}>
                            {t("profile")}
                        </Button>

                        <IconButton color="inherit" component={RouterLink} to="/favorites">
                            <Badge badgeContent={favoritesCount} color="error">
                                <FavoriteIcon />
                            </Badge>
                        </IconButton>

                        <IconButton color="inherit" component={RouterLink} to="/cart">
                            <Badge badgeContent={cartCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </>
                )}

                <IconButton color="inherit" onClick={toggleLanguage}>
                    <LanguageIcon />
                </IconButton>

                {token ? (
                    <Button color="inherit" onClick={handleLogout}>
                        {t("logout")}
                    </Button>
                ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button color="inherit" component={RouterLink} to="/login">
                            {t("login")}
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/register">
                            {t("register")}
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}