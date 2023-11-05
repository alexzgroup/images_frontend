export type userApiType = {
    balance: number,
    bdate: string,
    first_name: string,
    last_name: string,
    id: number,
    photo_100: string,
    sex: 0|1|2,
    vk_group_id?: number,
    is_monetization?: number,
    date_vip_ended?: number,
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

export type generateImageType = operationResultType & {
    image_url: string,
}

export type monetizationDataType = {
    available_balance: number,
    subscribes: number,
    total_pays: number,
    groups: groupType[]|[],
}
