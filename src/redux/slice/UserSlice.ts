import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {userApiType} from "../../types/ApiTypes";

export interface ReduxSliceUserInterface {
    userDbData?: userApiType|null,
}

// Define the initial state using that type
const initialState: ReduxSliceUserInterface = {}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUserDbData: (state, action: PayloadAction<userApiType>) => {
            state.userDbData = action.payload;
        },
        setUserVip: (state, action: PayloadAction<{is_vip: boolean}>) => {
            if (state.userDbData) {
                state.userDbData = {
                    ...state.userDbData,
                    is_vip: action.payload.is_vip,
                };
            }
        },
        setUserDateVip: (state, action: PayloadAction<{date_vip_ended: string}>) => {
            if (state.userDbData) {
                state.userDbData = {
                    ...state.userDbData,
                    date_vip_ended: action.payload.date_vip_ended,
                    is_vip: true,
                };
            }
        },
    }
})

export const {
    setUserDbData,
    setUserVip,
    setUserDateVip,
} = userSlice.actions

export default userSlice.reducer
