import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchFavorites, removeFromFavorites } from "../store/favoritesSlice";

export default function FavoritesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { items, loading, error } = useSelector((state) => state.favorites);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom
                sx={{
                    textAlign: "center"
                }}
            >
                {t("favorites")}
            </Typography>

            <Stack spacing={2}>
                {items.map((item) => (
                    <Card key={item.productId} sx={{ display: "flex", gap: 2, p: 1 }}>
                        <CardMedia
                            component="img"
                            image={item.image}
                            alt={item.title}
                            sx={{ width: 120, borderRadius: 2 }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6">{item.title}</Typography>
                            <Typography>{t("price")}: ${item.price}</Typography>
                        </CardContent>
                        <Stack direction="column" justifyContent="center" spacing={1} sx={{ pr: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => navigate(`/products/${item.productId}`)}
                            >
                                {t("view_product")}
                            </Button>
                            <IconButton onClick={() => dispatch(removeFromFavorites(item.productId))}>
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    </Card>
                ))}
            </Stack>

            {items.length === 0 && <Typography sx={{ mt: 2 }}>No favorites yet</Typography>}
        </Box>
    );
}