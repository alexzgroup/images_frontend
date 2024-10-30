import RenestraTitleWithVip from "./RenestraTitleWithVip";
import vipLogo from "../../assets/images/vip_logo.png";
import React, {useContext} from "react";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

const styleGridDiv = {
    alignSelf: 'start',
    flexGrow: 1,
    flexBasis: '50%',
}

export const RenestraTitleWithLogo = () =>
{
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);
    return (
        <div style={{
            display: "flex",
            justifyContent: 'space-between',
        }}
        >
            <div style={styleGridDiv}>
                <RenestraTitleWithVip/>
                <p>{lang.DESCRIPTIONS.VIP_BLOCK_1}</p>
                <p>{lang.DESCRIPTIONS.VIP_BLOCK_2}</p>
                <p>{lang.DESCRIPTIONS.VIP_BLOCK_3}</p>
            </div>
            <div style={{...styleGridDiv, ...{textAlign: "right"}}}>
                <img style={{
                    maxWidth: '100%',
                    maxHeight: '120px',
                }} src={vipLogo} alt="vip logo"/>
            </div>
        </div>
    )
}


export default RenestraTitleWithLogo;
