import React, {useContext, useEffect} from 'react';

import {Alert, Button, ButtonGroup, Caption, Group, Panel, PanelHeader, PanelSpinner} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getPhotoUploadId, getStoryBoxData, getWallData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {updateShareGenerateImage} from "../../api/AxiosApi";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {setAccessToken} from "../../redux/slice/UserSlice";
import {useDispatch, useSelector} from "react-redux";
import {ModalTypes} from "../../modals/ModalRoot";
import {setWindowBlocked} from "../../redux/slice/AppStatusesSlice";
import {ReduxSliceImageInterface, setUploadPhoto} from "../../redux/slice/ImageSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {WallMessagesEnum} from "../../enum/MessagesEnum";
import {Icon24StoryReplyOutline} from "@vkontakte/icons";

interface Props {
    id: string;
}

const ShowGeneratedImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const routeNavigator = useRouteNavigator();
    const params = useParams<'imageGeneratedId'>();
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
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
                text="Для просмотра результата, разрешите доступ."
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

    const shareStore = async (imageGeneratedId: number) => {
        if (uploadPhoto) {
            const storyData = getStoryBoxData(uploadPhoto.base64);
            bridge.send('VKWebAppShowStoryBox', storyData).then((r) => {
                if (r.result) {
                    updateShareGenerateImage(imageGeneratedId, ShareTypeEnum.SHARE_HISTORY)
                    routeNavigator.push(`/show-generate-image/${params?.imageGeneratedId}`)
                }
            });
        }
    }

    useEffect(() => {
        if (!uploadPhoto.url) {
            routeNavigator.push('/');
        }
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Результат генерации</PanelHeader>
            {
                (uploadPhoto.url)
                    ?
                <Group>
                    <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', rowGap: 25}}>
                        <img
                            style={{maxWidth: '100%', margin: "auto", height: '50vh', borderRadius: 'var(--vkui--size_border_radius--regular)'}}
                            src={uploadPhoto.url}
                            alt=''/>
                        <ButtonGroup mode='vertical'>
                            <Button before={<Icon24StoryReplyOutline />} onClick={shareWall} stretched size='l'>
                                Посмотреть и поделиться на стене
                                {
                                    uploadPhoto?.available_share_free_image && <Caption level="3">Вы получите ещё +1 генерацию бесплатно!</Caption>
                                }
                            </Button>
                            <Button onClick={() => shareStore(Number(params?.imageGeneratedId))} stretched size='l'>Поделиться с друзьями в истории</Button>
                        </ButtonGroup>
                    </div>
                </Group>
                    :
                <PanelSpinner size="medium" />
            }
        </Panel>
    )
}

export default ShowGeneratedImagePanel;
