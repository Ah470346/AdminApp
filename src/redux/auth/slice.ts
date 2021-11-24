import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

// Define the initial state using that type
interface authAction {
    loading: boolean;
    isAuth: boolean;
    data: object;
    error: null | string;
}

const initialState: authAction = {
    loading: false,
    isAuth: false,
    data: {},
    error: null,
};

export const postAuth = createAsyncThunk(
    'user/postAuth',
    async (user: FormData, { rejectWithValue }) => {
        try {
            const response = await authApi.login(user);
            return response;
        } catch (err: any) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.message);
        }
    }
);

const authReducer = createReducer(initialState, {
    [postAuth.pending.type]: (state, action) => {
        state.loading = true;
    },
    [postAuth.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.data = action.PayloadAction;
    },
    [postAuth.rejected.type]: (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.error = action.PayloadAction;
    },
});

export default authReducer;
