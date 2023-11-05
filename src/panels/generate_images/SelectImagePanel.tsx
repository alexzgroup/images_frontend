import React, {useContext, useEffect} from 'react';

import {
    Banner,
    Button,
    Caption,
    Group,
    Header,
    IconButton,
    Image,
    Link,
    Panel,
    PanelHeader,
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
import {setAccessToken} from "../../redux/slice/UserSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {clearGenerateImage, ReduxSliceImageInterface, setGenerateImageUrl} from "../../redux/slice/ImageSlice";
import {apiGenerateImage} from "../../api/AxiosApi";

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

const SelectImagePanel: React.FC<Props> = ({id}) => {
    const params = useParams<'imageTypeId'>();
    const {isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch()
    const {generateImage} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);

    const showProcessModal = async () => {
        if (generateImage && params?.imageTypeId) {
            routeNavigator.showModal(ModalTypes.MODAL_PROCESS_GENERATE_IMAGE)
            const {result, image_url} = await apiGenerateImage(generateImage, params?.imageTypeId)

            if (result) {
                dispatch(setGenerateImageUrl(image_url))
                await routeNavigator.push('/generate/show-image');
            }
        }
    };

    const getUserToken = () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'photos'
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


        return () => {
            dispatch(clearGenerateImage())
        }
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Загрузите фотографию</PanelHeader>
            <Group>
                <div style={{textAlign: 'center', display: "flex", flexFlow: 'column', alignItems: 'center', maxWidth: 480, margin: 'auto'}}>
                    <Subhead style={{textAlign: 'center'}}>Выберите свою фотографию с аватарок VK</Subhead>
                    <Spacing />
                    {
                        generateImage
                            ?
                            <Image withBorder={false} size={128} src={generateImage}/>
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
                            src={generateImage || vkUserInfo?.photo_200}
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
                    header="Сегодня вам доступно ещё 2 генерации!"
                    subheader={<Text>Каждый день, вам доступно по 2 генерации.<br/>Чтобы увеличить лимит, оформите подписку VK Donut.</Text>}
                    actions={
                        <Button before={<Icon32DonateOutline height={24} width={24} />} mode="primary" size="m">
                            Оформить подписку VK Donut
                        </Button>
                    }
                />
            </Group>
            <LabelsList type={TypeColors.success} labels={RecomendedImageLabels} header='Рекомендации к фотографиям:' />
            <LabelsList type={TypeColors.error} labels={NoRecomendedImageLabels} header='Не рекомендуем использовать:' />
        </Panel>
    )
}

export default SelectImagePanel;
