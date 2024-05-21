import React, {ChangeEvent, ReactElement, Suspense, useContext, useEffect, useState} from 'react';

import {
    Alert,
    Banner,
    Button,
    Checkbox,
    Div,
    FormItem,
    FormLayout,
    FormLayoutGroup,
    FormStatus,
    Group,
    Header,
    Image,
    Panel,
    PanelHeader,
    PanelSpinner,
    Radio,
    RadioGroup,
    Snackbar,
    Spacing,
    Subhead,
    Text,
    Title
} from '@vkontakte/vkui';

import {Icon20CheckNewsfeedOutline, Icon28CancelCircleFillRed, Icon48ArrowRightOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ModalTypes} from "../../modals/ModalRoot";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import example_man_generated from '../../assets/images/example_man_generated.png'
import {useDispatch, useSelector} from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import {ReduxSliceUserInterface, setAccessToken} from "../../redux/slice/UserSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {clearGenerateImage, ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {apiGetImageTypeWithStatistic} from "../../api/AxiosApi";
import {FormDataOptionType, imageTypeStatisticType} from "../../types/ApiTypes";
import PromiseWrapper from "../../api/PromiseWrapper";
import {trueWordForm} from "../../helpers/AppHelper";
import {generateWordsArray} from "../../constants/AppConstants";
import {GenerateStatistic, subscribe} from "../../Events/CustomEvents";
import RecommendedLabels from "../../components/GenerateImage/RecommendedLabels";
import SelectImageSection from "../../components/GenerateImage/SelectImageSection";
import {ButtonGold} from "../../components/RenestraVip/ButtonGold";
import RenestraTitleWithLogo from "../../components/RenestraVip/RenestraTitleWithLogo";
import ButtonHeaderBack from "../../components/ButtonHeaderBack";

interface Props {
    id: string;
}

