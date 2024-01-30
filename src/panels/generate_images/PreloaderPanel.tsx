import React, {memo, useEffect, useRef, useState} from 'react';

import {Alert, Card, CardGrid, Group, MiniInfoCell, Panel, PanelHeader, Spinner} from '@vkontakte/vkui';
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {BlockerFunction} from "@remix-run/router/router";
import {Icon20CheckCircleFillGreen} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {
    AdvertisementEnum,
    EAdsFormats,
    FormDataOptionType,
    generateImageType,
    sendGenerateImageType
} from "../../types/ApiTypes";
import {addAdvertisement, apiGenerateImage} from "../../api/AxiosApi";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import bridge from "@vkontakte/vk-bridge";

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

    const [step, setStep] = useState<number>(1)
    const [responseGenerate, setResponseGenerate] = useState<generateImageType & {loading: boolean}>({
        loading: false,
        result: false,
        message: '',
        id: 0,
    })
    const routeNavigator = useRouteNavigator();
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
        }
    }

    useEffect(() => {
        bridge.send("VKWebAppShowNativeAds", {
            ad_format: EAdsFormats.INTERSTITIAL,
        }).then((data) => {
            if (data.result) {
                addAdvertisement({type: AdvertisementEnum.window}).then();
            }
        }).catch();

        routeNavigator.block(blockerFunction);
        initGenerate();
        let stepLocal = 1;
        let timerId = setInterval(() => {
            if (stepLocal > 5) {
                clearInterval(timerId);
            }
            setStep((value) => value + 1);
            stepLocal++;
        },2500);

        return () => {
            clearInterval(timerId)
            routeNavigator.block(() => false);
        }
    }, []);

    useEffect(() => {
        if (step > 5 && responseGenerate.loading && blockedWindow.current) {
            blockedWindow.current = false;

            if (responseGenerate.result) {
                routeNavigator.push(`/show-generate-image/${responseGenerate.id}/share-wall`);
            } else {
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
                        }}
                        header="Внимание!"
                        text={responseGenerate.message}
                    />
                );
            }
        }
    }, [step, responseGenerate]);

    return (
        <Panel id={id}>
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
        </Panel>
    )
}

export default memo(PreloaderPanel);
