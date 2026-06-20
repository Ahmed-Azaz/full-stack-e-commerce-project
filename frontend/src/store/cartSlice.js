import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../api/apiFetch";

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
        try {
            return await apiFetch("/api/user/cart");
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (item, thunkAPI) => {
        try {
            return await apiFetch("/api/user/cart", {
                method: "POST",
                body: JSON.stringify(item)
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ productId, quantity }, thunkAPI) => {
        try {
            return await apiFetch(`/api/user/cart/${productId}`, {
                method: "PATCH",
                body: JSON.stringify({ quantity })
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, thunkAPI) => {
        try {
            return await apiFetch(`/api/user/cart/${productId}`, {
                method: "DELETE"
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const checkoutCart = createAsyncThunk(
    "cart/checkoutCart",
    async ({ paymentMethod, paypalOrderId }, thunkAPI) => {
        try {
            return await apiFetch("/api/orders/checkout", {
                method: "POST",
                body: JSON.stringify({ paymentMethod, paypalOrderId })
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        clearCartState(state) {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        const success = (state, action) => {
            state.loading = false;
            state.items = action.payload.items;
        };

        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, success)
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, success)
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCartItem.fulfilled, success)
            .addCase(removeFromCart.fulfilled, success)
            .addCase(checkoutCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkoutCart.fulfilled, success)
            .addCase(checkoutCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;