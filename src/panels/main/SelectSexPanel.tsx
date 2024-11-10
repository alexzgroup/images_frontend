import React, {useContext} from 'react';

import {Button, ButtonGroup, Panel, PanelHeader, Placeholder} from '@vkontakte/vkui';
import {Icon28Crown, Icon28LikeCircleFillRed, Icon56ErrorOutline} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserDbData} from "../../redux/slice/UserSlice";
import {apiEditUser, apiInitUser} from "../../api/AxiosApi";
import {hideAppLoading} from "../../redux/slice/AppStatusesSlice";
import {setFavoriteImageTypes, setGenerateImagesNotShareWall, setPopularImageTypes} from "../../redux/slice/ImageSlice";
import {AppContext, TAppContext} from "../../context/AppContext";

interface Props {
    id: string;
}

const SelectSexPanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {lang} = useContext<TAppContext>(AppContext);

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
                <PanelHeader>{lang.HEADERS.SELECT_SEX_PANEL}</PanelHeader>
                <Placeholder
                    stretched
                    icon={<Icon56ErrorOutline />}
                    header={lang.TITLES.SELECT_SEX_PANEL_PLACEHOLDER_TITLE}
                    action={
                        <ButtonGroup mode='vertical'>
                            <Button before={<Icon28LikeCircleFillRed/>}
                                    appearance="negative"
                                    mode="outline"
                                    stretched
                                    onClick={() => updateSex(1)} size='l'>{lang.BUTTONS.SELECT_SEX_PANEL_WOMEN}</Button>
                            <Button before={<Icon28Crown/>}
                                    appearance="accent"
                                    mode="primary"
                                    stretched
                                    onClick={() => updateSex(2)} size='l'>{lang.BUTTONS.SELECT_SEX_PANEL_MEN}</Button>
                        </ButtonGroup>
                    }
                >
                    {lang.DESCRIPTIONS.SELECT_SEX_PANEL_FOOTER}
                </Placeholder>
           </Panel>
}


export default SelectSexPanel;
