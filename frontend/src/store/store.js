import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import favoritesReducer from "./favoritesSlice";
import languageReducer from "./languageSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        favorites: favoritesReducer,
        language: languageReducer
    }
});