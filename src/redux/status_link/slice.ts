import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import linkApi from '../../api/linkApi';
import statusApi from '../../api/statusApi';
import { DataLink } from '../../type';

// Define the initial state using that type
interface Status {
    loading: boolean;
    data: object;
    linkData: DataLink[];
    error: null | string;
    notification: string;
}

const initialState: Status = {
    loading: false,
    data: {},
    error: null,
    notification: '',
    linkData: [],
};

export const getStatus = createAsyncThunk(
    'status/getStatus',
    async (status: string, { rejectWithValue }) => {
        try {
            const response = await statusApi.getStatus();
            return response;
        } catch (err: any) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.err);
        }
    }
);

export const changeStatus = createAsyncThunk(
    'status/changeStatus',
    async (status: string, { rejectWithValue }) => {
        try {
            const response = await statusApi.changeStatus(status);
            return response;
        } catch (err: any) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.err);
        }
    }
);

export const getAllLink = createAsyncThunk(
    'link/getAllLink',
    async (link: string, { rejectWithValue }) => {
        try {
            const response = await linkApi.getAll();
            return response;
        } catch (err: any) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.err);
        }
    }
);

export const changeLink = createAsyncThunk(
    'link/changeLink',
    async (link: DataLink, { rejectWithValue }) => {
        try {
            const response = await linkApi.changeLink(link);
            return response;
        } catch (err: any) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.err);
        }
    }
);

export const addLink = createAsyncThunk(
    'link/addLink',
    async (link: DataLink, { rejectWithValue }) => {
        try {
            const response = await linkApi.addLink(link);
            return response;
        } catch (err: any) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.message);
        }
    }
);

export const deleteLink = createAsyncThunk(
    'link/deleteLink',
    async (link: DataLink, { rejectWithValue }) => {
        try {
            const response = await linkApi.removeLink(link);
            return response;
        } catch (err: any) {
            if (err.response.status === 400) {
                return rejectWithValue(
                    'Cần ít nhất 1 link Admin và 1 link User'
                );
            }
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data.message);
        }
    }
);

const statusReducer = createReducer(initialState, {
    [getStatus.pending.type]: (state, action) => {
        state.loading = true;
    },
    [getStatus.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.data = action.payload;
    },
    [getStatus.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [changeStatus.pending.type]: (state, action) => {
        state.loading = true;
    },
    [changeStatus.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.notification = action.payload;
    },
    [changeStatus.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [getAllLink.pending.type]: (state, action) => {
        state.loading = true;
    },
    [getAllLink.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.linkData = action.payload;
    },
    [getAllLink.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [changeLink.pending.type]: (state, action) => {
        state.loading = true;
    },
    [changeLink.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.notification = action.payload;
    },
    [changeLink.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [addLink.pending.type]: (state, action) => {
        state.loading = true;
    },
    [addLink.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.notification = action.payload;
    },
    [addLink.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [deleteLink.pending.type]: (state, action) => {
        state.loading = true;
    },
    [deleteLink.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.notification = action.payload;
    },
    [deleteLink.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
});

export default statusReducer;
