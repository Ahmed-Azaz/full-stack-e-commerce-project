import { useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardMedia,
    Typography
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProductById } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { addToFavorites } from "../store/favoritesSlice";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { selected, loading, error } = useSelector((state) => state.products);

    const cartItems = useSelector((state) => state.cart.items);
    const favItems = useSelector((state) => state.favorites.items);

    const inCart = selected ? cartItems.some((item) => item.productId === selected.id) : false;
    const inFav = selected ? favItems.some((item) => item.productId === selected.id) : false;

    useEffect(() => {
        dispatch(fetchProductById(id));
    }, [dispatch, id]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!selected) return null;

    const image = selected.images?.[0] || selected.thumbnail || "";

    const handleAddCart = () => {
        if (inCart) return;
        dispatch(
            addToCart({
                productId: selected.id,
                title: selected.title,
                price: selected.price,
                image,
                rating: selected.rating,
                description: selected.description,
                quantity: 1
            })
        );
    };

    const handleAddFav = () => {
        if (inFav) return;
        dispatch(
            addToFavorites({
                productId: selected.id,
                title: selected.title,
                price: selected.price,
                image,
                rating: selected.rating,
                description: selected.description
            })
        );
    };

    return (
        
        <Card sx={{ p: 2, background: "#1565c0" }}>
            <Box
                sx={{
                    
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    alignItems: "start"
                }}
            >
                <CardMedia
                    component="img"
                    image={image}
                    alt={selected.title}
                    sx={{ width: "100%", borderRadius: 2 }}
                />

                <Box>
                    <Typography variant="h4" gutterBottom>
                        {selected.title}
                    </Typography>
                    <Typography variant="h6">
                        {t("price")}: ${selected.price}
                    </Typography>
                    <Typography variant="h6">
                        {t("rating")}: {selected.rating}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        {selected.description}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
                        <Button
                            variant="contained"
                            onClick={handleAddCart}
                            disabled={inCart}
                            startIcon={inCart ? <CheckCircleIcon /> : <ShoppingCartIcon />}
                            color={inCart ? "success" : "primary"}
                            sx={{
                                transition: "all 0.3s ease",
                                ...(inCart && {
                                    "&.Mui-disabled": {
                                        backgroundColor: "success.main",
                                        color: "white",
                                        opacity: 0.85
                                    }
                                })
                            }}
                        >
                            {inCart ? t("addedToCart") : t("addToCart")}
                        </Button>
                        <Button
                            variant={inFav ? "contained" : "outlined"}
                            onClick={handleAddFav}
                            disabled={inFav}
                            startIcon={inFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            color={inFav ? "error" : "primary"}
                            sx={{
                                transition: "all 0.3s ease",
                                ...(inFav && {
                                    "&.Mui-disabled": {
                                        backgroundColor: "error.main",
                                        color: "white",
                                        opacity: 0.85
                                    }
                                })
                            }}
                        >
                            {inFav ? t("addedToFavorites") : t("addToFavorites")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}