const PanelData = () => {

    const params = useParams<'imageTypeId'>();
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch()
    const {generateImage} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {vkUserInfo, isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [imageType, setImageType] = useState<imageTypeStatisticType>({
        generate_statistic: {
            available_count_generate: 0,
            generate_in_process: false,
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
    const [formData, setFormData] = useState<FormDataOptionType[]>([])
    const [formDataError, setFormDataError] = useState(false)
    const [disabledOptions, setDisabledOptions] = useState<number[]>([])
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const openPreloaderGenerate = () => {
        setFormDataError(false);

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
            routeNavigator.push('/generate/preloader', {state: {formData, imageTypeId: params?.imageTypeId}})
        }
    }

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

    const updateStatistic = (total: number) => {
        setImageType({
            ...imageType,
            generate_statistic: {
                ...imageType.generate_statistic,
                available_count_generate: imageType.generate_statistic.available_count_generate + total,
                available_day_limit: imageType.generate_statistic.available_day_limit + total,
            }
        });
    }

    const subscribeGroup = () => {
        bridge.send('VKWebAppJoinGroup', {
            group_id: Number(process.env.REACT_APP_APP_GROUP_ID)
        })
            .then((data) => {
                if (!data.result) {
                    openSnackBar(<Icon28CancelCircleFillRed />, 'Ошибка, повторите попытку');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const openSnackBar = (icon: JSX.Element, text: string): void => {
        if (snackbar) return;
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                before={icon}
            >
                {text}
            </Snackbar>,
        );
    };

    useEffect(() => {
        setImageType(PromiseWrapper(apiGetImageTypeWithStatistic(Number(params?.imageTypeId))))
    }, []);

    useEffect(() => {
        const removeSubscribeEvent = subscribe("USER_SUBSCRIBE", (event: GenerateStatistic) => {
            updateStatistic(event.total);
        });

        const removeUnsubscribeEvent = subscribe("USER_UNSUBSCRIBE", (event: GenerateStatistic) => {
            updateStatistic(event.total);
        });

        return () => {
            removeSubscribeEvent()
            removeUnsubscribeEvent()
        }
    }, [imageType.generate_statistic]);

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

    return (
        <React.Fragment>
            <Group>
                <Div style={{textAlign: 'center', display: "flex", flexFlow: 'column', alignItems: 'center', margin: 'auto'}}>
                    <SelectImageSection generateImage={generateImage} getUserToken={getUserToken} />
                    {
                        (imageType.generate_statistic.available_count_generate < 1)
                            ?
                            <React.Fragment>
                                {
                                    !userDbData?.subscribe ?
                                        <React.Fragment>
                                            <Button
                                                onClick={subscribeGroup}
                                                appearance={'accent'}
                                                mode={'primary' } size="l">
                                                Получить +1 генерацию
                                            </Button>
                                            <Banner
                                                size="m"
                                                noPadding
                                                mode="image"
                                                header="У Вас закончились генерации."
                                                subheader={'Подпишитесь на сообщество, чтобы получить ещё 1 ежедневную генерацию.'}
                                                background={<div style={{background: ColorsList.error}} />}
                                                style={{width: '100%', margin: '10px 0 5px 0'}}
                                            />
                                        </React.Fragment>
                                        :
                                        (
                                            userDbData?.is_vip ?
                                                <React.Fragment>
                                                    <Button
                                                        disabled
                                                        appearance='negative'
                                                        mode='secondary'
                                                        size="l">
                                                        Будет доступно завтра
                                                    </Button>
                                                    <Banner
                                                        size="m"
                                                        noPadding
                                                        mode="image"
                                                        header="У Вас закончились генерации."
                                                        subheader={'Возвращайтесь завтра в 00:00 по МСК!'}
                                                        background={<div style={{background: ColorsList.error}} />}
                                                        style={{width: '100%', margin: '10px 0 5px 0'}}
                                                    />
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <ButtonGold style={{width: isMobileSize ? '100%' : 'auto'}}>Оформить подписку VIP</ButtonGold>
                                                    <Spacing />
                                                    <div className="gold_light">
                                                        <div className="vip-block">
                                                            <Title level="3" style={{textAlign: 'left', color: 'white'}}>У вас закончились генерации!</Title>
                                                            <Subhead style={{textAlign: 'left'}}>
                                                                Для того, чтобы увеличить лимит генераций до 20 в день, вы можете оформить VIP подписку.
                                                            </Subhead>
                                                            <Spacing />
                                                            <RenestraTitleWithLogo />
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                        )
                                }
                            </React.Fragment>
                            :
                            <Button disabled={!generateImage} stretched size='l' onClick={openPreloaderGenerate}>
                                Продолжить
                            </Button>
                    }
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
                                                imageType.img_type_to_variant_groups.length > 1
                                                ?
                                                    <React.Fragment>
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
                                                    </React.Fragment>
                                                    :
                                                    <React.Fragment>
                                                        <RadioGroup>
                                                            {
                                                                group.options.map((option, keyOption) => (
                                                                    <Radio
                                                                        name={'option_' + group.group.id}
                                                                        key={keyOption}
                                                                        data-group_id={group.group.id}
                                                                        onChange={handleChangeOption}
                                                                        value={option.id}
                                                                    >
                                                                        {option.name}
                                                                    </Radio>
                                                                ))
                                                            }
                                                        </RadioGroup>
                                                    </React.Fragment>
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
                    header={imageType.generate_statistic.available_count_generate
                        ? `Сегодня вам доступно ещё ${trueWordForm(imageType.generate_statistic.available_count_generate, generateWordsArray)}!`
                        : 'Доступно 0 генераций'}
                    subheader={<Text>Каждый день вам доступно по {trueWordForm(imageType.generate_statistic.available_day_limit, generateWordsArray)}.
                        {
                            !userDbData?.subscribe && <React.Fragment>
                                <br/>Чтобы получить 1 дополнительную генерацию в день, подпишитесь на нашу группу.
                            </React.Fragment>
                        }
                    </Text>}
                    actions={
                        !userDbData?.subscribe && <Button onClick={subscribeGroup} before={<Icon20CheckNewsfeedOutline />} size='s'>Подписаться на сообщество VK</Button>
                    }
                />
            </Group>
            <RecommendedLabels />
            {snackbar}
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
            <PanelHeader before={<ButtonHeaderBack />}>Загрузите фотографию</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />} >
                <PanelData />
            </Suspense>
        </Panel>
    )
}

export default SelectImagePanel;
