import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../api/apiFetch";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, thunkAPI) => {
        try {
            return await apiFetch("/api/products");
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async (id, thunkAPI) => {
        try {
            return await apiFetch(`/api/products/${id}`);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        selected: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selected = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selected = action.payload.product;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default productSlice.reducer;