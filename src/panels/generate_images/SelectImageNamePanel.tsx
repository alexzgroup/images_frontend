import React, {Suspense, useEffect, useState} from 'react';

import {
    Alert,
    Banner,
    Button,
    Div,
    Group,
    MiniInfoCell,
    Panel,
    PanelHeader,
    PanelSpinner,
    Text,
    Title
} from '@vkontakte/vkui';

import {Icon36Favorite} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ModalTypes} from "../../modals/ModalRoot";
import {useDispatch, useSelector} from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import {ReduxSliceUserInterface, setAccessToken} from "../../redux/slice/UserSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {clearSelectImageFile, ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {addAdvertisement, apiGetImageTypeWithStatistic} from "../../api/AxiosApi";
import {AdvertisementEnum, EAdsFormats, imageTypeStatisticType} from "../../types/ApiTypes";
import PromiseWrapper from "../../api/PromiseWrapper";
import RecommendedLabels from "../../components/GenerateImage/RecommendedLabels";
import SelectImageSection from "../../components/GenerateImage/SelectImageSection";
import ButtonHeaderBack from "../../components/ButtonHeaderBack";

interface Props {
    id: string;
}

const PanelData = () => {
    const params = useParams<'imageTypeId'>();
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch()
    const {selectImageFile} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
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

    const openPreloaderGenerate = () => {
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
        } else if (selectImageFile && params?.imageTypeId) {
            routeNavigator.push('/generate/preloader', {state: {formData: null, imageTypeId: params?.imageTypeId}})
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

    useEffect(() => {
        setImageType(PromiseWrapper(apiGetImageTypeWithStatistic(Number(params?.imageTypeId))))
        if (!userDbData?.is_vip) {
            bridge.send("VKWebAppShowNativeAds", {
                ad_format: EAdsFormats.INTERSTITIAL,
            }).then((data) => {
                if (data.result) {
                    addAdvertisement({type: AdvertisementEnum.window}).then();
                }
            }).catch(() => {});
        }
    }, []);

    return (
        <React.Fragment>
            <Group>
                <Div style={{textAlign: 'center', display: "flex", flexFlow: 'column', alignItems: 'center', margin: 'auto'}}>
                    <SelectImageSection />
                    {
                        (imageType.generate_statistic.available_count_generate < 1)
                            ?
                            <React.Fragment>
                                <Button
                                    stretched
                                    disabled
                                    appearance='negative'
                                    mode='secondary'
                                    size="l"
                                >
                                    Будет доступно завтра
                                </Button>
                                <Banner
                                    size="m"
                                    noPadding
                                    mode="image"
                                    header="У Вас закончились генерации значения имени."
                                    subheader={'Возвращайтесь завтра в 00:00 по МСК!'}
                                    background={<div style={{background: ColorsList.error}}/>}
                                    style={{width: '100%', margin: '10px 0 5px 0'}}
                                />
                            </React.Fragment>
                            :
                            <Button disabled={!selectImageFile} stretched size='l' onClick={openPreloaderGenerate}>
                                Продолжить
                            </Button>
                    }
                </Div>
            </Group>
            <Group>
                <MiniInfoCell mode="accent" before={<Icon36Favorite fill={ColorsList.primary} />} textWrap="full">
                    <Title weight="2" level="2">
                        Узнай, как тебя охарактеризовывает твоё имя и внешность!
                    </Title>
                </MiniInfoCell>
            </Group>
            <Group>
                <Banner
                    size="m"
                    header={imageType.generate_statistic.available_count_generate
                        ? `Сегодня вам доступна ещё 1 генерация!`
                        : 'Доступно 0 генераций'}
                    subheader={<Text>Каждый день вам доступна одна генерация значения имени. В 00:00 по МСК счетчик обновляется.</Text>}
                />
            </Group>
            <RecommendedLabels />
        </React.Fragment>
    )
}

const SelectImageNamePanel: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(clearSelectImageFile())
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

export default SelectImageNamePanel;
