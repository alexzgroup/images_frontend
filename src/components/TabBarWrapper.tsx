import {Tabbar, TabbarItem} from "@vkontakte/vkui";

import {Icon28KeyboardBotsOutline, Icon28MagicWandOutline, Icon28NewsfeedOutline} from "@vkontakte/icons";
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
