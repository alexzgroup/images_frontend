import React, {ChangeEvent, Suspense, useContext, useEffect, useState} from 'react';

import {
    Alert,
    Banner,
    Button,
    Caption,
    Checkbox, Div,
    FormItem,
    FormLayout,
    FormLayoutGroup,
    FormStatus,
    Group,
    Header,
    IconButton,
    Image,
    Link,
    Panel,
    PanelHeader,
    PanelSpinner,
    Spacing,
    Subhead,
    Text,
    usePlatform
} from '@vkontakte/vkui';

import {Icon28AddOutline, Icon32DonateOutline, Icon48ArrowRightOutline} from "@vkontakte/icons";
import {TypeColors} from "../../types/ColorTypes";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ModalTypes} from "../../modals/ModalRoot";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import example_man_generated from '../../assets/images/example_man_generated.png'
import LabelsList from "../../components/LabelsList";
import {useDispatch, useSelector} from "react-redux";
import {UrlConstants} from "../../constants/UrlConstants";
import bridge from "@vkontakte/vk-bridge";
import {ReduxSliceUserInterface, setAccessToken} from "../../redux/slice/UserSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {clearGenerateImage, ReduxSliceImageInterface, setGenerateUploadPhoto} from "../../redux/slice/ImageSlice";
import {addAdvertisement, apiGenerateImage, apiGetImageTypeWithStatistic} from "../../api/AxiosApi";
import {AdvertisementEnum, EAdsFormats, imageTypeStatisticType, sendGenerateImageType} from "../../types/ApiTypes";
import PromiseWrapper from "../../api/PromiseWrapper";
import {getDonutUrl, trueWordForm} from "../../helpers/AppHelper";
import {generateWordsArray} from "../../constants/AppConstants";

interface Props {
    id: string;
}

const RecomendedImageLabels = [
    'Крупный план',
    'Чёткое изображение лица',
    'Селфи или персональная фотография',
]

const NoRecomendedImageLabels = [
    'Много людей на фото',
    'Не настоящие фото',
    'Картинки с интернета',
]

type FormDataOptionType = {
    group_id: number,
    option_id: number,
}

