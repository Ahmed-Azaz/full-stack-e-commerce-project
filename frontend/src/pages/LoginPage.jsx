import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { googleLogin, loginUser } from "../store/authSlice";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loading, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({ email: "", password: "" });

    const submit = async (e) => {
        e.preventDefault();
        await dispatch(loginUser(form));
        navigate("/products");
    };

    const handleGoogle = async (credentialResponse) => {
        await dispatch(googleLogin(credentialResponse.credential));
        navigate("/products");
    };

    return (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: "70vh" }}>
            <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
                <Typography variant="h5" gutterBottom>
                    {t("login")}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
                    <TextField
                        label={t("email")}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label={t("password")}
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" disabled={loading}>
                        {t("login")}
                    </Button>
                </Box>

                <Box sx={{ my: 2 }}>
                    <GoogleLogin onSuccess={handleGoogle} onError={() => { }} />
                </Box>

                <Typography variant="body2">
                    {t("noAccount")}{" "}
                    <RouterLink to="/register">{t("register")}</RouterLink>
                </Typography>
            </Paper>
        </Box>
    );
}