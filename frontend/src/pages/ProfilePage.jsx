import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { loadMe, updateProfile } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, loading, error } = useSelector((state) => state.auth);
    const cartCount = useSelector((state) => state.cart.items.length);
    const favCount = useSelector((state) => state.favorites.items.length);

    const [name, setName] = useState("");

    useEffect(() => {
        dispatch(loadMe());
    }, [dispatch]);

    useEffect(() => {
        if (user?.name) setName(user.name);
    }, [user]);

    const save = async () => {
        await dispatch(updateProfile({ name }));
    };

    if (loading && !user) return <Typography>Loading...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!user) return null;

    return (
        <Card sx={{ maxWidth: 600, mx: "auto" }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar src={user.avatar} sx={{ width: 72, height: 72 }} />
                    <Box>
                        <Typography variant="h5">{t("profile")}</Typography>
                        <Typography color="text.secondary">{user.email}</Typography>
                    </Box>
                </Box>

                <TextField
                    label={t("name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label={t("email")}
                    value={user.email}
                    fullWidth
                    disabled
                    sx={{ mb: 2 }}
                />

                <Typography sx={{ mb: 2 }}>
                    {t("cart")}: {cartCount} | {t("favorites")}: {favCount}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="contained" onClick={save}>
                        {t("save")}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/products")}>
                        {t("products")}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}