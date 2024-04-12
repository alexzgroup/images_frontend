import {classNames, DivProps} from "@vkontakte/vkui";
import {ButtonGold} from "./ButtonGold";
import React from "react";
import RenestraTitleWithLogo from "./RenestraTitleWithLogo";

export const VipBlock = (props: DivProps) => {
    return (
        <div className="gold_light">
            <div
                {...props}
                className={classNames(props.className, "vip-block")}>
                <RenestraTitleWithLogo />
                <ButtonGold size="s" stretched>Открыть подробности</ButtonGold>
            </div>
        </div>
    )
}

export default VipBlock;
