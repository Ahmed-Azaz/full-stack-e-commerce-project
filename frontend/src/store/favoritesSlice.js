import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../api/apiFetch";

export const fetchFavorites = createAsyncThunk(
    "favorites/fetchFavorites",
    async (_, thunkAPI) => {
        try {
            return await apiFetch("/api/user/favorites");
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addToFavorites = createAsyncThunk(
    "favorites/addToFavorites",
    async (item, thunkAPI) => {
        try {
            return await apiFetch("/api/user/favorites", {
                method: "POST",
                body: JSON.stringify(item)
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const removeFromFavorites = createAsyncThunk(
    "favorites/removeFromFavorites",
    async (productId, thunkAPI) => {
        try {
            return await apiFetch(`/api/user/favorites/${productId}`, {
                method: "DELETE"
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const favoritesSlice = createSlice({
    name: "favorites",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        clearFavoritesState(state) {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        const success = (state, action) => {
            state.loading = false;
            state.items = action.payload.items;
        };

        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavorites.fulfilled, success)
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToFavorites.fulfilled, success)
            .addCase(removeFromFavorites.fulfilled, success);
    }
});

export const { clearFavoritesState } = favoritesSlice.actions;
export default favoritesSlice.reducer;