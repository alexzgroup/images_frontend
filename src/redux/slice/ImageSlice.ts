import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {userImage} from "../../types/UserTypes";
import {uploadPhotoType} from "../../types/ApiTypes";

type uploadPhotoSliceType = uploadPhotoType & {
    photoUploadId: string,
}

export interface ReduxSliceImageInterface {
    generateImage: userImage|null,
    generateImageId: number, // id сгенерированного изображения
    uploadPhoto: uploadPhotoSliceType, // ссылка, base64 для истории и photo_id из ВК для поделиться на стене
}

// Define the initial state using that type
const initialState: ReduxSliceImageInterface = {
    generateImage: null,
    generateImageId: 0,
    uploadPhoto: {
        url: '',
        base64: '',
        photoUploadId: '',
        created_at: '',
        type: 'default',
        image_type: {
            name: '',
        }
    },

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
        setUploadPhoto: (state, action: PayloadAction<uploadPhotoSliceType>) => {
            state.uploadPhoto = action.payload;
        },
    }
})

export const {
    clearGenerateImage,
    setGenerateImage,
    setGenerateImageId,
    setUploadPhoto,
} = imageSlice.actions

export default imageSlice.reducer
