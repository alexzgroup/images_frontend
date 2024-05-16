import RenestraTitleWithVip from "./RenestraTitleWithVip";
import vipLogo from "../../assets/images/vip_logo.png";
import React from "react";

const styleGridDiv = {
    alignSelf: 'start',
    flexGrow: 1,
    flexBasis: '50%',
}

export const RenestraTitleWithLogo = () =>
{
    return (
        <div style={{
            display: "flex",
            justifyContent: 'space-between',
        }}
        >
            <div style={styleGridDiv}>
                <RenestraTitleWithVip />
                <p>20 генераций в день</p>
                <p>Эксклюзивные образы</p>
                <p>и другие преимущества!</p>
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
