import React, {useContext, useEffect} from 'react';

import {Button, ButtonGroup, Group, Panel, PanelHeader, PanelSpinner, Placeholder} from '@vkontakte/vkui';
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {apiGetGenerateImage} from "../../api/AxiosApi";
import {useDispatch, useSelector} from "react-redux";
import {ColorsList} from "../../types/ColorTypes";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceImageInterface, setUploadPhoto} from "../../redux/slice/ImageSlice";

interface Props {
    id: string;
}

const ShareWallImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo, isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const routeNavigator = useRouteNavigator();
    const params = useParams<'imageGeneratedId'>();
    const dispatch = useDispatch();


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
                                <ButtonGroup mode='vertical'>
                                    <Button mode="secondary"
                                            onClick={() => routeNavigator.push(`/show-generate-image/${params?.imageGeneratedId}/share-story`)}
                                            stretched
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
