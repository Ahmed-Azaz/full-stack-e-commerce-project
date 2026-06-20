import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../api/apiFetch";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

const saveAuth = (payload) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
};

const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data, thunkAPI) => {
        try {
            return await apiFetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(data)
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        try {
            return await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data)
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const googleLogin = createAsyncThunk(
    "auth/google",
    async (credential, thunkAPI) => {
        try {
            return await apiFetch("/api/auth/google", {
                method: "POST",
                body: JSON.stringify({ credential })
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loadMe = createAsyncThunk(
    "auth/me",
    async (_, thunkAPI) => {
        try {
            return await apiFetch("/api/auth/me");
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (data, thunkAPI) => {
        try {
            return await apiFetch("/api/user/profile", {
                method: "PUT",
                body: JSON.stringify(data)
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user,
        token,
        loading: false,
        error: null
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            clearAuth();
        }
    },
    extraReducers: (builder) => {
        const onPending = (state) => {
            state.loading = true;
            state.error = null;
        };
        const onRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        };
        const onAuthSuccess = (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token || state.token;
            saveAuth({ user: action.payload.user, token: action.payload.token || state.token });
        };

        builder
            .addCase(registerUser.pending, onPending)
            .addCase(registerUser.fulfilled, onAuthSuccess)
            .addCase(registerUser.rejected, onRejected)
            .addCase(loginUser.pending, onPending)
            .addCase(loginUser.fulfilled, onAuthSuccess)
            .addCase(loginUser.rejected, onRejected)
            .addCase(googleLogin.pending, onPending)
            .addCase(googleLogin.fulfilled, onAuthSuccess)
            .addCase(googleLogin.rejected, onRejected)
            .addCase(loadMe.pending, onPending)
            .addCase(loadMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loadMe.rejected, onRejected)
            .addCase(updateProfile.pending, onPending)
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(updateProfile.rejected, onRejected);
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;