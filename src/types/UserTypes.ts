export type userSizesImage = {
    height: number,
    width: number,
    url: string,
    type: string,
}

export type userImage = {
    album_id: number,
    id: number,
    sizes: userSizesImage[],
}

export type userVkPhotoType = {
    count: number,
    items: userImage[],
}