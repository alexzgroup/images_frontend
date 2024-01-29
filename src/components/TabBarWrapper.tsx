import {Tabbar, TabbarItem} from "@vkontakte/vkui";

import {
    Icon28MoneyCircleOutline,
    Icon28NewsfeedOutline,
    Icon28KeyboardBotsOutline,
    Icon28MagicWandOutline
} from "@vkontakte/icons";
import React, {FC} from "react";
import {useActiveVkuiLocation} from "@vkontakte/vk-mini-apps-router";
import {VIEW_CONSTANTS} from "../constants/RouterConstants";
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
const TabBarWrapper:FC<{}> = () => {
    const { view: activeView } = useActiveVkuiLocation();
    const routeNavigator = useRouteNavigator();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

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
        {/*<TabbarItem*/}
        {/*    onClick={() => routeNavigator.push(userDbData?.is_monetization ? '/monetization/profile' : '/monetization')}*/}
        {/*    selected={activeView === VIEW_CONSTANTS.VIEW_MONETIZATION}*/}
        {/*    text="Монетизация"*/}
        {/*>*/}
        {/*    <Icon28MoneyCircleOutline/>*/}
        {/*</TabbarItem>*/}
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
