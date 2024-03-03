import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {userApiType} from "../../types/ApiTypes";

export interface ReduxSliceUserInterface {
    userDbData?: userApiType|null,
    access_token: string,
}

// Define the initial state using that type
const initialState: ReduxSliceUserInterface = {
    access_token: '',
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUserDbData: (state, action: PayloadAction<userApiType>) => {
            state.userDbData = action.payload;
        },
        setUserDbDataMonetization: state => {
            if (state.userDbData) {
                state.userDbData = {
                    ...state.userDbData,
                    is_monetization: 1,
                };
            }
        },
        setUserDonut: (state, action: PayloadAction<string>) => {
            if (state.userDbData) {
                state.userDbData = {
                    ...state.userDbData,
                    date_vip_ended: action.payload,
                    is_vip: true,
                };
            }
        },
        setUserSubscribeStatus: (state, action: PayloadAction<boolean>) => {
            if (state.userDbData) {
                state.userDbData = {
                    ...state.userDbData,
                    subscribe: action.payload,
                };
            }
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.access_token = action.payload;
        },
        setUserAllowMessages: (state, action: PayloadAction<number>) => {
            if (state.userDbData) {
                state.userDbData = {
                    ...state.userDbData,
                    allow_messages: action.payload,
                };
            }
        },
    }
})

export const {
    setUserDbData,
    setUserDbDataMonetization,
    setAccessToken,
    setUserDonut,
    setUserSubscribeStatus,
    setUserAllowMessages,
} = userSlice.actions

export default userSlice.reducer
