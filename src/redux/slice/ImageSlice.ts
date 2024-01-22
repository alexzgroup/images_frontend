import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {userImage} from "../../types/UserTypes";

export interface ReduxSliceImageInterface {
    generateImage: userImage|null,
    generateImageId: number,
}

// Define the initial state using that type
const initialState: ReduxSliceImageInterface = {
    generateImage: null,
    generateImageId: 0,
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
        setGenerateImageId: (state, action: PayloadAction<number>) => {
            state.generateImageId = action.payload
        },
    }
})

export const {
    clearGenerateImage,
    setGenerateImage,
    setGenerateImageId,
} = imageSlice.actions

export default imageSlice.reducer
