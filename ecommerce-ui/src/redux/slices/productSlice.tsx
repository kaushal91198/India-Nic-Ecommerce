import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/api';


export const getProducts = createAsyncThunk("products/get", async (_, thunkAPI) => {
    try {
        const res = await axiosInstance.get("/product")
        return res.data.data
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Product fetching failed"
        );
    }
})

const initialState: any = {
    loading: true,
    data: [],
    error: ''
};

const productslice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.status = "failed";
                // Ensure action.payload is treated as a string
                state.error = action.payload as string;
            });
    }
});


export default productslice.reducer