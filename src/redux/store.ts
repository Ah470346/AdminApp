import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './auth/slice';
import entryReducer from './entry/slice';
import PersistReducer from './persistLogin/slice';
import userReducer from './user/slice';

const reducer = {
    auth: AuthReducer,
    persist: PersistReducer,
    user: userReducer,
    entry: entryReducer,
};

export const store = configureStore({ reducer });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
