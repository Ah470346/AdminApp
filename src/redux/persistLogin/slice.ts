import Cookies from 'universal-cookie';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const cookie = new Cookies();

interface persist {
    status: boolean | undefined;
    page: string;
}

const initialState = {
    status: cookie.get('status') === 'true',
    page: window.location.pathname.slice(1),
} as persist;

const counterSlice = createSlice({
    name: 'persist',
    initialState,
    reducers: {
        setPersist(state, action: PayloadAction<boolean>) {
            state.status = action.payload;
        },
        setPage(state, action: PayloadAction<string>) {
            state.page = action.payload;
        },
    },
});

export const { setPersist, setPage } = counterSlice.actions;
export default counterSlice.reducer;
