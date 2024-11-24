import {ITelegramUser} from "./Telegram";

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
    is_vip: boolean,
    allow_messages: number,
    subscribe: boolean,
    voice_subscribe: voiceSubscribeType|null,
    date_vip_ended: string,
}

export type voiceSubscribeType = {
    subscription_id: number,
    pending_cancel: number|null,
}

export type TLanguage = {
    value: string,
}

export type imageType = {
    id: number,
    name: string,
    vip: 0|1,
    type: 'default'|'name'|'zodiac',
    url?: string,
    labels?: []|string[],
    language?: TLanguage,
}

export type exclusiveImageTypesType = {
    id: number,
    name: string,
    url: string,
    type: string,
    language?: TLanguage,
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
    generate_in_process: boolean,
}

export type typeVariantToImgGroupVariants = {
    image_group_variant_id: number,
    image_type_id: number,
    type_variant_id: number,
    type_variant_group_id: number,
}

export type imageTypeStatisticType = {
    generate_statistic: generateStatisticType,
    available_image_limit: TAvailableImageLimit,
    item: imageType,
    img_type_to_variant_groups: {
        group: typeVariantGroupType,
        options: typeVariantType[],
    }[],
    type_variant_to_img_group_variants: typeVariantToImgGroupVariants[]|[],
    zodiac?: [],
}

export type favoriteImageType = exclusiveImageTypesType & {
    description: string,
}

export type GenerateImageNoShareType = GeneratedImageType & {
    type?: string
}

export type TAvailableImageLimit = {
    available_images: number,
    last_advert: {
        id: number,
        vk_user_id: number,
        type: 'tg_tads' | 'ads_gram',
        created_at: string,
    },
    nex_free_image_available: boolean
}

export type initUserApiType = {
    user: userApiType,
    popular_image_types: imageType[],
    favorite_image_types: favoriteImageType[],
    generated_images_not_share_wall: GenerateImageNoShareType[],
}

export type operationResultType = {
    result: boolean,
}

export type operationWithMessageType = operationResultType & {
    message: string,
}

export type TInvoiceLink = operationResultType & {
    link: string,
}

export type TSavePreparedInlineMessage = operationResultType & {
    id: string,
}

export type generateImageType = operationWithMessageType & {
    id: number,
    image: GeneratedImageType,
    image_type: imageType,
}

export enum AdvertisementEnum {
    tg_tads='tg_tads',
}

export type AdvertisementType = {
    type: AdvertisementEnum,
}

export type FormDataOptionType = {
    group_id: number,
    option_id: number,
}

export type GeneratedImageType = {
    id: number,
    url: string,
    created_at?: string,
    image_type_id?: number,
    image_type: imageType,
}

export type GeneratedImagesType = {
    images: GeneratedImageType[],
}

export enum ShareTypeEnum {
    SHARE_HISTORY = "share_history",
}

export type GenerateProfileInfoType = {
    popular_image_type_name: string,
    last_date_generate: string,
    total_generate: number,
    history_generate: GeneratedImageType[],
}

export type UserWithGeneratedInfoType = ITelegramUser & GenerateProfileInfoType

export type socketDonutType = {
    data: {
        date_vip_ended: string,
        status: boolean,
    }
}
