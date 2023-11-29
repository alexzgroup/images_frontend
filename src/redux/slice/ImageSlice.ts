import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {userImage} from "../../types/UserTypes";
import {uploadPhotoType} from "../../types/ApiTypes";

export interface ReduxSliceImageInterface {
    generateImage: userImage|null,
    uploadPhoto?: uploadPhotoType,
}

// Define the initial state using that type
const initialState: ReduxSliceImageInterface = {
    generateImage: null,
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
        setGenerateImageUrl: (state, action: PayloadAction<uploadPhotoType>) => {
            state.uploadPhoto = action.payload;
        },
    }
})

export const {
    clearGenerateImage,
    setGenerateImage,
    setGenerateImageUrl,
} = imageSlice.actions

export default imageSlice.reducer
