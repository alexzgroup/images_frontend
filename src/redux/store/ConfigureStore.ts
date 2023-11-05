import { configureStore } from '@reduxjs/toolkit'
import appStatusesReducer from "../slice/AppStatusesSlice";
import userReducer from "../slice/UserSlice";
import imageReducer from "../slice/ImageSlice";

export const AppConfigureStore = configureStore({
    reducer: {
        appStatuses: appStatusesReducer,
        user: userReducer,
        image: imageReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootStateType = ReturnType<typeof AppConfigureStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatchType = typeof AppConfigureStore.dispatch
