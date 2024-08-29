import React, {useContext, useEffect} from 'react';

import {
    Alert,
    Banner,
    Button,
    ButtonGroup,
    Group,
    Panel,
    PanelHeader,
    PanelSpinner,
    Placeholder
} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getPhotoUploadId, getWallData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {apiGetGenerateImage, updateShareGenerateImage} from "../../api/AxiosApi";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {setAccessToken} from "../../redux/slice/UserSlice";
import {useDispatch, useSelector} from "react-redux";
import {ModalTypes} from "../../modals/ModalRoot";
import {setWindowBlocked} from "../../redux/slice/AppStatusesSlice";
import {ColorsList} from "../../types/ColorTypes";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceImageInterface, setUploadPhoto} from "../../redux/slice/ImageSlice";
import {WallMessagesEnum} from "../../enum/MessagesEnum";
import {Icon28AdvertisingOutline} from "@vkontakte/icons";

interface Props {
    id: string;
}

const ShareWallImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo, isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const routeNavigator = useRouteNavigator();
    const params = useParams<'imageGeneratedId'>();
    const dispatch = useDispatch();

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

    const shareWall = async () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'photos,wall'
        })
            .then(async (data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))
                    let photoId = uploadPhoto.photoUploadId;

                    if (!photoId) {
                        dispatch(setWindowBlocked(true))
                        routeNavigator.showModal(ModalTypes.MODAL_UPLOAD_PHOTO_PRELOADER);
                        photoId = await getPhotoUploadId(data.access_token, Number(params?.imageGeneratedId));
                        dispatch(setUploadPhoto({...uploadPhoto, photoUploadId: photoId}))
                        dispatch(setWindowBlocked(false))
                        routeNavigator.hideModal();
                    }

                    if (uploadPhoto && vkUserInfo) {
                        const wallData = getWallData({photoUploadId: photoId, vkUserInfo, wallMessage: WallMessagesEnum[uploadPhoto.type]});
                        bridge.send('VKWebAppShowWallPostBox', wallData).then((r) => {
                            if (r.post_id) {
                                updateShareGenerateImage(Number(params?.imageGeneratedId), ShareTypeEnum.SHARE_WALL)
                            }
                        }).catch();
                    }
                } else {
                    rejectAccessToken()
                }
            })
            .catch((error) => {
                console.log(error);
                rejectAccessToken()
            });
    }

    useEffect(() => {
        (async () => {
            if (params?.imageGeneratedId) {
                dispatch(setUploadPhoto({url: '', base64: '', photoUploadId: '', created_at: '',type: 'default', image_type: { name: ''}}))
                const response = await apiGetGenerateImage(Number(params?.imageGeneratedId));
                dispatch(setUploadPhoto({...response, photoUploadId: '',}))
            }
        })()
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Результат</PanelHeader>
            {
                uploadPhoto.url
                ?
                    <Group>
                        <Placeholder
                            stretched
                            icon={<div id="animateHeartWrapper">
                                <div className="animateHeart" style={{color: ColorsList.error}}>
                                    <svg width={96} height={96} viewBox="0 0 24 24"
                                         fill={'var(--vkui--color_background_content)'}
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                                              stroke="currentcolor" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="animateHeart" style={{color: ColorsList.error}}>
                                    <svg width={96} height={96} viewBox="0 0 24 24"
                                         fill={'var(--vkui--color_background_content)'}
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                                              stroke="currentcolor" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>}
                            header={`${vkUserInfo?.first_name}, ваш новый образ готов! Поделитесь с друзьями вашим перевоплощением и соберите много лайков и комментариев!`}
                            action={
                            <>
                                {
                                    uploadPhoto?.available_share_free_image &&
                                    <Banner
                                        style={{
                                            padding: 0,
                                        }}
                                        mode="image"
                                        size="m"
                                        background={
                                            <div
                                                style={{
                                                    backgroundColor: ColorsList.primary,
                                                }}
                                            />
                                        }
                                        header="Посмотреть и поделиться на стене"
                                        subheader="Вы получите ещё +1 генерацию бесплатно!"
                                        actions={<Button onClick={shareWall} stretched before={<Icon28AdvertisingOutline/>} appearance="overlay" size="l">Поделиться на стене</Button>}
                                    />
                                }
                                <ButtonGroup mode='horizontal'>
                                    {
                                        !uploadPhoto?.available_share_free_image &&
                                        <Button
                                            before={<Icon28AdvertisingOutline/>}
                                            size="l"
                                            mode="primary"
                                            stretched
                                            onClick={shareWall}
                                        >
                                            На стене
                                        </Button>
                                    }
                                    <Button mode="secondary" onClick={() => routeNavigator.push(`/show-generate-image/${params?.imageGeneratedId}/share-story`)} stretched
                                            size={isMobileSize ? 'm' : 'l'}>Пропустить</Button>
                                </ButtonGroup>
                            </>
                            }
                        />
                    </Group>
                    :
                    <PanelSpinner size="medium" />
            }
        </Panel>
    )
}

export default ShareWallImagePanel;
