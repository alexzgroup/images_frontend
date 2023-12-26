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
    labels?: []|string[],
}

export type typeVariantGroupType = {
    id: number,
    name: string,
}

export type typeVariantType = {
    id: number,
    name: string,
    type_variant_group_id: number,
    total_generate: number,
}

export type generateStatisticType = {
    available_count_generate: number,
    generate_in_process: boolean,
    available_day_limit: number
}

export type typeVariantToImgGroupVariants = {
    image_group_variant_id: number,
    image_type_id: number,
    type_variant_id: number,
    type_variant_group_id: number,
}

export type imageTypeStatisticType = {
    generate_statistic: generateStatisticType,
    item: imageType,
    img_type_to_variant_groups: {
        group: typeVariantGroupType,
        options: typeVariantType[],
    }[],
    type_variant_to_img_group_variants: typeVariantToImgGroupVariants[]|[],
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

export enum generateStatusEnum {
    error = 'error',
    progress = 'progress',
    success = 'success',
}

export type uploadPhotoType = {
    url: string,
    base64: string,
    photo_upload_id: string,
    status: generateStatusEnum,
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

export type socketDonutType = {
    data: {
        status: boolean,
        date_vip_ended: string,
    }
}

export type socketImageType = {
    data: {
        status: boolean,
    }
}

export type sendGenerateImageType = {
    image_url: string,
    image_type_id: number,
    access_token: string,
    options: {},
}
