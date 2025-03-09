import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/api';


export const getCarts = createAsyncThunk("carts/get", async (_, thunkAPI) => {
    try {
        const res = await axiosInstance.get("/cart")
        return res.data.data
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Product fetching failed"
        );
    }
})

export const addOrRemoveQuantityFromCart = createAsyncThunk<
    any,
    { product_id: string, quantity?: number },
    { rejectValue: string }
>(
    "carts/addRemove",
    async (payload, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/cart", payload);
            return res.data; // Ensure you return only the required data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Add or remove product failed"
            );
        }
    }
);

export const removeProduct = createAsyncThunk<
    any,
    string,
    { rejectValue: string }
>(
    "carts/removeProduct",
    async (product_id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(`/cart/${product_id}`);
            return res.data; // Ensure returning only required data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to remove product from cart"
            );
        }
    }
);

const initialState: any = {
    loading: false,
    data: [],
    error: ''
};

const cartslice = createSlice({
    name: "carts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCarts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCarts.fulfilled, (state, action) => {
                state.loading = true;
                state.data = action.payload;
            })
            .addCase(getCarts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});


export default cartslice.reducer