import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {userImage} from "../../types/UserTypes";

export interface ReduxSliceImageInterface {
    generateImage: userImage|null,
    generateImageUrl: string|null,
}

// Define the initial state using that type
const initialState: ReduxSliceImageInterface = {
    generateImage: null,
    generateImageUrl: null,
}

export const imageSlice = createSlice({
    name: 'imageSlice',
    initialState,
    reducers: {
        setGenerateImage: (state, action: PayloadAction<userImage>) => {
            state.generateImage = action.payload;
        },
        clearGenerateImage: state => {
            state.generateImage = null;
        },
        setGenerateImageUrl: (state, action: PayloadAction<string>) => {
            state.generateImageUrl = action.payload;
        },
    }
})

export const {
    clearGenerateImage,
    setGenerateImage,
    setGenerateImageUrl,
} = imageSlice.actions

export default imageSlice.reducer
