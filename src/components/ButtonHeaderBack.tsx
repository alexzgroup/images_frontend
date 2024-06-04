import {useFirstPageCheck, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {PanelHeaderBack} from "@vkontakte/vkui";
import React from "react";

const ButtonHeaderBack = (props: any) => {
    const routeNavigator = useRouteNavigator();
    const isFirstPage = useFirstPageCheck();
    return !isFirstPage ? <PanelHeaderBack onClick={() => routeNavigator.back()} /> : <></>
}

export default ButtonHeaderBack;
