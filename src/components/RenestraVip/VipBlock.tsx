import {classNames, DivProps} from "@vkontakte/vkui";
import {ButtonGold} from "./ButtonGold";
import React, {useContext} from "react";
import RenestraTitleWithLogo from "./RenestraTitleWithLogo";
import {AppContext, TAppContext} from "../../context/AppContext";
import {CardMedia, Grid2} from "@mui/material";
import vipLogo from "../../assets/images/vip_logo.png";
import RenestraTitleWithVip from "./RenestraTitleWithVip";

export const VipBlock = (props: DivProps) => {
    const {lang} = useContext<TAppContext>(AppContext);
    return (
        <div className="gold_light">
            <div
                {...props}
                className={classNames(props.className, "vip-block")}>
                <CardMedia
                    component="img"
                    height="190"
                    image={vipLogo}
                    alt="Paella dish"
                />
                <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                        <RenestraTitleWithVip />
                    </Grid2>
                    <Grid2 size={6}>
                        <div style={{
                            display: "flex",
                            justifyContent: 'space-between',
                        }}
                        >
                            <div>
                                <p>{lang.DESCRIPTIONS.VIP_BLOCK_1}</p>
                                <p>{lang.DESCRIPTIONS.VIP_BLOCK_2}</p>
                                <p>{lang.DESCRIPTIONS.VIP_BLOCK_3}</p>
                            </div>
                        </div>
                    </Grid2>
                </Grid2>
                <ButtonGold color='inherit'>{lang.TITLES.VIP_BLOCK_GOLD_BUTTON}</ButtonGold>
            </div>
        </div>
    )
}

export default VipBlock;
