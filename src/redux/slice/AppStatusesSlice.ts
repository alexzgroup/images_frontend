import {createSlice} from '@reduxjs/toolkit'

// Define a type for the slice state
export interface ReduxSliceStatusesInterface {
    appIsLoading: boolean,
}

// Define the initial state using that type
const initialState: ReduxSliceStatusesInterface = {
    appIsLoading: true,
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
    }
})

export const {
    showAppLoading,
    hideAppLoading,
} = appStatusesSlice.actions

export default appStatusesSlice.reducer
