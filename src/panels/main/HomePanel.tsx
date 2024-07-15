import React, {ReactElement, useContext} from 'react';

import {
    Alert,
    Banner,
    Button,
    Div,
    Group,
    Header,
    HorizontalCell,
    HorizontalScroll,
    Image,
    Panel,
    Placeholder,
    Separator,
    SimpleCell,
    Snackbar
} from '@vkontakte/vkui';
import girl_image from '../../assets/images/icons/girl_icon.png';
import {
    Icon28CancelCircleFillRed,
    Icon28CheckCircleOutline,
    Icon28DiamondOutline,
    Icon28Users3
} from "@vkontakte/icons";
import DivCard from "../../components/DivCard";
import {GenerateImageNoShareType, imageType, ShareTypeEnum} from "../../types/ApiTypes";
import {IconImageTypeGenerator} from "../../components/IconImageTypeGenerator";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setAccessToken} from "../../redux/slice/UserSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import bridge from "@vkontakte/vk-bridge";
import {apiAddAppToGroup, updateShareGenerateImage} from "../../api/AxiosApi";
import {ColorsList} from "../../types/ColorTypes";
import VipBlock from "../../components/RenestraVip/VipBlock";
import {deleteGenerateImagesNotShareWall, ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {hideAppLoading, showAppLoading} from "../../redux/slice/AppStatusesSlice";
import {getPhotoUploadId, getWallData} from "../../helpers/AppHelper";
import {WallMessagesEnum} from "../../enum/MessagesEnum";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

interface Props {
    id: string;
}

const HomePanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {popularImageTypes, favoriteImageTypes, generateImagesNotShareWall} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);
    const dispatch = useDispatch();
    const {isMobileSize, vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            routeNavigator.showModal(ModalTypes.MODAL_PAY_VOICE)
        } else {
            routeNavigator.push('/generate/select-default-image/' + imageTypeItem.id)
        }
    }

    const addAppToGroup = () => {
        bridge.send('VKWebAppAddToCommunity')
            .then((data) => {
                if (data.group_id) {
                    apiAddAppToGroup(data.group_id)
                        .then((r) => {
                            if (r.result) {
                                openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Приложение подключено.')
                            }
                        })
                        .catch((error) => {
                            openSnackBar(<Icon28CancelCircleFillRed />, 'Произошла ошибка');
                            console.error(error.message);
                        })
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

    const shareWall = async (generateImage: GenerateImageNoShareType) => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'photos,wall'
        })
            .then(async (data) => {
                if (data.access_token) {
                    dispatch(showAppLoading())
                    dispatch(setAccessToken(data.access_token))
                    const photoId = await getPhotoUploadId(data.access_token, generateImage.id);

                    if (photoId && vkUserInfo) {
                        const wallData = getWallData({photoUploadId: photoId, vkUserInfo, wallMessage: WallMessagesEnum[generateImage.type as never]});
                        await bridge.send('VKWebAppShowWallPostBox', wallData).then((r) => {
                            if (r.post_id) {
                                updateShareGenerateImage(generateImage.id, ShareTypeEnum.SHARE_WALL)
                                dispatch(deleteGenerateImagesNotShareWall(generateImage.id))
                                openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success}/>, 'Запись опубликована');
                            }
                        }).catch(() => {
                            dispatch(hideAppLoading())
                        });
                    }
                    dispatch(hideAppLoading())
                } else {
                    rejectAccessToken()
                }
            })
            .catch((error) => {
                console.log(error);
                rejectAccessToken()
            });
    }

    const rejectAccessToken = () => {
        routeNavigator.showPopout(
            <Alert
                actions={[
                    {
                        title: 'Понятно',
                        autoClose: true,
                        mode: 'destructive',
                    },
                ]}
                onClose={() => {
                    routeNavigator.hidePopout();
                }}
                header="Внимание!"
                text="Для публикации результата разрешите доступ."
            />
        );
    }

    return (<Panel id={id}>
            <Group mode='plain'>
                <DivCard>
                    <Placeholder
                        icon={<Image src={girl_image} size={56}/>}
                        header="Ренестра - генератор изображений"
                        action={<Button onClick={() => routeNavigator.push('/generate')} size="l">Поехали</Button>}
                    >
                        Примерь на себя стильный образ, стань воином или фэнтези персонажем с помощью ИИ.
                    </Placeholder>
                </DivCard>
            </Group>
            {
                !!favoriteImageTypes.length &&
                <Group header={<Header mode='secondary'>Избранные образы</Header>}>
                    <HorizontalScroll>
                        <div style={{ display: 'flex' }}>
                            {
                                favoriteImageTypes.map((item, key) => (
                                    <HorizontalCell
                                        onClick={() => routeNavigator.push(`/generate/select-${item.type}-image/${item.id}`)}
                                        key={item.id} size="l" header={item.name} subtitle={item.description}>
                                        <img style={{
                                            width: 220,
                                            height: 124,
                                            borderRadius: 10,
                                            boxSizing: 'border-box',
                                            border: 'var(--vkui--size_border--regular) solid var(--vkui--color_image_border_alpha)',
                                            objectFit: 'cover',
                                        }} src={item.url}  alt='Ренестра' />
                                    </HorizontalCell>
                                ))
                            }
                        </div>
                    </HorizontalScroll>
                </Group>
            }
            {!!generateImagesNotShareWall.length &&
                <Group header={<Header mode='secondary' multiline>вы не сохранили данные генерации на стене</Header>}>
                    <HorizontalScroll>
                        <div style={{ display: 'flex' }}>
                            {
                                generateImagesNotShareWall.map((item, key) => (
                                    <HorizontalCell
                                        onClick={() => shareWall(item)}
                                        key={item.id} size={isMobileSize ? 'm' : 'l'}>
                                        <Image size={isMobileSize ? 90 : 128} borderRadius="m" src={item.url} />
                                    </HorizontalCell>
                                ))
                            }
                        </div>
                    </HorizontalScroll>
                </Group>
            }
            <Group mode='plain'>
                <DivCard>
                    <Div>
                        <Button
                            mode='secondary'
                            hasActive={false}
                            hasHover={false}
                            before={<Icon28DiamondOutline fill='var(--vkui--color_accent_red)'/>}>Популярные образы</Button>
                    </Div>
                    <Separator/>
                    {
                        !!popularImageTypes.length && popularImageTypes.map((value, key) => <SimpleCell
                            key={key}
                            onClick={() => openImageType(value)}
                            before={IconImageTypeGenerator(value.id)}>{value.name}
                        </SimpleCell>)
                    }
                </DivCard>
            </Group>
            {
                !userDbData?.is_vip &&
                    <Group mode='plain'>
                        <Div>
                            <VipBlock />
                        </Div>
                    </Group>
            }
            <Div>
                <Banner
                    mode="image"
                    header="Подключить приложение в сообщество"
                    subheader="Позволь своим подписчикам генерировать аватарки прямо с вашей группы. Подключайте приложение в свою группу!"
                    background={
                        <div
                            style={{
                                background: 'linear-gradient(45deg, #00A700 0%, #A0B500 100%)',
                            }}
                        />
                    }
                    style={{
                        padding: 0,
                        margin: 0,
                        marginBottom: 10,
                    }}
                    actions={<Button onClick={addAppToGroup}
                                     size='l'
                                     before={<Icon28Users3 />}
                                     mode="outline"
                                     appearance="overlay">Подключить сообщество</Button>}
                />
            </Div>
            {snackbar}
        </Panel>
    )
}


export default HomePanel;
