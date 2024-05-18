import {Tabbar, TabbarItem} from "@vkontakte/vkui";

import {
    Icon28KeyboardBotsOutline,
    Icon28MagicWandOutline,
    Icon28NewsfeedOutline,
    Icon28UserCircleOutline,
    Icon28Users
} from "@vkontakte/icons";
import React, {FC} from "react";
import {useActiveVkuiLocation, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {VIEW_CONSTANTS} from "../constants/RouterConstants";

const TabBarWrapper:FC<{}> = () => {
    const { view: activeView } = useActiveVkuiLocation();
    const routeNavigator = useRouteNavigator();

return (
    <Tabbar>
        <TabbarItem
            onClick={() => routeNavigator.push('/')}
            selected={activeView === VIEW_CONSTANTS.VIEW_MAIN}
            text="Главная"
        >
            <Icon28NewsfeedOutline/>
        </TabbarItem>
        <TabbarItem
            onClick={() => routeNavigator.push('/generate')}
            selected={activeView === VIEW_CONSTANTS.VIEW_GENERATE_IMAGE}
            text="Генерация"
        >
            <Icon28MagicWandOutline/>
        </TabbarItem>
        <TabbarItem
            onClick={() => routeNavigator.push('/profile')}
            selected={activeView === VIEW_CONSTANTS.VIEW_PROFILE}
            text="Профиль"
        >
            <Icon28UserCircleOutline/>
        </TabbarItem>
        <TabbarItem
            onClick={() => routeNavigator.push('/friends')}
            selected={activeView === VIEW_CONSTANTS.VIEW_FRIENDS}
            text="Друзья"
        >
            <Icon28Users/>
        </TabbarItem>
        <TabbarItem
            onClick={() => routeNavigator.push('/about')}
            selected={activeView === VIEW_CONSTANTS.VIEW_ABOUT}
            text="О приложении"
        >
            <Icon28KeyboardBotsOutline/>
        </TabbarItem>
    </Tabbar>
    )
}

export default TabBarWrapper;
