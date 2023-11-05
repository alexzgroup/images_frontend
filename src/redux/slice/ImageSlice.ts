import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface ReduxSliceImageInterface {
    generateImage: string|null,
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
        setGenerateImage: (state, action: PayloadAction<string>) => {
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
