import {Title} from "@vkontakte/vkui";
import {useContext} from "react";
import {AppContext, TAppContext} from "../../context/AppContext";

export const RenestraTitleWithVip = () =>
{

    return (
        <div style={{display: 'flex', gap: 5, alignItems: 'center'}} className="renestra-vip-title">
            <Title >Renestra</Title>
            <div className="gold_button" style={{fontSize: 14, padding: '2px 10px', fontWeight: 'normal', borderRadius: 7, alignSelf: 'center'}}>
                VIP
            </div>
        </div>
    )
}

export default RenestraTitleWithVip;
