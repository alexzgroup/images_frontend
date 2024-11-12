import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {favoriteImageType, imageType} from "../../types/ApiTypes";

export interface ReduxSliceImageInterface {
    popularImageTypes: imageType[],
    favoriteImageTypes: favoriteImageType[],
}

// Define the initial state using that type
const initialState: ReduxSliceImageInterface = {
    popularImageTypes: [],
    favoriteImageTypes: [],
}

export const imageSlice = createSlice({
    name: 'imageSlice',
    initialState,
    reducers: {
        setPopularImageTypes: (state, action: PayloadAction<imageType[]>) => {
            state.popularImageTypes = action.payload;
        },
        setFavoriteImageTypes: (state, action: PayloadAction<favoriteImageType[]>) => {
            state.favoriteImageTypes = action.payload;
        },
    }
})

export const {
    setPopularImageTypes,
    setFavoriteImageTypes,
} = imageSlice.actions

export default imageSlice.reducer
