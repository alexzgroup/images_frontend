import React, {Suspense, useContext, useEffect, useState} from 'react';

import {
    Alert,
    Banner,
    Button,
    Caption,
    Group,
    Header,
    IconButton,
    Image,
    Link,
    Panel,
    PanelHeader, PanelSpinner,
    Spacing,
    Subhead,
    Text
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
import {clearGenerateImage, ReduxSliceImageInterface, setGenerateImageUrl} from "../../redux/slice/ImageSlice";
import {apiGenerateImage, apiGetUser} from "../../api/AxiosApi";
import {userAvailableGenerationType} from "../../types/ApiTypes";
import PromiseWrapper from "../../api/PromiseWrapper";
import {trueWordForm} from "../../helpers/AppHelper";
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

const PanelData = () => {

    const params = useParams<'imageTypeId'>();
    const {isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch()
    const {generateImage} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {access_token, userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [availableGenerationData, setAvailableGenerationData] = useState<userAvailableGenerationType>({
        generate_in_process: false,
        available_count_generate: 0,
        available_day_limit: 0,
    });

    const showProcessModal = async () => {
        if (availableGenerationData.generate_in_process) {
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
            routeNavigator.showModal(ModalTypes.MODAL_PROCESS_GENERATE_IMAGE)
            const imageUrl = generateImage.sizes[generateImage.sizes.length - 1].url;
            const {result, image} = await apiGenerateImage(imageUrl, params?.imageTypeId, access_token)

            if (result) {
                dispatch(setGenerateImageUrl(image))
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

    useEffect(() => {
        setAvailableGenerationData(PromiseWrapper(apiGetUser()))
    }, []);

    return (
        <React.Fragment>
            <Group>
                <div style={{textAlign: 'center', display: "flex", flexFlow: 'column', alignItems: 'center', maxWidth: 480, margin: 'auto'}}>
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
                    <Caption>Нажимая продолжить, вы соглашаетесь с
                        <Link href={UrlConstants.URL_POLITIC}>политикой конфиденциальности</Link>
                        и
                        <Link href={UrlConstants.URL_RULE_APP}>правилами пользования приложением</Link>.
                    </Caption>
                    <Spacing />
                    <Button stretched size='l' onClick={showProcessModal}>Продолжить</Button>
                </div>
            </Group>
            <Group header={<Header>Пример генерации образа:</Header>}>
                <div style={{display: "flex", alignItems: 'center', justifyContent: isMobileSize ? "space-between" : 'space-around'}}>
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
                            src={example_man_generated}
                            size={96} />
                    </div>
                </div>
            </Group>
            <Group>
                <Banner
                    size="m"
                    header={`Сегодня вам доступно ещё ${trueWordForm(availableGenerationData.available_count_generate, generateWordsArray)}!`}
                    subheader={<Text>Каждый день, вам доступно по {trueWordForm(availableGenerationData.available_day_limit, generateWordsArray)}.
                        {
                            !userDbData?.is_vip && <React.Fragment>
                                <br/>Чтобы увеличить лимит, оформите подписку VK Donut.
                            </React.Fragment>
                        }
                    </Text>}
                    actions={
                        !userDbData?.is_vip && <Button before={<Icon32DonateOutline height={24} width={24} />} mode="primary" size="m">
                            Оформить подписку VK Donut
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
