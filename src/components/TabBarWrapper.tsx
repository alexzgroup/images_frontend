import {Tabbar, TabbarItem} from "@vkontakte/vkui";

import {
    Icon28KeyboardBotsOutline,
    Icon28MagicWandOutline,
    Icon28NewsfeedOutline,
    Icon28UserCircleOutline
} from "@vkontakte/icons";
import React, {FC, useContext} from "react";
import {useActiveVkuiLocation, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {VIEW_CONSTANTS} from "../constants/RouterConstants";
import {AppContext, TAppContext} from "../context/AppContext";

const TabBarWrapper:FC<{}> = () => {
    const { view: activeView } = useActiveVkuiLocation();
    const routeNavigator = useRouteNavigator();
    const {lang} = useContext<TAppContext>(AppContext);

return (
    <Tabbar>
        <TabbarItem
            onClick={() => routeNavigator.push('/')}
            selected={activeView === VIEW_CONSTANTS.VIEW_MAIN}
            text={lang.HEADERS.MAIN_PANEL}
        >
            <Icon28NewsfeedOutline/>
        </TabbarItem>
        <TabbarItem
            onClick={() => routeNavigator.push('/generate')}
            selected={activeView === VIEW_CONSTANTS.VIEW_GENERATE_IMAGE}
            text={lang.HEADERS.VIEW_GENERATE}
        >
            <Icon28MagicWandOutline/>
        </TabbarItem>
        <TabbarItem
            onClick={() => routeNavigator.push('/profile')}
            selected={activeView === VIEW_CONSTANTS.VIEW_PROFILE}
            text={lang.HEADERS.PROFILE_PANEL}
        >
            <Icon28UserCircleOutline/>
        </TabbarItem>
        <TabbarItem
            onClick={() => routeNavigator.push('/about')}
            selected={activeView === VIEW_CONSTANTS.VIEW_ABOUT}
            text={lang.HEADERS.ABOUT_PANEL}
        >
            <Icon28KeyboardBotsOutline/>
        </TabbarItem>
    </Tabbar>
    )
}

export default TabBarWrapper;
