import { useEffect, useMemo, useState } from "react";
import { Alert, colors, Grid, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { addToFavorites } from "../store/favoritesSlice";
import ProductCard from "../components/ProductCard";
import { Box } from "@mui/material";
export default function ProductsPage() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { items, loading, error } = useSelector((state) => state.products);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filtered = useMemo(() => {
        return items.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    const handleAddCart = (product) => {
        dispatch(
            addToCart({
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || product.thumbnail || "",
                rating: product.rating,
                description: product.description,
                quantity: 1
            })
        );
    };

    const handleAddFav = (product) => {
        dispatch(
            addToFavorites({
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || product.thumbnail || "",
                rating: product.rating,
                description: product.description
            })
        );
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <TextField
                label={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
            />

            {/* <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                {t("products")}
            </Typography> */}

            <Grid container spacing={3}>
                {filtered.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <ProductCard
                            product={product}
                            onAddCart={handleAddCart}
                            onAddFav={handleAddFav}
                        />
                    </Grid>
                ))}
                </Grid>
           

        </>
    );
}