const PanelData = () => {

    const params = useParams<'imageTypeId'>();
    const {isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch()
    const {generateImage} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {access_token, userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [imageType, setImageType] = useState<imageTypeStatisticType>({
        generate_statistic: {
            available_count_generate: 0,
            generate_in_process: false,
            has_not_viewed_image: false,
            available_day_limit: 0,
        },
        img_type_to_variant_groups: [],
        type_variant_to_img_group_variants: [],
        item: {
            id: 0,
            name: '',
            vip: 0,
            url: '',
        }
    });
    const {initSocket} = useContext<AdaptiveContextType>(AdaptiveContext);
    const platform = usePlatform();
    const [formData, setFormData] = useState<FormDataOptionType[]>([])
    const [formDataError, setFormDataError] = useState(false)
    const [disabledOptions, setDisabledOptions] = useState<number[]>([])

    const showProcessModal = async () => {

        bridge.send("VKWebAppShowNativeAds", {
            ad_format: EAdsFormats.INTERSTITIAL,
        }).then((data) => {
            if (data.result) {
                addAdvertisement({type: AdvertisementEnum.window}).then();
            }
        }).catch();

        if (imageType.generate_statistic.has_not_viewed_image) {
            routeNavigator.showModal(ModalTypes.MODAL_GENERATED_IMAGE)
            return;
        }

        setFormDataError(false);
        initSocket()

        if (imageType?.generate_statistic.generate_in_process) {
            routeNavigator.showPopout(
                <Alert
                    actions={[
                        {
                            title: 'Понятно',
                            autoClose: true,
                            mode: 'destructive',
                        },
                    ]}
                    onClose={() => routeNavigator.hidePopout()}
                    header="Внимание!"
                    text="У Вас есть не обработанная генерация, мы оповестим Вас когда она будет готова, после этого вы сможете сгенерировать свой новый образ."
                />
            );
        } else if (generateImage && params?.imageTypeId) {
            if (imageType.img_type_to_variant_groups.length && !formData.length) {
                setFormDataError(true);
                return;
            }

            routeNavigator.showModal(ModalTypes.MODAL_PROCESS_GENERATE_IMAGE)
            const imageUrl = generateImage.sizes[generateImage.sizes.length - 1].url;
            const data: sendGenerateImageType = {
                image_url: imageUrl,
                image_type_id: Number(params?.imageTypeId),
                access_token,
                options: formData,
            }
            const {result, image} = await apiGenerateImage(data)

            if (result) {
                dispatch(setGenerateUploadPhoto(image))
                await routeNavigator.push('/generate/show-image');
            }
        }
    };

    const getUserToken = () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'photos,wall'
        })
            .then((data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))
                    routeNavigator.showModal(ModalTypes.MODAL_SELECT_GENERATE_IMAGE)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleChangeOption = (e: ChangeEvent<HTMLInputElement>) => {
        const {dataset: {group_id}, value: option_id, checked} = e.target
        let data = formData;
        
        if (checked) {
            data.push({group_id: Number(group_id), option_id: Number(option_id)});
        } else {
            data = formData.filter((item) => item.group_id !== Number(group_id) && item.option_id !== Number(option_id));
        }

        setFormData(Array.from(data, (item) => item));
    }

    useEffect(() => {
        setImageType(PromiseWrapper(apiGetImageTypeWithStatistic(Number(params?.imageTypeId))))
    }, []);

    useEffect(() => {
        let disabled = [];

        if (formData.length) {
            // найдем доступные опции
            const lastOptionId = formData[formData.length - 1].option_id;
            const availableOptions = imageType.type_variant_to_img_group_variants.filter((item) => item.type_variant_id === lastOptionId)
            const imageGroups = Array.from(availableOptions, (item) => item.image_group_variant_id)

            for (const typeVariantToImgGroupVariant of imageType.type_variant_to_img_group_variants) {
                if (!imageGroups.includes(typeVariantToImgGroupVariant.image_group_variant_id)) {
                    disabled.push(typeVariantToImgGroupVariant.type_variant_id);
                }
            }
        }

        setDisabledOptions(disabled);
    }, [formData])

    useEffect(() => {
        if (imageType.generate_statistic.has_not_viewed_image) {
            routeNavigator.showModal(ModalTypes.MODAL_GENERATED_IMAGE)
        }
    }, [imageType.generate_statistic]);

    return (
        <React.Fragment>
            <Group>
                <Div style={{textAlign: 'center', display: "flex", flexFlow: 'column', alignItems: 'center', maxWidth: 480, margin: 'auto'}}>
                    <Subhead style={{textAlign: 'center'}}>Выберите свою фотографию с аватарок VK</Subhead>
                    <Spacing />
                    {
                        generateImage
                            ?
                            <Image withBorder={false} size={128} src={generateImage.sizes[generateImage.sizes.length - 1].url}/>
                            :
                            <IconButton onClick={getUserToken} style={{height: 128}}>
                                <Image withBorder={false} size={128}>
                                    <Icon28AddOutline fill='var(--vkui--color_accent_blue)'/>
                                </Image>
                            </IconButton>
                    }
                    <Spacing />
                    <Caption>Нажимая продолжить, вы соглашаетесь с {" "}
                        <Link target='_blank' href={UrlConstants.URL_POLITIC}>политикой конфиденциальности</Link>{" "}
                        и{" "}
                        <Link target='_blank' href={UrlConstants.URL_RULE_APP}>правилами пользования приложением</Link>.
                    </Caption>
                    <Spacing />
                    <Button disabled={!generateImage || imageType.generate_statistic.available_count_generate < 1} stretched size='l' onClick={showProcessModal}>
                        {imageType.generate_statistic.available_count_generate < 1 ? 'Нет доступных генераций' : 'Продолжить'}
                    </Button>
                </Div>
            </Group>
            {
                !!imageType.img_type_to_variant_groups.length &&
                <Group header={<Header>Выберите опции генерации</Header>}>
                    {
                        formDataError &&
                            <FormStatus header="Ошибка отправки формы" mode="error">
                                Необходимо выбрать варианты генерации
                            </FormStatus>
                    }
                        <FormLayout>
                            <FormLayoutGroup mode="horizontal">
                                {
                                    imageType.img_type_to_variant_groups.map((group, groupKey) => (
                                        <FormItem top={group.group.name} key={groupKey}>
                                            {
                                                group.options.map((option, keyOption) => (
                                                    <Checkbox
                                                        style={{
                                                            cursor: disabledOptions.includes(option.id) ? 'no-drop' : ''
                                                        }}
                                                        disabled={disabledOptions.includes(option.id)}
                                                        key={keyOption}
                                                        data-group_id={group.group.id}
                                                        onChange={handleChangeOption}
                                                        value={option.id}
                                                    >
                                                        {option.name}
                                                    </Checkbox>
                                                ))
                                            }
                                        </FormItem>
                                    ))
                                }
                            </FormLayoutGroup>
                        </FormLayout>
                </Group>
            }
            <Group header={<Header>Пример генерации образа:</Header>}>
                <Div style={{display: "flex", alignItems: 'center', justifyContent: isMobileSize ? "space-between" : 'space-around'}}>
                    <div>
                        <Image
                            src={generateImage ? generateImage.sizes[generateImage.sizes.length - 1].url : vkUserInfo?.photo_200}
                            size={96} />
                    </div>
                    <div>
                        <Icon48ArrowRightOutline fill='var(--vkui--color_accent_blue)' />
                    </div>
                    <div>
                        <Image
                            src={imageType.item.url || example_man_generated}
                            size={96} />
                    </div>
                </Div>
            </Group>
            <Group>
                <Banner
                    size="m"
                    header={`Сегодня вам доступно ещё ${trueWordForm(imageType.generate_statistic.available_count_generate, generateWordsArray)}!`}
                    subheader={<Text>Каждый день, вам доступно по {trueWordForm(imageType.generate_statistic.available_day_limit, generateWordsArray)}.
                        {
                            !userDbData?.is_vip && <React.Fragment>
                                <br/>Чтобы увеличить лимит, оформите подписку VK Donut.
                            </React.Fragment>
                        }
                    </Text>}
                    actions={
                        !userDbData?.is_vip && <Button
                            onClick={initSocket}
                            before={<Icon32DonateOutline height={24} width={24} />} mode="primary" size="m">
                            <Link target="_blank" href={getDonutUrl(platform)}>Оформить подписку VK Donut</Link>
                        </Button>
                    }
                />
            </Group>
            <LabelsList type={TypeColors.success} labels={RecomendedImageLabels} header='Рекомендации к фотографиям:' />
            <LabelsList type={TypeColors.error} labels={NoRecomendedImageLabels} header='Не рекомендуем использовать:' />
        </React.Fragment>
    )
}

const SelectImagePanel: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(clearGenerateImage())
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Загрузите фотографию</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />} >
                <PanelData />
            </Suspense>
        </Panel>
    )
}

export default SelectImagePanel;
