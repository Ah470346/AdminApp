import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';
import entryApi from '../../api/entryApi';
import { checkToken, refresh } from '../../type';

// Define the initial state using that type
interface entry {
    loading: boolean;
    data: object;
    error: null | string;
    postStatus: string;
    returnImageStatus: string;
}

const initialState: entry = {
    loading: false,
    data: {},
    error: null,
    postStatus: '',
    returnImageStatus: '',
};

export const getEntry = createAsyncThunk(
    'entry/getEntry',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await entryApi.getImage(token);
            return response;
        } catch (err: any) {
            if (err.response.status === 401) {
                const response = await checkToken(true);
                if (response === 'Done') {
                    await getEntry(token);
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
                refresh(true);
                return rejectWithValue(err.response.data.message);
            }
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
        }
    }
);

export const postEntry = createAsyncThunk(
    'entry/postEntry',
    async (
        { data, token }: { data: FormData; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await entryApi.submit(data, token);

            return response;
        } catch (err: any) {
            if (err.response.status === 401) {
                const response = await checkToken(true);
                if (response.status === 'Done') {
                    await postEntry({ data, token: response.token });
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
                refresh(true);
                return rejectWithValue(err.response.data.message);
            }
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
        }
    }
);

export const returnImage = createAsyncThunk(
    'entry/returnImage',
    async (data: FormData, { rejectWithValue }) => {
        try {
            const response = await entryApi.return_image(data);

            return response;
        } catch (err: any) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.message);
        }
    }
);

const entryReducer = createReducer(initialState, {
    [getEntry.pending.type]: (state, action) => {
        state.loading = true;
    },
    [getEntry.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.data = action.payload;
    },
    [getEntry.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [postEntry.pending.type]: (state, action) => {
        state.loading = true;
    },
    [postEntry.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.postStatus = action.payload;
    },
    [postEntry.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [returnImage.pending.type]: (state, action) => {
        state.loading = true;
    },
    [returnImage.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.returnImageStatus = action.payload;
    },
    [returnImage.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
});

export default entryReducer;
