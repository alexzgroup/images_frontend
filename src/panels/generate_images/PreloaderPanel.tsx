import React, {memo, useContext, useEffect, useRef, useState} from 'react';

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
import {FormDataOptionType, generateImageType, sendGenerateImageType} from "../../types/ApiTypes";
import {apiGenerateImage} from "../../api/AxiosApi";
import {clearSelectImageFile, ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {ModalTypes} from "../../modals/ModalRoot";

interface Props {
    id: string;
}

type formDataType = {
    imageTypeId: number,
    formData: FormDataOptionType[],
    blockWindow: boolean,
}

const PreloaderPanel: React.FC<Props> = ({id}) => {
    const {selectImageFile} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);

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
        if (selectImageFile && formDataParams) {
            const data: sendGenerateImageType = {
                image_file: selectImageFile,
                image_type_id: formDataParams.imageTypeId,
                options: formDataParams.formData,
            }

            const response = await apiGenerateImage(data)
            setResponseGenerate({...response, loading: true})
            blockedWindow.current = false;

            dispatch(clearSelectImageFile())

            if (response.result) {
                routeNavigator.push(`/show-generate-image/${response.id}/share-wall`);
            } else  {
                routeNavigator.showPopout(
                    <Alert
                        actions={[
                            {
                                title: lang.ALERT.ACCEPT,
                                autoClose: true,
                                mode: 'cancel',
                            },
                        ]}
                        onClose={() => {
                            routeNavigator.hidePopout();
                            routeNavigator.back();
                        }}
                        header={lang.ALERT.WARNING}
                        text={response.message}
                    />
                );
            }
        }
    }

    useEffect(() => {
        if (formDataParams?.imageTypeId && selectImageFile) {
            if (!userDbData?.is_vip) {
                // routeNavigator.showModal(ModalTypes.MODAL_TG_TADS)
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
                (formDataParams?.imageTypeId && selectImageFile)
                    ?
                    <React.Fragment>
                        <PanelHeader>{lang.HEADERS.PRELOADER_PANEL}</PanelHeader>
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
                                {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_1}
                            </MiniInfoCell>
                            {
                                step > 1 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={step === 2 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_2}
                                </MiniInfoCell>
                            }
                            {
                                step > 2 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={step === 3 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_3}
                                </MiniInfoCell>
                            }
                            {
                                step > 3 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={step === 4 ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_4}
                                </MiniInfoCell>
                            }
                            {
                                step > 4 &&
                                <MiniInfoCell
                                    textWrap="short"
                                    before={(step === 5 || !responseGenerate.loading) ? <Spinner size="regular" style={{color: ColorsList.primary}} /> : <Icon20CheckCircleFillGreen />}
                                    expandable={false}
                                >
                                    {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_5}
                                </MiniInfoCell>
                            }
                        </Group>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <PanelHeader>{lang.TITLES.PRELOADER_PANEL_FINISH}</PanelHeader>
                        <Placeholder
                            stretched
                            icon={<Icon56ErrorTriangleOutline fill={ColorsList.error} />}
                            header={lang.DESCRIPTIONS.PRELOADER_PANEL_FINISH}
                            action={<Button size="m" onClick={() => routeNavigator.back()}>Повторить</Button>}
                        >
                            {lang.DESCRIPTIONS.PRELOADER_PANEL_FINISH_DESCRIPTION}
                        </Placeholder>
                    </React.Fragment>
            }
        </Panel>
    )
}

export default memo(PreloaderPanel);
