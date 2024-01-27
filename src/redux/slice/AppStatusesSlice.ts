import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// Define a type for the slice state
export interface ReduxSliceStatusesInterface {
    appIsLoading: boolean,
    windowBlocked: boolean,
}

// Define the initial state using that type
const initialState: ReduxSliceStatusesInterface = {
    appIsLoading: true,
    windowBlocked: false,
}

export const appStatusesSlice = createSlice({
    name: 'appStatusesSlice',
    initialState,
    reducers: {
        showAppLoading: state => {
            state.appIsLoading = true;
        },
        hideAppLoading: state => {
            state.appIsLoading = false;
        },
        setWindowBlocked: (state, action: PayloadAction<boolean>) => {
            state.windowBlocked = action.payload;
        },
    }
})

export const {
    showAppLoading,
    hideAppLoading,
    setWindowBlocked,
} = appStatusesSlice.actions

export default appStatusesSlice.reducer
