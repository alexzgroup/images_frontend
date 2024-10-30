import {classNames, DivProps} from "@vkontakte/vkui";
import {ButtonGold} from "./ButtonGold";
import React, {useContext} from "react";
import RenestraTitleWithLogo from "./RenestraTitleWithLogo";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

export const VipBlock = (props: DivProps) => {
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);
    return (
        <div className="gold_light">
            <div
                {...props}
                className={classNames(props.className, "vip-block")}>
                <RenestraTitleWithLogo />
                <ButtonGold size="s" stretched>{lang.TITLES.VIP_BLOCK_GOLD_BUTTON}</ButtonGold>
            </div>
        </div>
    )
}

export default VipBlock;
