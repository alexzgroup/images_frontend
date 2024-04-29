import React, {ReactElement, Suspense, useEffect, useState} from 'react';

import {
    Alert,
    Banner,
    Button,
    CustomSelect,
    Div,
    FormItem,
    Group,
    Panel,
    PanelHeader,
    PanelSpinner,
    Snackbar,
    Text
} from '@vkontakte/vkui';

import {Icon20CheckNewsfeedOutline, Icon28CancelCircleFillRed} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ModalTypes} from "../../modals/ModalRoot";
import {useDispatch, useSelector} from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import {ReduxSliceUserInterface, setAccessToken} from "../../redux/slice/UserSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {clearGenerateImage, ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {apiGetImageTypeWithStatistic} from "../../api/AxiosApi";
import {imageTypeStatisticType} from "../../types/ApiTypes";
import PromiseWrapper from "../../api/PromiseWrapper";
import {trueWordForm} from "../../helpers/AppHelper";
import {generateWordsArray} from "../../constants/AppConstants";
import {GenerateStatistic, subscribe} from "../../Events/CustomEvents";
import RecommendedLabels from "../../components/GenerateImage/RecommendedLabels";
import SelectImageSection from "../../components/GenerateImage/SelectImageSection";

interface Props {
    id: string;
}

const PanelData = () => {
    const params = useParams<'imageTypeId'>();
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch()
    const {generateImage} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
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
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);
    const [zodiac, setZodiac] = React.useState<string>('');
    const [zodiacSelectError, setZodiacSelectError] = React.useState<string>('');

    const openPreloaderGenerate = () => {
        setZodiacSelectError('');
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
            if (!zodiac) {
                setZodiacSelectError('Выберите значение');
            } else {
                routeNavigator.push('/generate/preloader', {state: {formData: {zodiac}, imageTypeId: params?.imageTypeId}})
            }
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
        if (zodiac) {
            setZodiacSelectError('');
        }
    }, [zodiac]);

    return (
        <React.Fragment>
            <Group>
                <Div style={{textAlign: 'center', display: "flex", flexFlow: 'column', alignItems: 'center', maxWidth: 480, margin: 'auto'}}>
                    <SelectImageSection generateImage={generateImage} getUserToken={getUserToken} />
                    {
                        imageType.zodiac &&
                            <FormItem
                                status={zodiac ? 'valid' : (zodiacSelectError ? 'error' : 'default')}
                                top="Знак зодиака"
                                bottom={zodiacSelectError || ''}
                                htmlFor="zodiac"
                                style={{width: '100%'}}
                            >
                                <CustomSelect
                                    onChange={(e) => setZodiac(e.target.value)}
                                    id="zodiac"
                                    placeholder="Не выбран"
                                    options={imageType.zodiac}
                                />
                            </FormItem>
                    }
                    {
                        (imageType.generate_statistic.available_count_generate < 1)
                            ?
                            <React.Fragment>
                                <Button
                                    stretched
                                    disabled={userDbData?.subscribe}
                                    onClick={subscribeGroup}
                                    appearance={userDbData?.subscribe ? 'negative' : 'accent'}
                                    mode={userDbData?.subscribe ? 'secondary' : 'primary' } size="l">
                                    {userDbData?.subscribe ? 'Будет доступно завтра' : 'Получить +1 генерацию'}
                                </Button>
                                {
                                    userDbData?.subscribe &&
                                    <Banner
                                        size="m"
                                        noPadding
                                        mode="image"
                                        header="У Вас закончились генерации гороскопов."
                                        subheader={'Возвращайтесь завтра в 00:00 по МСК!'}
                                        background={<div style={{background: ColorsList.error}} />}
                                        style={{width: '100%', margin: '10px 0 5px 0'}}
                                    />
                                }
                            </React.Fragment>
                            :
                            <Button disabled={!generateImage} stretched size='l' onClick={openPreloaderGenerate}>
                                Продолжить
                            </Button>
                    }
                </Div>
            </Group>
            <Group>
                <Banner
                    size="m"
                    header={imageType.generate_statistic.available_count_generate
                        ? `Сегодня вам доступна ещё ${trueWordForm(imageType.generate_statistic.available_count_generate, generateWordsArray)}!`
                        : userDbData?.subscribe ? 'Доступно 0 генераций' : `Сегодня Вам доступна ${trueWordForm(1, generateWordsArray)}`}
                    subheader={<Text>Каждый день вам доступна одна генерация гороскопа. В 00:00 по МСК счетчик обновляется.
                        {
                            !userDbData?.subscribe && <React.Fragment>
                                <br/>Чтобы получить генерацию, подпишитесь на нашу группу.
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

const SelectImageZodiacPanel: React.FC<Props> = ({id}) => {
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

export default SelectImageZodiacPanel;
