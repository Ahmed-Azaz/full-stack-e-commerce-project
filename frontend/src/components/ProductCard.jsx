import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Stack
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function ProductCard({ product, onAddCart, onAddFav }) {
    const { t } = useTranslation();
    const image = product.images?.[0] || product.thumbnail || "";

    const cartItems = useSelector((state) => state.cart.items);
    const favItems = useSelector((state) => state.favorites.items);

    const inCart = cartItems.some((item) => item.productId === product.id);
    const inFav = favItems.some((item) => item.productId === product.id);

    return (
        <Card sx={{
            height: "100%", display: "flex", flexDirection: "column",
            background: "linear-gradient(to top, #B5B9FF 50%  , #2B2C49  )"
         }}>
            <CardMedia
                component="img"
                height="220"
                image={image}
                alt={product.title}
                sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                    {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
                    {product.description}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                    {t("price")}: ${product.price}
                </Typography>
                <Typography>
                    {t("rating")}: {product.rating}
                </Typography>
            </CardContent>

            <Stack spacing={1} sx={{ p: 2, pt: 0 }}>
                <Button component={RouterLink} to={`/products/${product.id}`} variant="outlined"
                    sx={{
                        fontWeight: "bold",
                }}
                >
                    {t("view_product")}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => !inCart && onAddCart(product)}
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
                    
                    variant={inFav ? "contained" : "text"}
                    onClick={() => !inFav && onAddFav(product)}
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
            </Stack>
        </Card>
    );
}