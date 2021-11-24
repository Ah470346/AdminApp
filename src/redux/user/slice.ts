import { message } from 'antd';
import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';
import getUserApi from '../../api/getUserApi';
import { checkToken, refresh } from '../../type';

// Define the initial state using that type
interface user {
    loading: boolean;
    data: object;
    error: null | string;
    changePassword: string;
}

const initialState: user = {
    loading: false,
    data: {},
    error: null,
    changePassword: '',
};

export const getUser = createAsyncThunk(
    'user/getUser',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await getUserApi.getUser(token);
            return response;
        } catch (err: any) {
            if (err.response.status === 401) {
                const response = await checkToken(true);
                if (response.status === 'Done') {
                    await getUser(response.token);
                } else {
                    refresh(true);
                    return rejectWithValue('Your login has expired!');
                }
            }
            if (err.response.status === 402) {
                const response = await checkToken(false);
                if (response) {
                    refresh(true);
                    return rejectWithValue('Your login has expired!');
                }
            }
            if (err.response.status === 500) {
                return rejectWithValue('Server is disconnected!');
            } else {
                return rejectWithValue(err.response.data.message);
            }
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
        }
    }
);

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (user: FormData, { rejectWithValue }) => {
        try {
            const response: any = await getUserApi.changePassword(user);
            return response.message;
        } catch (err: any) {
            if (err.response.status === 500) {
                return rejectWithValue('Server is disconnected!');
            } else {
                return rejectWithValue('Server Error !');
            }
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
        }
    }
);

const userReducer = createReducer(initialState, {
    [getUser.pending.type]: (state, action) => {
        state.loading = true;
    },
    [getUser.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.data = action.payload;
    },
    [getUser.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [changePassword.pending.type]: (state, action) => {
        state.loading = true;
    },
    [changePassword.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.changePassword = action.payload;
    },
    [changePassword.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
});

export default userReducer;
