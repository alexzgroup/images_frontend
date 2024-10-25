import React from 'react';

import {Button, ButtonGroup, Panel, PanelHeader, Placeholder} from '@vkontakte/vkui';
import {Icon28Crown, Icon28LikeCircleFillRed, Icon56ErrorOutline} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserDbData} from "../../redux/slice/UserSlice";
import {apiEditUser, apiInitUser} from "../../api/AxiosApi";
import {hideAppLoading} from "../../redux/slice/AppStatusesSlice";
import {setFavoriteImageTypes, setGenerateImagesNotShareWall, setPopularImageTypes} from "../../redux/slice/ImageSlice";

interface Props {
    id: string;
}

const SelectSexPanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const updateSex = (sex: 1|2) => {
        if (userDbData?.id) {
            apiEditUser(userDbData.id, {sex})
                .then(async (r) => {
                    if (r.result && userDbData) {
                        const {popular_image_types, user, favorite_image_types, generated_images_not_share_wall} = await apiInitUser();

                        dispatch(setUserDbData(user));
                        dispatch(hideAppLoading());
                        dispatch(setPopularImageTypes(popular_image_types));
                        dispatch(setFavoriteImageTypes(favorite_image_types));
                        dispatch(setGenerateImagesNotShareWall(generated_images_not_share_wall));

                        routeNavigator.push('/')
                    }
            })
        }
    }

    return <Panel id={id}>
                <PanelHeader>Выберите пол</PanelHeader>
                <Placeholder
                    stretched
                    icon={<Icon56ErrorOutline />}
                    header="Для выбора нажмите кнопку"
                    action={
                        <ButtonGroup mode='vertical'>
                            <Button before={<Icon28LikeCircleFillRed/>}
                                    appearance="negative"
                                    mode="outline"
                                    stretched
                                    onClick={() => updateSex(1)} size='l'>Женский</Button>
                            <Button before={<Icon28Crown/>}
                                    appearance="accent"
                                    mode="primary"
                                    stretched
                                    onClick={() => updateSex(2)} size='l'>Мужской</Button>
                        </ButtonGroup>
                    }
                >
                    Необходимо выбрать пол, в дальнейшем вы можете его поменять в разделе профиль.
                </Placeholder>
           </Panel>
}


export default SelectSexPanel;
