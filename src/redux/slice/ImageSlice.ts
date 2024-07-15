import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {userImage} from "../../types/UserTypes";
import {favoriteImageType, GenerateImageNoShareType, imageType, uploadPhotoType} from "../../types/ApiTypes";

type uploadPhotoSliceType = uploadPhotoType & {
    photoUploadId: string,
}

export interface ReduxSliceImageInterface {
    generateImage: userImage|null,
    generateImageId: number, // id сгенерированного изображения
    uploadPhoto: uploadPhotoSliceType, // ссылка, base64 для истории и photo_id из ВК для поделиться на стене
    popularImageTypes: imageType[],
    favoriteImageTypes: favoriteImageType[],
    generateImagesNotShareWall: GenerateImageNoShareType[],
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
    popularImageTypes: [],
    favoriteImageTypes: [],
    generateImagesNotShareWall: [],
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
        setPopularImageTypes: (state, action: PayloadAction<imageType[]>) => {
            state.popularImageTypes = action.payload;
        },
        setFavoriteImageTypes: (state, action: PayloadAction<favoriteImageType[]>) => {
            state.favoriteImageTypes = action.payload;
        },
        setGenerateImagesNotShareWall: (state, action: PayloadAction<GenerateImageNoShareType[]>) => {
            state.generateImagesNotShareWall = action.payload;
        },
        deleteGenerateImagesNotShareWall: (state, action: PayloadAction<number>) => {
            state.generateImagesNotShareWall = state.generateImagesNotShareWall.filter((item) => item.id !== action.payload);
        },
    }
})

export const {
    clearGenerateImage,
    setGenerateImage,
    setGenerateImageId,
    setUploadPhoto,
    setGenerateImagesNotShareWall,
    setPopularImageTypes,
    setFavoriteImageTypes,
    deleteGenerateImagesNotShareWall,
} = imageSlice.actions

export default imageSlice.reducer
