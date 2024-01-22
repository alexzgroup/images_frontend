import React, {memo, useEffect, useState} from 'react';

import {Alert, Card, CardGrid, Group, MiniInfoCell, Panel, PanelHeader, Spinner} from '@vkontakte/vkui';
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {BlockerFunction} from "@remix-run/router/router";
import {Icon20CheckCircleFillGreen} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {FormDataOptionType, generateImageType, sendGenerateImageType} from "../../types/ApiTypes";
import {apiGenerateImage} from "../../api/AxiosApi";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";

interface Props {
    id: string;
}

type formDataType = {
    imageTypeId: number,
    formData: FormDataOptionType[],
}

const PreloaderPanel: React.FC<Props> = ({id}) => {
    const {access_token} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {generateImage} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)

    const [step, setStep] = useState<number>(1)
    const [responseGenerate, setResponseGenerate] = useState<generateImageType & {loading: boolean}>({
        loading: false,
        result: false,
        id: 0,
    })
    const routeNavigator = useRouteNavigator();

    const blockerFunction: BlockerFunction = ({ historyAction, nextLocation }) => {
        // true - запрещаем переход, false - разрешаем
        return (step < 6 && !responseGenerate.loading);
    };

    // Получение параметров
    const formDataParams = useMetaParams<formDataType>();

    const initGenerate = async () => {
        if (generateImage && formDataParams) {
            const imageUrl = generateImage.sizes[generateImage.sizes.length - 1].url;

            const data: sendGenerateImageType = {
                image_url: imageUrl,
                image_type_id: formDataParams.imageTypeId,
                access_token,
                options: formDataParams.formData,
            }
            const response = await apiGenerateImage(data)
            setResponseGenerate({...response, loading: true})
        }
    }

    useEffect(() => {
        routeNavigator.block(blockerFunction);
        initGenerate();

        let timerId = setInterval(() => {
            if (step > 6) {
                clearInterval(timerId);
            }
            setStep((value) => value + 1);
        },2000);

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (step > 6 && responseGenerate.loading) {
            if (responseGenerate.result) {
                routeNavigator.push(`/generate/show-image/${responseGenerate.id}`);
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
                            routeNavigator.hidePopout()
                            routeNavigator.push('/');
                        }}
                        header="Внимание!"
                        text="Очень большая загруженность, как только Ваш результат будет готов, мы обязательно сообщим Вам об этом."
                    />
                );
            }
        }
    }, [step, responseGenerate.loading]);

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
                        before={step === 5 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
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