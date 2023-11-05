import {
    Icon24CrownCircleFillVkDating,
    Icon24GunOutline,
    Icon24SkullOutline, Icon24SneakerOutline,
    Icon24UserCircleOutline,
    Icon28IncognitoOutline,
    Icon28LotusOutline,
    Icon28MagicWandOutline
} from "@vkontakte/icons";
import React from "react";

export const IconImageTypeGenerator = (id: number): JSX.Element => {
    switch (id) {
        case 1:
            return <Icon28LotusOutline />
        case 2:
            return <Icon28IncognitoOutline />
        case 3:
            return <Icon28MagicWandOutline />
        case 4:
            return <Icon24UserCircleOutline />
        case 5:
            return <Icon24SkullOutline />
        case 6:
            return <Icon24GunOutline />
        case 7:
            return <Icon24CrownCircleFillVkDating />
        case 8:
            return <Icon24SneakerOutline />
        default:
            return <Icon28LotusOutline />
    }
}
