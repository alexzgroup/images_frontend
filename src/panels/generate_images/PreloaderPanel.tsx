import React, {memo, useEffect, useRef, useState} from 'react';

import {
    Alert,
    Button,
    Card,
    CardGrid,
    Group,
    MiniInfoCell,
    Panel,
    PanelHeader,
    Placeholder,
    Spinner
} from '@vkontakte/vkui';
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {BlockerFunction} from "@remix-run/router/router";
import {Icon20CheckCircleFillGreen, Icon56ErrorTriangleOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {
    AdvertisementEnum,
    EAdsFormats,
    FormDataOptionType,
    generateImageType,
    sendGenerateImageType
} from "../../types/ApiTypes";
import {addAdvertisement, apiGenerateImage} from "../../api/AxiosApi";
import {clearGenerateImage, ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import bridge from "@vkontakte/vk-bridge";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";

interface Props {
    id: string;
}

type formDataType = {
    imageTypeId: number,
    formData: FormDataOptionType[],
    blockWindow: boolean,
}

const PreloaderPanel: React.FC<Props> = ({id}) => {
    const {generateImage} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const [step, setStep] = useState<number>(1)
    const [responseGenerate, setResponseGenerate] = useState<generateImageType & {loading: boolean}>({
        loading: false,
        result: false,
        message: '',
        id: 0,
    })
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch();
    let blockedWindow = useRef(true)

    const blockerFunction: BlockerFunction = ({ historyAction, nextLocation, currentLocation }) => {
        // true - запрещаем переход, false - разрешаем
        return blockedWindow.current;
    };

    // Получение параметров
    const formDataParams = useMetaParams<formDataType>();

    const initGenerate = async () => {
        if (generateImage && formDataParams) {
            const imageUrl = generateImage.sizes[generateImage.sizes.length - 1].url;

            const data: sendGenerateImageType = {
                image_url: imageUrl,
                image_type_id: formDataParams.imageTypeId,
                options: formDataParams.formData,
            }
            const response = await apiGenerateImage(data)
            setResponseGenerate({...response, loading: true})
            blockedWindow.current = false;

            dispatch(clearGenerateImage())

            if (response.result) {
                routeNavigator.push(`/show-generate-image/${response.id}/share-wall`);
            } else  {
                routeNavigator.showPopout(
                    <Alert
                        actions={[
                            {
                                title: 'Понятно',
                                autoClose: true,
                                mode: 'cancel',
                            },
                        ]}
                        onClose={() => {
                            routeNavigator.hidePopout();
                            routeNavigator.back();
                        }}
                        header="Внимание!"
                        text={response.message}
                    />
                );
            }
        }
    }

    useEffect(() => {
        if (formDataParams?.imageTypeId && generateImage) {
            if (!userDbData?.is_vip) {
                bridge.send("VKWebAppShowNativeAds", {
                    ad_format: EAdsFormats.INTERSTITIAL,
                }).then((data) => {
                    if (data.result) {
                        addAdvertisement({type: AdvertisementEnum.window}).then();
                    }
                }).catch();
            }

            routeNavigator.block(blockerFunction);
            initGenerate();
            let stepLocal = 1;
            let timerId = setInterval(() => {
                if (stepLocal > 5) {
                    clearInterval(timerId);
                }
                setStep((value) => value + 1);
                stepLocal++;
            },2000);

            return () => {
                clearInterval(timerId)
                routeNavigator.block(() => false);
            }
        }
    }, []);

    return (
        <Panel id={id}>
            {
                (formDataParams?.imageTypeId && generateImage)
                    ?
                    <React.Fragment>
                        <PanelHeader>Генерация началась</PanelHeader>
                        <Group>
                            <CardGrid size="l">
                                <Card className="animate-gradient">
                                    <div style={{ paddingBottom: '120px' }} />
                                </Card>
                                <Card className="animate-gradient">
                                    <div style={{ paddingBottom: '40px' }} />
                                </Card>
                                <Card className="animate-gradient">
                                    <div style={{ paddingBottom: '80px' }} />
                                </Card>
                            </CardGrid>
                            <MiniInfoCell
                                textWrap="short"
                                before={step === 1 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                expandable={false}
                            >
                                Запущен процесс генерации
                            </MiniInfoCell>
                            {
                                step > 1 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={step === 2 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    Подключение к серверу генерации
                                </MiniInfoCell>
                            }
                            {
                                step > 2 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={step === 3 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    Подбираем образ для Вас
                                </MiniInfoCell>
                            }
                            {
                                step > 3 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={step === 4 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    Подготавливаем результат
                                </MiniInfoCell>
                            }
                            {
                                step > 4 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={(step === 5 || !responseGenerate.loading) ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    Ещё немного...
                                </MiniInfoCell>
                            }
                        </Group>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <PanelHeader>Генерация завершена</PanelHeader>
                        <Placeholder
                            stretched
                            icon={<Icon56ErrorTriangleOutline fill={ColorsList.error} />}
                            header="Генерация закончилась!"
                            action={<Button size="m" onClick={() => routeNavigator.back()}>Повторить</Button>}
                        >
                            Вернитесь на экран генерации изображений.
                        </Placeholder>
                    </React.Fragment>
            }
        </Panel>
    )
}

export default memo(PreloaderPanel);
