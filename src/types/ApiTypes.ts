export type userApiType = {
    balance: number,
    bdate: string,
    first_name: string,
    last_name: string,
    id: number,
    photo_100: string,
    sex: 0|1|2,
    vk_group_id?: number,
    is_monetization: number|null,
    date_vip_ended: string|null,
    is_vip: boolean,
}

export type imageType = {
    id: number,
    name: string,
    vip: 0|1,
    labels: []|string[],
}

export type initUserApiType = {
    user: userApiType,
    popular_image_types: imageType[],
}

export type groupType = {
    id: number,
    name: string,
    photo_100: string,
    members_count: number,
    pays_count?: number,
    users_count?: number,
    pays_sum_amount?: number,
}

export type operationResultType = {
    result: boolean,
}

export type operationWithMessageType = operationResultType & {
    message: string,
}

export type uploadPhotoType = {
    url: string,
    photo_upload_id: string,
}

export type generateImageType = operationResultType & {
    image: uploadPhotoType,
}

export type monetizationDataType = {
    available_balance: number,
    subscribes: number,
    total_pays: number,
    groups: groupType[]|[],
}

export type userAvailableGenerationType = {
    generate_in_process: boolean,
    available_count_generate: number,
    available_day_limit: number,
}
