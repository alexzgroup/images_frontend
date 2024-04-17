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
    allow_messages: number,
    subscribe: boolean,
    voice_subscribe: voiceSubscribeType|null,
}

export type voiceSubscribeType = {
    cancel_reason?: string|null,
    status?: 'new'|'chargeable'|'active'|'cancelled',
    subscription_id: number,
    pending_cancel: number|null,
}

export type imageType = {
    id: number,
    name: string,
    vip: 0|1,
    url?: string,
    labels?: []|string[],
}

export type exclusiveImageTypesType = {
    id: number,
    name: string,
    url: string,
    type: string,
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
    available_day_limit: number,
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
    zodiac?: [],
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
    base64: string,
    type: 'default'|'name'|'zodiac',
}

export type generateImageType = operationWithMessageType & {
    id: number,
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

export type socketVoiceSubscriptionType = {
    data: {
        date_vip_ended: string,
    }
}

export type socketImageType = {
    data: {
        status: boolean,
        id: number,
    }
}

export type socketSubscribeType = {
    data: {
        subscribe: boolean,
    }
}

export type sendGenerateImageType = {
    image_url: string,
    image_type_id: number,
    options: FormDataOptionType[]|[],
}

export type AddGroupChatBootType = {
    vk_group_id: number,
    secret_key: string,
    code_answer: string,
    access_token: string,
}

export type GroupToChatBootType = {
    server_id: number,
    vk_group_id: number,
}

export enum AdvertisementEnum {
    banner='banner',
    window='window',
}

export type AdvertisementType = {
    type: AdvertisementEnum,
}

export enum EAdsFormats {
    REWARD = "reward",
    INTERSTITIAL = "interstitial"
}

export type FormDataOptionType = {
    group_id: number,
    option_id: number,
}

export type GeneratedImageType = {
    id: number,
    url: string,
}

export type GeneratedImagesType = {
    images: GeneratedImageType[],
}

export type UploadPhotoToServerType = {
    generate_image_id: number,
    upload_url: string,
}

export type ResponseUploadPhotoType = {
    hash: string,
    photo: string,
    server: number
}

export enum ShareTypeEnum {
    SHARE_WALL = "share_wall",
    SHARE_HISTORY = "share_history"
}
