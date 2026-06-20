import { useEffect } from "react";
import { Container } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { loadMe } from "./store/authSlice";
import { fetchCart } from "./store/cartSlice";
import { fetchFavorites } from "./store/favoritesSlice";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";


export default function App() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (token) {
            dispatch(loadMe());
            dispatch(fetchCart());
            dispatch(fetchFavorites());
        }
    }, [token, dispatch]);

    return (
        <>
            <Navbar />
            <Container sx={{ py: 3 }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Routes>
            </Container>
        </>
    );
}