import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import getUserApi from '../../api/getUserApi';
import { DataCode, DataLock, DataStatus, DataTable } from '../../type';
import { convertData } from '../../typeFunction';

// Define the initial state using that type
interface user {
    loading: boolean;
    dataTableUser: DataTable[];
    error: null | string;
    notification: string;
}

const initialState: user = {
    loading: false,
    dataTableUser: [],
    error: null,
    notification: '',
};

export const getUser = createAsyncThunk(
    'user/getUser',
    async (token: string, { rejectWithValue }) => {
        try {
            const response: any = await getUserApi.getUser();
            if (response) return response.results;
        } catch (err: any) {
            if (err.response.status === 500) {
                return rejectWithValue('Server is disconnected!');
            } else {
                return rejectWithValue(err.response.data.err);
            }
            // if (err.response.status === 401) {
            //     const response = await checkToken(true);
            //     if (response.status === 'Done') {
            //         await getUser(response.token);
            //     } else {
            //         refresh(true);
            //         return rejectWithValue('Your login has expired!');
            //     }
            // }
            // if (err.response.status === 402) {
            //     const response = await checkToken(false);
            //     if (response) {
            //         refresh(true);
            //         return rejectWithValue('Your login has expired!');
            //     }
            // }
            // if (err.response.status === 500) {
            //     return rejectWithValue('Server is disconnected!');
            // } else {
            //     return rejectWithValue(err.response.data.message);
            // }

            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
        }
    }
);

export const changeLock = createAsyncThunk(
    'user/changeLock',
    async (lock: DataLock, { rejectWithValue }) => {
        try {
            const response: any = await getUserApi.changeLock(lock);
            return response.message;
        } catch (err: any) {
            if (err.response.status === 500) {
                return rejectWithValue('Server is disconnected!');
            } else {
                return rejectWithValue(err.response.data.message);
            }
        }
    }
);

export const changeStatus = createAsyncThunk(
    'user/changeStatus',
    async (status: DataStatus, { rejectWithValue }) => {
        try {
            const response: any = await getUserApi.changeStatus(status);
            return response.message;
        } catch (err: any) {
            if (err.response.status === 500) {
                return rejectWithValue('Server is disconnected!');
            } else {
                return rejectWithValue(err.response.data.message);
            }
        }
    }
);

export const addCode = createAsyncThunk(
    'user/addCode',
    async (code: DataCode, { rejectWithValue }) => {
        try {
            const response: any = await getUserApi.changeCode(code);
            return response.message;
        } catch (err: any) {
            if (err.response.status === 500) {
                return rejectWithValue('Server is disconnected!');
            } else {
                return rejectWithValue(err.response.data.message);
            }
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id: string, { rejectWithValue }) => {
        try {
            const response: any = await getUserApi.removeUser(id);
            return response.message;
        } catch (err: any) {
            if (err.response.status === 500) {
                return rejectWithValue('Server is disconnected!');
            } else {
                return rejectWithValue(err.response.data.message);
            }
        }
    }
);

const userReducer = createReducer(initialState, {
    [getUser.pending.type]: (state, action) => {
        state.loading = true;
    },
    [getUser.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.dataTableUser = convertData(action.payload);
    },
    [getUser.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [changeLock.pending.type]: (state, action) => {
        state.loading = true;
    },
    [changeLock.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.notification = action.payload;
    },
    [changeLock.rejected.type]: (state, action) => {
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
    [addCode.pending.type]: (state, action) => {
        state.loading = true;
    },
    [addCode.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.notification = action.payload;
    },
    [addCode.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [deleteUser.pending.type]: (state, action) => {
        state.loading = true;
    },
    [deleteUser.fulfilled.type]: (state, action) => {
        state.loading = false;
        state.notification = action.payload;
    },
    [deleteUser.rejected.type]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
});

export default userReducer;
