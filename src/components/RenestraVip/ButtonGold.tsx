import {Button, ButtonProps} from "@vkontakte/vkui";
import React from "react";
import {ModalTypes} from "../../modals/ModalRoot";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export const ButtonGold = (props: ButtonProps) => {
    const routeNavigator = useRouteNavigator();
    return <Button {...props} onClick={() => routeNavigator.showModal(ModalTypes.MODAL_PAY_VOICE)} className="gold_button">
        <div style={{
            color: "black",
            fontSize: 16,
        }}>{props.children}</div>
    </Button>
}
